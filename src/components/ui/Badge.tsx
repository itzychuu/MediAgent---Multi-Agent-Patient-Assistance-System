import React from "react";
import { UserRole, AccountStatus } from "@/types";

interface BadgeProps {
  children?: React.ReactNode;
  variant?: "teal" | "emerald" | "amber" | "rose" | "slate" | "indigo";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "teal",
  size = "md",
  className = "",
}: BadgeProps) {
  const variantStyles = {
    teal: "bg-teal-500/10 text-teal-400 border-teal-500/30",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    slate: "bg-slate-700/30 text-slate-300 border-slate-600/40",
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 font-medium",
    md: "text-xs px-2.5 py-1 font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}

export function RoleBadge({ role }: { role: UserRole }) {
  const roleConfig: Record<
    UserRole,
    { label: string; variant: BadgeProps["variant"] }
  > = {
    patient: { label: "Patient", variant: "teal" },
    doctor: { label: "Doctor", variant: "indigo" },
    hospital: { label: "Hospital", variant: "emerald" },
    admin: { label: "Admin", variant: "rose" },
  };

  const config = roleConfig[role] || { label: role, variant: "slate" };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function StatusBadge({ status }: { status: AccountStatus }) {
  const statusConfig: Record<
    AccountStatus,
    { label: string; variant: BadgeProps["variant"] }
  > = {
    active: { label: "Active", variant: "emerald" },
    pending: { label: "Pending Approval", variant: "amber" },
    suspended: { label: "Suspended", variant: "rose" },
  };

  const config = statusConfig[status] || { label: status, variant: "slate" };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}

