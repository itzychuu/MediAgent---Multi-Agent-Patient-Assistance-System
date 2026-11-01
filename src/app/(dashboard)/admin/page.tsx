import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Users,
  Clock,
  Building2,
  Stethoscope,
  User,
  Database,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth/authorization";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { RoleBadge, StatusBadge } from "@/components/ui/Badge";
import { AdminUserTable } from "@/components/dashboard/AdminUserTable";
import { UserProfile } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const currentAdmin = await requireAdmin();
  const supabase = await createClient();

  // Fetch all profiles using Supabase (allowed by RLS is_admin() policy)
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const allUsers: UserProfile[] = (profiles as UserProfile[]) || [];

  const pendingApprovals = allUsers.filter((u) => u.account_status === "pending");
  const totalDoctors = allUsers.filter((u) => u.role === "doctor").length;
  const totalHospitals = allUsers.filter((u) => u.role === "hospital").length;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
              System Administration
            </span>
            <RoleBadge role={currentAdmin.role} />
            <StatusBadge status={currentAdmin.account_status} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            System Security & User Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Administrative oversight, provider credential verification, and access governance.
          </p>
        </div>

        <Link
          href="/profile"
          className="inline-flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white"
        >
          <User className="h-4 w-4 mr-2 text-rose-400" />
          Admin Profile
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Users</span>
            <Users className="h-4 w-4 text-teal-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{allUsers.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Registered across all roles</p>
        </Card>

        <Card className="p-4 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pending Approvals</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-300 mt-2">
            {pendingApprovals.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Doctors & Hospitals awaiting review</p>
        </Card>

        <Card className="p-4 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Clinical Doctors</span>
            <Stethoscope className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{totalDoctors}</p>
          <p className="text-[11px] text-slate-500 mt-1">Specialists & General Physicians</p>
        </Card>

        <Card className="p-4 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Hospitals & Centers</span>
            <Building2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{totalHospitals}</p>
          <p className="text-[11px] text-slate-500 mt-1">Accredited medical networks</p>
        </Card>
      </div>

      {/* Pending Approvals Notice Banner if any */}
      {pendingApprovals.length > 0 && (
        <div id="approvals" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-center gap-2.5 text-amber-300 font-semibold text-sm">
            <ShieldAlert className="h-5 w-5 text-amber-400" />
            <span>Action Required: {pendingApprovals.length} provider account(s) pending administrative review</span>
          </div>
          <p className="text-xs text-amber-200/80 mt-1">
            Doctors and hospital entities must be reviewed and approved below before they can access clinical patient consultation feeds.
          </p>
        </div>
      )}

      {/* User Management Section */}
      <div id="users" className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            User Accounts Directory
          </h2>
          <p className="text-xs text-slate-400">
            View profiles, approve pending registrations, and manage operational access.
          </p>
        </div>

        <AdminUserTable
          initialUsers={allUsers}
          currentAdminId={currentAdmin.id}
        />
      </div>

      {/* Database Security Information Box */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-slate-300">
          <Database className="h-4 w-4 text-teal-400" />
          <span>Security Governance Notes</span>
        </div>
        <p>
          Administrator access is verified at three distinct layers: Next.js middleware routing, Server Component authorization helpers (`requireAdmin()`), and PostgreSQL Row Level Security (`is_admin()` function).
        </p>
        <p className="text-slate-500">
          Public registration endpoints never accept the administrator role. Administrators can only be provisioned through secure database execution.
        </p>
      </div>
    </div>
  );
}
