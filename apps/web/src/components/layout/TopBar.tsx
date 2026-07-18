"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, Search, Menu, LogOut, User, Settings, Check } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type TopBarProps = {
  role: "student" | "employee" | "admin";
  onMenuToggle: () => void;
};

export default function TopBar({ role, onMenuToggle }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate dynamic breadcrumb array
  const pathSegments = pathname.split("/").filter((seg) => seg);
  const breadcrumbs = pathSegments.map((segment, index) => {
    let href = "/" + pathSegments.slice(0, index + 1).join("/");
    if (href === "/admin") href = "/admin/dashboard";
    if (href === "/employee") href = "/employee/dashboard";
    if (href === "/student") href = "/student/dashboard";
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    return { label, href };
  });

  // Mock Notification data
  const notifications = [
    { id: 1, title: "Assignment Submitted Successfully", time: "2 hours ago", read: false },
    { id: 2, title: "New Job Match: Senior React Developer", time: "5 hours ago", read: false },
    { id: 3, title: "Profile review completed by Marcus Thorne", time: "1 day ago", read: true },
  ];

  // Default avatar per role (fallback if user doesn't have one)
  const defaultAvatars = {
    student: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=faces",
    employee: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
    admin: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
  };

  const [currentUser, setCurrentUser] = useState<any>({
    name: "Loading...",
    email: "",
    avatar: defaultAvatars[role],
  });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success && payload.user) {
          setCurrentUser({
            name: payload.user.name,
            email: payload.user.email,
            avatar: defaultAvatars[role],
          });
        }
      })
      .catch(() => {
        // If auth fails, keep default state
      });
  }, [role]);

  const handleSignOut = async () => {
    setProfileOpen(false);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
      {/* Breadcrumbs and Menu Toggle */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Dynamic Breadcrumbs */}
        <nav className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold text-slate-500" aria-label="Breadcrumb">
          <Link href={`/${role}/dashboard`} className="hover:text-slate-700">
            EpitomeTRC
          </Link>
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <span key={crumb.href} className="flex items-center space-x-1.5">
                <span>/</span>
                {isLast ? (
                  <span className="text-[#0b172a] font-bold">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-slate-700">
                    {crumb.label}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3.5">
        {/* Search Box */}
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses, jobs, resources..."
            className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 text-xs font-medium outline-none transition-all focus:border-orange-500 focus:bg-white"
          />
        </div>

        {/* Notifications Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500"></span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2.5 w-80 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-3.5 py-2.5 border-b border-slate-100 flex justify-between items-center">
                <span className="text-xs font-bold text-[#0b172a]">Notifications</span>
                <button className="text-[10px] font-bold text-orange-500 hover:text-orange-600">Mark all as read</button>
              </div>
              <div className="max-h-64 overflow-y-auto pt-1">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      "rounded-xl p-3 text-xs leading-relaxed transition-colors hover:bg-slate-50 cursor-pointer flex gap-2.5 items-start",
                      !notif.read && "bg-slate-50/40"
                    )}
                  >
                    <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", notif.read ? "bg-slate-300" : "bg-orange-505")}></span>
                    <div>
                      <p className="font-semibold text-slate-700">{notif.title}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-xl p-1 hover:bg-slate-50 transition-colors"
          >
            <div className="relative h-8 w-8 overflow-hidden rounded-full border border-slate-200">
              <Image
                src={currentUser.avatar}
                alt={currentUser.name}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <div className="hidden lg:block text-left pr-1.5">
              <p className="text-xs font-bold text-[#0b172a] leading-none">{currentUser.name}</p>
              <span className="text-[9px] font-bold text-orange-500 uppercase tracking-wider block mt-1 leading-none">{role}</span>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2.5 w-56 rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-3.5 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-[#0b172a] leading-none">{currentUser.name}</p>
                <p className="text-[10px] font-medium text-slate-400 mt-1 truncate">{currentUser.email}</p>
              </div>
              <div className="py-1">
                <Link
                  href={`/${role}/profile`}
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  <User className="h-4 w-4" />
                  My Profile
                </Link>
                <Link
                  href={`/${role}/settings` as any}
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  <Settings className="h-4 w-4" />
                  Account Settings
                </Link>
              </div>
              <div className="border-t border-slate-100 pt-1.5">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
