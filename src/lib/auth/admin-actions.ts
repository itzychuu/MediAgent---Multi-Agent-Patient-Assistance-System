"use server";

import { requireAdmin } from "./authorization";
import { createClient } from "@/lib/supabase/server";
import { AccountStatus } from "@/types";
import { revalidatePath } from "next/cache";

const VALID_STATUSES: AccountStatus[] = ["active", "pending", "suspended"];

/**
 * Server Action: Allows verified Administrator to update account status
 * (e.g., Approve a pending doctor/hospital or Suspend an account).
 */
export async function updateUserAccountStatus(
  targetUserId: string,
  newStatus: AccountStatus
) {
  // Enforces server-side administrator check
  const adminProfile = await requireAdmin();

  if (!targetUserId || typeof targetUserId !== "string" || targetUserId.trim() === "") {
    throw new Error("Invalid target user ID specified.");
  }

  if (!VALID_STATUSES.includes(newStatus)) {
    throw new Error("Invalid account status specified.");
  }

  if (targetUserId === adminProfile.id && newStatus === "suspended") {
    throw new Error("Administrators cannot suspend their own account.");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ account_status: newStatus })
    .eq("id", targetUserId);

  if (error) {
    throw new Error(`Failed to update user status: ${error.message}`);
  }

  revalidatePath("/admin");
  return { success: true };
}
