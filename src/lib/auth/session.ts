import { createClient } from "@/lib/supabase/server";
import { UserProfile } from "@/types";

/**
 * Retrieves the current authenticated user and their profile from Supabase.
 * Returns null if not authenticated or profile cannot be retrieved.
 */
export async function getCurrentProfile(): Promise<UserProfile | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    // Fetch the user's profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      // Fallback: If user exists in Auth but profile row wasn't created yet by trigger,
      // create safe profile record based on metadata
      const rawRole = (user.user_metadata?.role as string) || "patient";
      const sanitizedRole = ["patient", "doctor", "hospital"].includes(rawRole)
        ? rawRole
        : "patient";
      const defaultStatus =
        sanitizedRole === "patient" ? "active" : "pending";

      const newProfile: Partial<UserProfile> = {
        id: user.id,
        email: user.email || "",
        full_name:
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "MediAgent User",
        role: sanitizedRole as UserProfile["role"],
        account_status: defaultStatus as UserProfile["account_status"],
      };

      const { data: createdProfile } = await supabase
        .from("profiles")
        .upsert(newProfile)
        .select("*")
        .single();

      return (createdProfile as UserProfile) || null;
    }

    return profile as UserProfile;
  } catch (err) {
    console.error("Error retrieving user profile:", err);
    return null;
  }
}

