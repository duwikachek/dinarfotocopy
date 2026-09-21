import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "./auth.config";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
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

        // Cek jika database Neon terhubung
        if (process.env.DATABASE_URL) {
          try {
            const foundUsers = await db
              .select()
              .from(users)
              .where(eq(users.email, email.toLowerCase()))
              .limit(1);

            const user = foundUsers[0];
            if (user && user.isActive) {
              const passwordsMatch = await bcrypt.compare(
                password,
                user.passwordHash
              );
              if (passwordsMatch) {
                // Update lastLoginAt secara asynchronous
                try {
                  await db
                    .update(users)
                    .set({ lastLoginAt: new Date() })
                    .where(eq(users.id, user.id));
                } catch {
                  // Silent fail untuk non-critical login timestamp update
                }

                return {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                };
              }
            }
          } catch (err) {
            console.error("Database auth error:", err);
          }
        }

        // Fallback admin default saat database belum terisi atau mode development awal
        // Email: admin@dinarfotocopy.id | Password: Password123!
        if (
          email.toLowerCase() === "admin@dinarfotocopy.id" &&
          password === "Password123!"
        ) {
          return {
            id: "usr-admin-default",
            name: "Admin Dinar Fotocopy",
            email: "admin@dinarfotocopy.id",
            role: "super_admin",
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "dinar_fotocopy_super_secret_local_jwt_key_random_32_chars",
});
