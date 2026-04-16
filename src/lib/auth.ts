import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users, accounts, sessions, verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          email: profile.email ?? "",
          image: profile.avatar_url,
          githubUsername: profile.login,
        };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        // Fetch extra user fields
        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, user.id),
          columns: {
            role: true,
            username: true,
          },
        });

        if (dbUser) {
          session.user.role = dbUser.role;
          session.user.username = dbUser.username;
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      // Set GitHub username from profile if available
      if (account?.provider === "github" && profile?.login && user.id) {
        await db
          .update(users)
          .set({
            githubUsername: profile.login as string,
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id))
          .catch(() => null);
      }

      return true;
    },
  },
  events: {
    async createUser({ user }) {
      // Auto-generate username from name or email
      if (user.id && !user.name) return;

      const baseName = user.name
        ? user.name.toLowerCase().replace(/\s+/g, "")
        : user.email!.split("@")[0];

      const randomSuffix = Math.floor(Math.random() * 10000);
      const username = `${baseName.slice(0, 20)}${randomSuffix}`;

      await db
        .update(users)
        .set({
          username,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id!))
        .catch(() => null);
    },
  },
  session: {
    strategy: "database",
  },
  trustHost: true,
});
