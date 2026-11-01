import { requireAuth } from "@/lib/auth/authorization";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  if (user.account_status === "pending") {
    redirect("/pending");
  }

  if (user.account_status === "suspended") {
    redirect("/suspended");
  }

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
