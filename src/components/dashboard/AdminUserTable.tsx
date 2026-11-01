"use client";

import React, { useState, useTransition } from "react";
import { UserProfile, AccountStatus } from "@/types";
import { RoleBadge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { updateUserAccountStatus } from "@/lib/auth/admin-actions";
import {
  CheckCircle2,
  Ban,
  RotateCcw,
  Search,
  AlertCircle,
} from "lucide-react";

interface AdminUserTableProps {
  initialUsers: UserProfile[];
  currentAdminId: string;
}

export function AdminUserTable({
  initialUsers,
  currentAdminId,
}: AdminUserTableProps) {
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);

  const handleStatusChange = (userId: string, newStatus: AccountStatus) => {
    setActionError(null);
    startTransition(async () => {
      try {
        await updateUserAccountStatus(userId, newStatus);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, account_status: newStatus } : u
          )
        );
      } catch (err: unknown) {
        console.error("Action error:", err);
        setActionError(
          err instanceof Error ? err.message : "Failed to execute update."
        );
      }
    });
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || u.role === selectedRole;
    const matchesStatus =
      selectedStatus === "all" || u.account_status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {actionError && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="all">All Roles</option>
            <option value="patient">Patients</option>
            <option value="doctor">Doctors</option>
            <option value="hospital">Hospitals</option>
            <option value="admin">Administrators</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending Approval</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="border-b border-slate-800 bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3 font-semibold">User</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Registered</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No user accounts matching the specified filter criteria.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-slate-850/40 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-100">
                      {u.full_name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {u.email}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={u.account_status} />
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.id === currentAdminId ? (
                      <span className="text-[11px] text-slate-500 italic">
                        Current Account
                      </span>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        {u.account_status === "pending" && (
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={isPending}
                            onClick={() =>
                              handleStatusChange(u.id, "active")
                            }
                            className="bg-emerald-600 hover:bg-emerald-500 text-white"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            Approve
                          </Button>
                        )}

                        {u.account_status === "active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isPending}
                            onClick={() =>
                              handleStatusChange(u.id, "suspended")
                            }
                            className="border-rose-900/50 text-rose-400 hover:bg-rose-500/10"
                          >
                            <Ban className="h-3.5 w-3.5 mr-1" />
                            Suspend
                          </Button>
                        )}

                        {u.account_status === "suspended" && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isPending}
                            onClick={() =>
                              handleStatusChange(u.id, "active")
                            }
                            className="border-emerald-900/50 text-emerald-400 hover:bg-emerald-500/10"
                          >
                            <RotateCcw className="h-3.5 w-3.5 mr-1" />
                            Reactivate
                          </Button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUserTable;
