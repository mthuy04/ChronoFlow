import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

function hasGoogleCredentials() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

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
        } as any;
      },
    }),

    ...(hasGoogleCredentials()
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
      const chronoToken = token as any;

      if (user) {
        const chronoUser = user as any;

        chronoToken.id = chronoUser.id ?? chronoToken.id;
        chronoToken.role = chronoUser.role ?? chronoToken.role;
        chronoToken.chronotype =
          chronoUser.chronotype ?? chronoToken.chronotype;
        chronoToken.image = chronoUser.image ?? chronoToken.image;
        chronoToken.name = chronoUser.name ?? chronoToken.name;
        chronoToken.email = chronoUser.email ?? chronoToken.email;
      }

      if (trigger === "update" && (session as any)?.user) {
        chronoToken.name = (session as any).user.name ?? chronoToken.name;
        chronoToken.image = (session as any).user.image ?? chronoToken.image;
      }

      if (typeof chronoToken.email === "string") {
        const latestUser = await prisma.user.findUnique({
          where: {
            email: chronoToken.email.toLowerCase(),
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
          chronoToken.id = latestUser.id;
          chronoToken.name = latestUser.name;
          chronoToken.email = latestUser.email;
          chronoToken.role = latestUser.role ?? undefined;
          chronoToken.chronotype = latestUser.chronotype ?? undefined;
          chronoToken.image = latestUser.image ?? undefined;
        }
      }

      return chronoToken;
    },

    async session({ session, token }) {
      const chronoSession = session as any;
      const chronoToken = token as any;

      if (chronoSession.user) {
        chronoSession.user.id = chronoToken.id;
        chronoSession.user.role = chronoToken.role;
        chronoSession.user.chronotype = chronoToken.chronotype;
        chronoSession.user.name = chronoToken.name ?? chronoSession.user.name;
        chronoSession.user.email = chronoToken.email ?? chronoSession.user.email;
        chronoSession.user.image = chronoToken.image ?? chronoSession.user.image;
      }

      return chronoSession;
    },
  },

  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
};