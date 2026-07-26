import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Bell,
  Zap,
  Users,
  FileText,
  Server,
  AlertTriangle,
  BarChart3,
  Settings,
  Globe,
  SlidersHorizontal,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/notifications", icon: Bell, label: "Notifications" },
  { to: "/simulator", icon: Zap, label: "Event Simulator" },
  { to: "/users", icon: Users, label: "Users" },
  { to: "/templates", icon: FileText, label: "Templates" },
  { to: "/providers", icon: Server, label: "Providers" },
  { to: "/dlq", icon: AlertTriangle, label: "DLQ" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/preferences", icon: SlidersHorizontal, label: "Preferences" },
  { to: "/settings", icon: Settings, label: "Settings" },
  { to: "/viewer", icon: Globe, label: "Website Viewer" },
];

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <h1 className="text-lg font-bold text-primary">pro4</h1>
          <span className="ml-2 text-xs text-text-muted bg-border px-2 py-0.5 rounded">
            Engine
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-text-muted hover:bg-border/50 hover:text-text"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <p className="text-xs text-text-muted">Notification Engine v1.0</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}