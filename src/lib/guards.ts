import type { UserAccount, UserRole } from "@/types/user";

export function isAuthenticated(user: UserAccount | null | undefined): boolean {
  return !!user;
}

export function isAdmin(user: UserAccount | null | undefined): boolean {
  return user?.role === "admin";
}

export function isUser(user: UserAccount | null | undefined): boolean {
  return user?.role === "user";
}

export function canAccessUserArea(user: UserAccount | null | undefined): boolean {
  return isAuthenticated(user) && (isUser(user) || isAdmin(user));
}

export function canAccessAdminArea(user: UserAccount | null | undefined): boolean {
  return isAdmin(user);
}

export function canAccessGuestArea(role: UserRole | undefined): boolean {
  return !role || role === "guest";
}

export function requiresChronotype(
  chronotype: string | null | undefined
): boolean {
  return !chronotype;
}