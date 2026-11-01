"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  User,
  LogOut,
  ShieldAlert,
  ChevronDown,
  Activity,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { UserProfile } from "@/types";
import { RoleBadge, StatusBadge } from "@/components/ui/Badge";

interface HeaderProps {
  user: UserProfile;
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function Header({
  user,
  onMobileMenuToggle,
  isMobileMenuOpen = false,
}: HeaderProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 md:px-8 backdrop-blur-md">
      {/* Left side: Mobile Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white md:hidden"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        <Link
          href={`/${user.role}`}
          className="flex items-center gap-2.5 transition opacity-90 hover:opacity-100"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <Activity className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Medi<span className="text-teal-400">Agent</span>
          </span>
        </Link>
      </div>

      {/* Right side: Status, Role & User Menu */}
      <div className="flex items-center gap-3">
        {/* Account status badge */}
        <div className="hidden sm:block">
          <StatusBadge status={user.account_status} />
        </div>

        {/* User dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-900/60 p-1.5 pr-3 text-left transition hover:border-slate-700 focus:outline-none"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-teal-500/20 text-teal-300 font-semibold text-xs border border-teal-500/30">
              {user.full_name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-xs font-medium text-slate-200 truncate max-w-[140px]">
                {user.full_name}
              </p>
              <p className="text-[10px] text-slate-400 capitalize">
                {user.role}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 z-50 w-56 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-xl shadow-black/50">
                <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                  <p className="text-xs font-semibold text-slate-200 truncate">
                    {user.full_name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {user.email}
                  </p>
                  <div className="mt-2 flex gap-1.5 flex-wrap">
                    <RoleBadge role={user.role} />
                  </div>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  Profile Settings
                </Link>

                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-400 transition hover:bg-rose-500/10"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    Admin Control
                  </Link>
                )}

                <div className="my-1 border-t border-slate-800/80" />

                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-400 transition hover:bg-rose-500/10 cursor-pointer disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" />
                  {isLoggingOut ? "Signing out..." : "Sign Out"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

