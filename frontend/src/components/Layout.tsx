import { NavLink, Outlet } from "react-router-dom";
import { FileText, LayoutDashboard, Code2 } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/api", label: "API", icon: Code2 },
];

export function Layout() {
  return (
    <div className="min-h-screen flex bg-neutral-50">
      <aside className="w-56 border-r border-neutral-200 bg-white flex flex-col">
        <div className="p-6">
          <div className="text-lg font-semibold tracking-tight">ParseFlow</div>
          <div className="text-xs text-neutral-500 mt-1">Document Intelligence</div>
        </div>
        <nav className="flex-1 px-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-neutral-100 text-neutral-900 font-medium"
                    : "text-neutral-600 hover:bg-neutral-50"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 text-xs text-neutral-400 border-t border-neutral-200">
          v0.1 · Demo
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}