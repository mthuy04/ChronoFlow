import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

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

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          chronotype: user.chronotype,
          image: user.image,
        };
      },
    }),
  ],

  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.chronotype = (user as any).chronotype ?? null;
        token.image = (user as any).image ?? null;
        token.name = user.name ?? null;
        token.email = user.email ?? null;
      }

      if (trigger === "update" && session?.user) {
        token.name = session.user.name ?? token.name;
        token.image = session.user.image ?? token.image;
      }

      if (token.email) {
        const latestUser = await prisma.user.findUnique({
          where: { email: token.email as string },
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
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).chronotype = token.chronotype ?? null;
        session.user.name = (token.name as string | null) ?? session.user.name;
        session.user.email = (token.email as string | null) ?? session.user.email;
        session.user.image = (token.image as string | null) ?? null;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};