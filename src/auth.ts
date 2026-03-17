import type { NextAuthOptions, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type AppUser = User & {
  role?: string;
  chronotype?: string | null;
};

type AppSessionUser = Session["user"] & {
  id: string;
  role: string;
  chronotype: string | null;
};

type AppJWT = JWT & {
  role?: string;
  chronotype?: string | null;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          select: {
            id: true,
            name: true,
            email: true,
            passwordHash: true,
            image: true,
            role: true,
            chronotype: true,
          },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await compare(password, user.passwordHash);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image ?? undefined,
          role: user.role,
          chronotype: user.chronotype ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const appToken = token as AppJWT;
      const appUser = user as AppUser | undefined;

      if (appUser) {
        appToken.role = appUser.role ?? "USER";
        appToken.chronotype = appUser.chronotype ?? null;
      }

      return appToken;
    },
    async session({ session, token }) {
      const appToken = token as AppJWT;
      const sessionUser = session.user as AppSessionUser;

      sessionUser.id = token.sub ?? "";
      sessionUser.role = appToken.role ?? "USER";
      sessionUser.chronotype = appToken.chronotype ?? null;

      return session;
    },
  },
};