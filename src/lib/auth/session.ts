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
        ? (rawRole as UserProfile["role"])
        : "patient";
      const defaultStatus =
        sanitizedRole === "patient" ? "active" : "pending";

      const fallbackName =
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "MediAgent User";

      const newProfile: Partial<UserProfile> = {
        id: user.id,
        email: user.email || "",
        full_name: fallbackName,
        role: sanitizedRole,
        account_status: defaultStatus as UserProfile["account_status"],
      };

      const { data: createdProfile } = await supabase
        .from("profiles")
        .upsert(newProfile)
        .select("*")
        .single();

      if (createdProfile) {
        return createdProfile as UserProfile;
      }

      // If database table is temporarily unreachable or pending migration,
      // construct a safe fallback profile object so user is not stuck in an endless loop
      return {
        id: user.id,
        email: user.email || "",
        full_name: fallbackName,
        role: sanitizedRole,
        account_status: defaultStatus as UserProfile["account_status"],
        avatar_url: (user.user_metadata?.avatar_url as string) || null,
        created_at: user.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    return profile as UserProfile;
  } catch (err) {
    console.error("Error retrieving user profile:", err);
    return null;
  }
}
