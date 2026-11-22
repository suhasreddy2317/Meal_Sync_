import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static files and internal routes bypass
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const { supabase, response } = await updateSession(request);

  // Check Supabase session first
  let user = null;
  let userRole: string | null = null;

  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
    if (user) {
      // Check user role from metadata or cookie fallback
      userRole = (user.user_metadata?.role as string) || null;
    }
  } catch {
    // If Supabase is offline or dummy credentials
  }

  // Fallback / local demo session support
  const localRole = request.cookies.get("mess_session_role")?.value;
  if (!userRole && localRole) {
    userRole = localRole;
  }

  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const isStudentRoute = pathname.startsWith("/student");
  const isAdminRoute = pathname.startsWith("/admin");

  // If logged in and visiting login/register -> redirect to appropriate dashboard
  if (isAuthRoute && userRole) {
    const target = userRole === "admin" ? "/admin/dashboard" : "/student/dashboard";
    return NextResponse.redirect(new URL(target, request.url));
  }

  // Guard Student Routes
  if (isStudentRoute && !userRole) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Guard Admin Routes
  if (isAdminRoute) {
    if (!userRole) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (userRole !== "admin") {
      // Forbidden: student cannot access admin routes
      return NextResponse.redirect(new URL("/student/dashboard?error=unauthorized", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/student/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
