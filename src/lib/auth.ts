import type { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

type ChronoAuthUser = NextAuthUser & {
  id: string;
  role?: string | null;
  chronotype?: string | null;
};

type ChronoSessionUser = {
  id?: string;
  role?: string | null;
  chronotype?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | undefined;
};

type GoogleCredentials = {
  clientId: string;
  clientSecret: string;
};

function getGoogleCredentials(): GoogleCredentials | null {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  return {
    clientId,
    clientSecret,
  };
}

const googleCredentials = getGoogleCredentials();

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const normalizedEmail = credentials.email.trim().toLowerCase();

        const user = await prisma.user.findUnique({
          where: {
            email: normalizedEmail,
          },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.passwordHash,
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          chronotype: user.chronotype,
        } satisfies ChronoAuthUser;
      },
    }),

    ...(googleCredentials
      ? [
          GoogleProvider({
            clientId: googleCredentials.clientId,
            clientSecret: googleCredentials.clientSecret,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
  ],

  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return true;
      }

      const email = user.email?.trim().toLowerCase();

      if (!email) {
        return false;
      }

      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          name: true,
          image: true,
        },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            email,
            name: user.name ?? email.split("@")[0] ?? "ChronoFlow User",
            image: user.image ?? null,
          },
        });

        return true;
      }

      const shouldUpdateProfile =
        (!existingUser.name && user.name) ||
        (!existingUser.image && user.image);

      if (shouldUpdateProfile) {
        await prisma.user.update({
          where: {
            email,
          },
          data: {
            name: existingUser.name ?? user.name ?? undefined,
            image: existingUser.image ?? user.image ?? undefined,
          },
        });
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        const chronoUser = user as Partial<ChronoAuthUser>;

        token.id = chronoUser.id ?? token.id;
        token.role = chronoUser.role ?? token.role ?? null;
        token.chronotype = chronoUser.chronotype ?? token.chronotype ?? null;
        token.image = chronoUser.image ?? token.image ?? null;
        token.name = chronoUser.name ?? token.name ?? null;
        token.email = chronoUser.email ?? token.email ?? null;
      }

      if (trigger === "update" && session?.user) {
        token.name = session.user.name ?? token.name;
        token.image = session.user.image ?? token.image;
      }

      if (typeof token.email === "string") {
        const latestUser = await prisma.user.findUnique({
          where: {
            email: token.email.toLowerCase(),
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            chronotype: true,
            image: true,
          },
        });

        if (latestUser) {
          token.id = latestUser.id;
          token.name = latestUser.name;
          token.email = latestUser.email;
          token.role = latestUser.role;
          token.chronotype = latestUser.chronotype ?? null;
          token.image = latestUser.image ?? null;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as ChronoSessionUser;

        sessionUser.id = typeof token.id === "string" ? token.id : undefined;

        sessionUser.role =
          typeof token.role === "string" ? token.role : null;

        sessionUser.chronotype =
          typeof token.chronotype === "string" ? token.chronotype : null;

        sessionUser.name =
          typeof token.name === "string" ? token.name : undefined;

        sessionUser.email =
          typeof token.email === "string" ? token.email : undefined;

        sessionUser.image =
          typeof token.image === "string" ? token.image : undefined;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
};