import { redirect } from "next/navigation";
import { getCurrentProfile } from "./session";
import { UserProfile, UserRole } from "@/types";
import { getDashboardForRole } from "./roles";

/**
 * Server guard: Ensures user is authenticated.
 * Redirects unauthenticated users to `/login`.
 */
export async function requireAuth(): Promise<UserProfile> {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  return profile;
}

/**
 * Server guard: Ensures user is authenticated, has an active status,
 * and matches one of the authorized roles.
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<UserProfile> {
  const profile = await requireAuth();

  // Handle Account Statuses
  if (profile.account_status === "pending") {
    redirect("/pending");
  }

  if (profile.account_status === "suspended") {
    redirect("/suspended");
  }

  // Check role authorization
  if (!allowedRoles.includes(profile.role)) {
    // Redirect to their designated dashboard
    redirect(getDashboardForRole(profile.role));
  }

  return profile;
}

/**
 * Server guard: Specific for Administrator dashboard and actions.
 */
export async function requireAdmin(): Promise<UserProfile> {
  return requireRole(["admin"]);
}

/**
 * Server guard: For public auth pages like /login and /register.
 * If user already has a valid session, redirect to their role dashboard.
 */
export async function redirectIfAuthenticated(): Promise<void> {
  const profile = await getCurrentProfile();

  if (profile) {
    if (profile.account_status === "pending") {
      redirect("/pending");
    }
    if (profile.account_status === "suspended") {
      redirect("/suspended");
    }
    redirect(getDashboardForRole(profile.role));
  }
}

