import React from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  BedDouble,
  ShieldCheck,
  Stethoscope,
  Activity,
  User,
  PlusCircle,
} from "lucide-react";
import { requireRole } from "@/lib/auth/authorization";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { RoleBadge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function HospitalDashboardPage() {
  const user = await requireRole(["hospital"]);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Healthcare Facility Portal
            </span>
            <RoleBadge role={user.role} />
            <StatusBadge status={user.account_status} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {user.full_name}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Institutional hospital administration, clinical departments, and physician network management.
          </p>
        </div>

        <Link href="/profile">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <User className="h-4 w-4 mr-2 text-emerald-400" />
            Facility Details
          </Button>
        </Link>
      </div>

      {/* Hospital Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Institutional Accreditation
              </span>
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
            <CardTitle className="text-xl">Verified Facility</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-300 space-y-2">
            <p>
              Accredited health center authorized to receive digital triage referrals and manage affiliated practitioners.
            </p>
            <div className="pt-2 border-t border-emerald-500/20 text-slate-400">
              Center ID: <span className="font-mono text-slate-200">{user.id.slice(0, 8)}...</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Clinical Departments
              </span>
              <Building2 className="h-5 w-5 text-cyan-400" />
            </div>
            <CardTitle className="text-xl">Registered Wings</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-300 space-y-2">
            <p>
              Emergency, Cardiology, Neurology, Pediatrics, General Medicine.
            </p>
            <div className="pt-2 border-t border-slate-800 text-slate-400">
              Department Registry: <span className="text-cyan-400">Phase 4 Modules</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                Provider Capacity
              </span>
              <Users className="h-5 w-5 text-teal-400" />
            </div>
            <CardTitle className="text-xl">Affiliated Staff</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-300 space-y-2">
            <p>
              Connect staff physicians and hospital specialists to triage queues.
            </p>
            <div className="pt-2 border-t border-slate-800 text-slate-400">
              Network Status: <span className="text-teal-400">Ready for Doctors</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department and Doctor Management Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-emerald-400" />
                <CardTitle>Affiliated Doctors</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="text-slate-400 cursor-not-allowed">
                <PlusCircle className="h-4 w-4 mr-1.5" />
                Invite Doctor
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center space-y-3">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-slate-500">
                <Users className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-slate-300">
                No affiliated doctors linked yet
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Doctors registered under this hospital entity will be listed here after admin verification.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-cyan-400" />
                <CardTitle>Inpatient & Emergency Status</CardTitle>
              </div>
              <span className="text-xs font-medium text-slate-400">Real-time Feed</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center space-y-3">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-slate-500">
                <Activity className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-slate-300">
                Real-Time Bed & ER Capacity
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Hospital emergency availability signals for patient-agent dispatch will be configured in Phase 4.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
