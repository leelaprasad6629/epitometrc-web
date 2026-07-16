"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Award,
  User,
  Users,
  Briefcase,
  Calendar,
  Settings,
  BarChart3,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

type DashboardSidebarProps = {
  role: "student" | "employee" | "admin";
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
};

export default function DashboardSidebar({ role, collapsed, setCollapsed }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Navigation configurations
  const navigationMap: Record<"student" | "employee" | "admin", SidebarItem[]> = {
    student: [
      { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
      { name: "My Courses", href: "/student/courses", icon: BookOpen },
      { name: "My Applications", href: "/student/applications", icon: ClipboardList },
      { name: "Certificates", href: "/student/certificates", icon: Award },
      { name: "AI Resume Coach", href: "/student/resume-builder", icon: FileText },
      { name: "Profile", href: "/student/profile", icon: User },
    ],
    employee: [
      { name: "Dashboard", href: "/employee/dashboard", icon: LayoutDashboard },
      { name: "Recruitment", href: "/employee/recruitment", icon: Briefcase },
      { name: "Students", href: "/employee/students", icon: Users },
      { name: "Trainings", href: "/employee/trainings", icon: BookOpen },
      { name: "Attendance", href: "/employee/attendance", icon: Calendar },
      { name: "Profile", href: "/employee/profile", icon: User },
    ],
    admin: [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Manage Students", href: "/admin/students", icon: Users },
      { name: "Manage Employees", href: "/admin/employees", icon: Briefcase },
      { name: "Manage Courses", href: "/admin/courses", icon: BookOpen },
      { name: "Manage Blogs", href: "/admin/blog", icon: FileText },
      { name: "Manage Jobs", href: "/admin/jobs", icon: ClipboardList },
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
  };

  const navItems = navigationMap[role] || [];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col justify-between border-r border-slate-200 bg-white transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Sidebar Header Logo */}
      <div>
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100">
          <Link href="/" className="flex items-center space-x-2 overflow-hidden">
            <span className="rounded-lg bg-[#0b172a] p-1.5 shrink-0">
              <ShieldCheck className="h-5 w-5 text-orange-500" />
            </span>
            {!collapsed && (
              <span className="font-display text-lg font-bold tracking-tight text-[#0b172a]">
                Epitome<span className="text-orange-500">TRC</span>
              </span>
            )}
          </Link>
          {!collapsed && (
            <button
              suppressHydrationWarning
              onClick={() => setCollapsed(true)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 hidden lg:block"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/10"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className={cn("h-4.5 w-4.5 shrink-0", isActive ? "text-white" : "text-slate-500")} />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-slate-100 p-3">
        {collapsed ? (
          <button
            suppressHydrationWarning
            onClick={() => setCollapsed(false)}
            className="flex w-full items-center justify-center rounded-xl p-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          >
            <ChevronRight className="h-4.5 w-4.5" />
          </button>
        ) : (
          <button
            suppressHydrationWarning
            onClick={() => router.push("/login")}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            <span>Sign out</span>
          </button>
        )}
      </div>
    </aside>
  );
}
