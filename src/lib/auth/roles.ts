import { UserRole, AccountStatus } from "@/types";

export const PUBLIC_ROLES: UserRole[] = ["patient", "doctor", "hospital"];

export const ALL_ROLES: UserRole[] = ["patient", "doctor", "hospital", "admin"];

export const ROLE_LABELS: Record<UserRole, string> = {
  patient: "Patient",
  doctor: "Healthcare Professional (Doctor)",
  hospital: "Hospital / Clinical Center",
  admin: "System Administrator",
};

export const ROLE_DASHBOARDS: Record<UserRole, string> = {
  patient: "/patient",
  doctor: "/doctor",
  hospital: "/hospital",
  admin: "/admin",
};

export function getDefaultAccountStatus(role: UserRole): AccountStatus {
  // Doctors and Hospitals require administrative verification
  if (role === "doctor" || role === "hospital") {
    return "pending";
  }
  return "active";
}

export function isValidPublicRole(role: string): role is UserRole {
  return PUBLIC_ROLES.includes(role as UserRole);
}

export function getDashboardForRole(role: UserRole): string {
  return ROLE_DASHBOARDS[role] || "/patient";
}

