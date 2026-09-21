"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { services, serviceVariants } from "@/db/schema";
import { eq } from "drizzle-orm";

const serviceSchema = z.object({
  categoryId: z.string().uuid("Kategori harus dipilih."),
  name: z.string().min(3, "Nama layanan minimal 3 karakter."),
  slug: z.string().min(3, "Slug minimal 3 karakter."),
  shortDescription: z.string().min(5, "Deskripsi singkat minimal 5 karakter."),
  description: z.string().min(10, "Deskripsi lengkap minimal 10 karakter."),
  unit: z.string().default("lembar"),
  basePrice: z.number().int().min(0, "Harga dasar tidak boleh negatif."),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export async function createServiceAction(rawInput: z.infer<typeof serviceSchema>) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Akses ditolak. Silakan login terlebih dahulu." };
  }

  const parsed = serviceSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Input tidak valid." };
  }

  if (!process.env.DATABASE_URL) {
    return { success: true, message: "Layanan berhasil dibuat (simulasi mode dev)" };
  }

  try {
    const inserted = await db.insert(services).values(parsed.data).returning();
    revalidatePath("/admin/layanan");
    revalidatePath("/layanan");
    return { success: true, service: inserted[0] };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal membuat layanan." };
  }
}

export async function updateServiceAction(id: string, rawInput: Partial<z.infer<typeof serviceSchema>>) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Akses ditolak." };
  }

  if (!process.env.DATABASE_URL) {
    return { success: true, message: "Layanan berhasil diperbarui (simulasi mode dev)" };
  }

  try {
    await db
      .update(services)
      .set({ ...rawInput, updatedAt: new Date() })
      .where(eq(services.id, id));

    revalidatePath("/admin/layanan");
    revalidatePath("/layanan");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal memperbarui layanan." };
  }
}

export async function toggleServiceActiveAction(id: string, currentStatus: boolean) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Akses ditolak." };
  }

  if (!process.env.DATABASE_URL) {
    return { success: true };
  }

  try {
    await db
      .update(services)
      .set({ isActive: !currentStatus, updatedAt: new Date() })
      .where(eq(services.id, id));

    revalidatePath("/admin/layanan");
    revalidatePath("/layanan");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal mengubah status layanan." };
  }
}

export async function deleteServiceAction(id: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Akses ditolak." };
  }

  if (!process.env.DATABASE_URL) {
    return { success: true };
  }

  try {
    await db.delete(services).where(eq(services.id, id));
    revalidatePath("/admin/layanan");
    revalidatePath("/layanan");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal menghapus layanan." };
  }
}
