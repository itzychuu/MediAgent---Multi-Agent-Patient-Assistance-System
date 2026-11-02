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

  if (trimmedName.length > 100) {
    throw new Error("Full name cannot exceed 100 characters.");
  }

  let sanitizedAvatarUrl: string | null = null;
  if (formData.avatar_url && formData.avatar_url.trim()) {
    const rawUrl = formData.avatar_url.trim();
    if (rawUrl.length > 500) {
      throw new Error("Avatar URL cannot exceed 500 characters.");
    }
    try {
      const parsed = new URL(rawUrl);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new Error("Avatar URL must use http:// or https:// protocol.");
      }
      sanitizedAvatarUrl = rawUrl;
    } catch {
      throw new Error("Please enter a valid URL for the avatar image.");
    }
  }

  // Check that user account is active and not suspended
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("account_status")
    .eq("id", user.id)
    .single();

  if (currentProfile?.account_status === "suspended") {
    throw new Error("Suspended accounts cannot modify profile information.");
  }

  // Update strictly limited fields for the authenticated user ID only
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      full_name: trimmedName,
      avatar_url: sanitizedAvatarUrl,
    })
    .eq("id", user.id);

  if (updateError) {
    throw new Error(`Profile update failed: ${updateError.message}`);
  }

  revalidatePath("/profile");
  return { success: true };
}
