import { getCurrentUser } from "@/app/actions/auth-actions";
import { QubiteSidebar } from "@/components/student/qubite-sidebar";
import { QubiteHeader } from "@/components/student/qubite-header";
import { getNotificationsForUser } from "@/lib/data/mess-store";

export const dynamic = "force-dynamic";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const notifications = user ? getNotificationsForUser(user.id) : [];
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="student-theme min-h-screen min-w-0 overflow-x-hidden flex bg-[#FFF5EF] text-[#241D1B] antialiased">
      {/* Desktop Fixed Slate-900 Sidebar */}
      <div className="hidden lg:block shrink-0">
        <QubiteSidebar unreadNotifsCount={unreadCount} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <QubiteHeader user={user} notifications={notifications} />

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>

        {/* Minimal Footer */}
        <footer className="border-t border-slate-200 bg-white/70 py-4 px-8 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MealSync • Smarter Meals. Seamless Management.</p>
        </footer>
      </div>
    </div>
  );
}
