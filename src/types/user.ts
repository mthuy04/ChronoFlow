import type { Chronotype } from "./chronotype";

export type UserRole = "guest" | "user" | "admin";

export interface UserAccount {
  id?: string;
  name: string;
  email: string;
  password?: string;
  studentId?: string;
  role?: UserRole;
  chronotype?: Chronotype;
  targetSleepTime?: string;
  targetWakeTime?: string;
}