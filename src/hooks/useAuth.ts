"use client";

import { useMemo } from "react";
import { signOut, useSession } from "next-auth/react";

type SessionUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
  chronotype?: string | null;
};

export function useAuth() {
  const { data: session, status, update } = useSession();

  const user = session?.user as SessionUser | undefined;

  const isReady = status !== "loading";
  const isAuthenticated = status === "authenticated";
  const isUnauthorized = status === "unauthenticated";

  const role = user?.role ?? "GUEST";
  const isAdmin = role === "ADMIN";
  const isUser = role === "USER";

  const displayName = useMemo(() => {
    if (!user?.name) return "Guest";
    return user.name;
  }, [user?.name]);

  const logout = async () => {
    await signOut({
      callbackUrl: "/auth/login",
    });
  };

  return {
    session,
    user,
    status,
    isReady,
    isAuthenticated,
    isUnauthorized,
    isAdmin,
    isUser,
    role,
    displayName,
    updateSession: update,
    logout,
  };
}