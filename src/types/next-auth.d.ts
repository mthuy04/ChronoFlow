import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      chronotype: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    chronotype?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    chronotype?: string | null;
  }
}