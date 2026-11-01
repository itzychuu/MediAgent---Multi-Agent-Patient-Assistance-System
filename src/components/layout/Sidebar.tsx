"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  LogOut,
  Stethoscope,
  Building2,
  ShieldCheck,
  FileText,
  Brain,
  Search,
  Users,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { UserProfile, UserRole } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface SidebarProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItemConfig {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  isPlaceholder?: boolean;
}

export function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const getNavItems = (role: UserRole): NavItemConfig[] => {
    switch (role) {
      case "patient":
        return [
          {
            title: "Patient Dashboard",
            href: "/patient",
            icon: LayoutDashboard,
          },
          {
            title: "Symptom Assessment",
            href: "#assessment",
            icon: Stethoscope,
            badge: "Phase 2",
            isPlaceholder: true,
          },
          {
            title: "Health Guidance",
            href: "#guidance",
            icon: Brain,
            badge: "Phase 2",
            isPlaceholder: true,
          },
          {
            title: "Medical Records",
            href: "#records",
            icon: FileText,
            badge: "Phase 3",
            isPlaceholder: true,
          },
          {
            title: "Find Doctors",
            href: "#discovery",
            icon: Search,
            badge: "Phase 4",
            isPlaceholder: true,
          },
          {
            title: "AI Memory & Privacy",
            href: "#privacy",
            icon: Lock,
            badge: "Phase 5",
            isPlaceholder: true,
          },
          {
            title: "My Profile",
            href: "/profile",
            icon: User,
          },
        ];

      case "doctor":
        return [
          {
            title: "Doctor Dashboard",
            href: "/doctor",
            icon: LayoutDashboard,
          },
          {
            title: "Consultation Queue",
            href: "#consultations",
            icon: Stethoscope,
            badge: "Upcoming",
            isPlaceholder: true,
          },
          {
            title: "Patient Summaries",
            href: "#patient-summaries",
            icon: FileText,
            badge: "Upcoming",
            isPlaceholder: true,
          },
          {
            title: "Doctor Profile",
            href: "/profile",
            icon: User,
          },
        ];

      case "hospital":
        return [
          {
            title: "Hospital Center",
            href: "/hospital",
            icon: Building2,
          },
          {
            title: "Departments",
            href: "#departments",
            icon: Building2,
            badge: "Upcoming",
            isPlaceholder: true,
          },
          {
            title: "Affiliated Doctors",
            href: "#affiliates",
            icon: Users,
            badge: "Upcoming",
            isPlaceholder: true,
          },
          {
            title: "Hospital Profile",
            href: "/profile",
            icon: User,
          },
        ];

      case "admin":
        return [
          {
            title: "Admin Dashboard",
            href: "/admin",
            icon: ShieldCheck,
          },
          {
            title: "Account Verifications",
            href: "/admin#approvals",
            icon: CheckCircle2,
          },
          {
            title: "User Directory",
            href: "/admin#users",
            icon: Users,
          },
          {
            title: "Admin Profile",
            href: "/profile",
            icon: User,
          },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems(user.role);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 flex w-64 flex-col justify-between border-r border-slate-800/80 bg-slate-950 px-3 py-4 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Role badge in sidebar */}
          <div className="px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-800/60">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Workspace
            </p>
            <p className="text-sm font-semibold capitalize text-teal-300">
              {user.role} Portal
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              if (item.isPlaceholder) {
                return (
                  <div
                    key={item.title}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium text-slate-500 cursor-not-allowed opacity-75"
                    title="Feature planned for future phase"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 shrink-0 text-slate-600" />
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                        {item.badge}
                      </span>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-teal-500/15 text-teal-300 border border-teal-500/30"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive ? "text-teal-400" : "text-slate-400"
                      }`}
                    />
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded bg-teal-500/10 px-1.5 py-0.5 text-[10px] font-medium text-teal-400">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

