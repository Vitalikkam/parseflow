import { NavLink, Outlet } from "react-router-dom";
import { FileText, LayoutDashboard, Code2 } from "lucide-react";
import { Logo } from "./Logo";
import { LiveDot } from "./LiveDot";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/api", label: "API", icon: Code2 },
];

export function Layout() {
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-900 flex flex-col shrink-0">
        {/* Brand */}
        <div className="px-5 py-6 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Logo size={32} />
            <div>
              <div className="text-base font-semibold text-white leading-tight">
                ParseFlow
              </div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500">
                Document AI
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <LiveDot />
            <span className="text-[11px] text-slate-400">
              All systems operational
            </span>
          </div>
          <div className="text-[10px] text-slate-600 mt-1.5">
            v0.1 · Live Demo
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}