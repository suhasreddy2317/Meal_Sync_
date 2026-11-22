import { AdminSidebar } from "@/components/admin/sidebar";
import { getCurrentUser } from "@/app/actions/auth-actions";
import { redirect } from "next/navigation";
import { QubiteLogo } from "@/components/shared/qubite-logo";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/student/dashboard?error=unauthorized");
  }

  return (
    <div className="admin-theme min-h-screen min-w-0 overflow-x-hidden flex bg-[#FFF5EF] text-[#241D1B] antialiased">
      {/* Dark Sidebar */}
      <div className="hidden lg:block shrink-0">
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white/90 border-b border-[#EADCD6] px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <QubiteLogo size="xs" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-950 bg-amber-400 px-2.5 py-1 rounded-lg">
              MealSync Admin Console
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">•</span>
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
              Central Kitchen & Operations Management
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900">{user.full_name}</p>
              <p className="text-[11px] text-slate-500">{user.email}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-black text-xs shadow-xs">
              AD
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
