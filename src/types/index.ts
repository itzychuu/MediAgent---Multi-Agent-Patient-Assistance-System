export type UserRole = "patient" | "doctor" | "hospital" | "admin";

export type AccountStatus = "active" | "pending" | "suspended";

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  account_status: AccountStatus;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface NavItem {
  title: string;
  href: string;
  iconName: string;
  badge?: string;
  roles: UserRole[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export * from "./assessment";

