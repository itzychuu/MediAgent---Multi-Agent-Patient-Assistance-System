import React from "react";
import { requireAuth } from "@/lib/auth/authorization";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireAuth();

  if (user.account_status === "pending") {
    redirect("/pending");
  }

  if (user.account_status === "suspended") {
    redirect("/suspended");
  }

  return (
    <DashboardShell user={user}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Profile Settings
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your account details and review your verified clinical role permissions.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Update your display name and review account credentials.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm profile={user} />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
