"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateOwnProfile(formData: {
  full_name: string;
  avatar_url?: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized. Please sign in again.");
  }

  const trimmedName = formData.full_name?.trim();
  if (!trimmedName || trimmedName.length < 2) {
    throw new Error("Full name must be at least 2 characters long.");
  }

  // Update strictly limited fields for the authenticated user ID only
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      full_name: trimmedName,
      avatar_url: formData.avatar_url?.trim() || null,
    })
    .eq("id", user.id);

  if (updateError) {
    throw new Error(`Profile update failed: ${updateError.message}`);
  }

  revalidatePath("/profile");
  return { success: true };
}

