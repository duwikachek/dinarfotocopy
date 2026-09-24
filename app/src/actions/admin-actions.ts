"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const updateProfileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter."),
  email: z.string().email("Email tidak valid."),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Password saat ini wajib diisi."),
  newPassword: z.string().min(8, "Password baru minimal 8 karakter."),
});

export async function updateProfileAction(rawInput: z.infer<typeof updateProfileSchema>) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Akses ditolak. Silakan login terlebih dahulu." };
  }

  const parsed = updateProfileSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Input tidak valid." };
  }

  if (!process.env.DATABASE_URL) {
    return { success: true, message: "Profil berhasil diperbarui (simulasi mode dev)" };
  }

  try {
    await db
      .update(users)
      .set({
        name: parsed.data.name,
        email: parsed.data.email,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id!));

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal memperbarui profil." };
  }
}

export async function changePasswordAction(rawInput: z.infer<typeof changePasswordSchema>) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Akses ditolak. Silakan login terlebih dahulu." };
  }

  const parsed = changePasswordSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Input tidak valid." };
  }

  if (!process.env.DATABASE_URL) {
    return { success: true, message: "Password berhasil diperbarui (simulasi mode dev)" };
  }

  try {
    const existing = await db
      .select({ passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.id, session.user.id!))
      .limit(1);

    const user = existing[0];
    if (!user) return { success: false, error: "Akun tidak ditemukan." };

    const isValid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
    if (!isValid) return { success: false, error: "Password saat ini tidak sesuai." };

    const newHash = await bcrypt.hash(parsed.data.newPassword, 12);
    await db
      .update(users)
      .set({ passwordHash: newHash, updatedAt: new Date() })
      .where(eq(users.id, session.user.id!));

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal memperbarui password." };
  }
}
