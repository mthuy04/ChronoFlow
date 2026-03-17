import type { UserAccount } from "./user";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  studentId?: string;
}

export interface AuthActionResult {
  success: boolean;
  message: string;
  user?: UserAccount;
}