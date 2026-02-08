import { NextAuthConfig } from "next-auth";
import { db } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { compare } from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (user && user.password && (await compare(String(credentials.password), user.password))) {
          return user;
        }
        return null;
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      // On sign in, add the ID
      if (user) {
        token.id = user.id;
      }

      // ALWAYS verify status from DB to ensure it's correct
      if (token.id) {
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
          select: { onboarded: true }
        });
        token.onboarded = dbUser?.onboarded ?? false;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).onboarded = token.onboarded as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin"
  }
} satisfies NextAuthConfig;