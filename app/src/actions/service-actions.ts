"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { services, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

const isUuid = (val?: string | null): boolean =>
  typeof val === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

const serviceSchema = z.object({
  categoryId: z.string().min(1, "Kategori harus dipilih."),
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
    let resolvedCategoryId = parsed.data.categoryId;
    if (!isUuid(resolvedCategoryId)) {
      const cat = await db.select({ id: categories.id }).from(categories).where(eq(categories.kind, "service")).limit(1);
      if (cat[0]) {
        resolvedCategoryId = cat[0].id;
      } else {
        return { success: false, error: "Kategori layanan tidak valid di database." };
      }
    }

    const inserted = await db
      .insert(services)
      .values({
        ...parsed.data,
        categoryId: resolvedCategoryId,
      })
      .returning();

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
    return { success: false, error: "Akses ditolak. Silakan login terlebih dahulu." };
  }

  if (!process.env.DATABASE_URL) {
    return { success: true, message: "Layanan berhasil diperbarui (simulasi mode dev)" };
  }

  try {
    let targetId = id;
    if (!isUuid(targetId)) {
      if (rawInput.slug) {
        const found = await db.select({ id: services.id }).from(services).where(eq(services.slug, rawInput.slug)).limit(1);
        if (found[0]) {
          targetId = found[0].id;
        }
      }
      if (!isUuid(targetId)) {
        return { success: false, error: "ID layanan tidak valid untuk pembaruan database." };
      }
    }

    const updateData: Record<string, any> = { updatedAt: new Date() };
    if (rawInput.name !== undefined) updateData.name = rawInput.name;
    if (rawInput.slug !== undefined) updateData.slug = rawInput.slug;
    if (rawInput.shortDescription !== undefined) updateData.shortDescription = rawInput.shortDescription;
    if (rawInput.description !== undefined) updateData.description = rawInput.description;
    if (rawInput.unit !== undefined) updateData.unit = rawInput.unit;
    if (rawInput.basePrice !== undefined) updateData.basePrice = Number(rawInput.basePrice);
    if (rawInput.sortOrder !== undefined) updateData.sortOrder = Number(rawInput.sortOrder);
    if (rawInput.isActive !== undefined) updateData.isActive = rawInput.isActive;

    if (rawInput.categoryId !== undefined) {
      let catId = rawInput.categoryId;
      if (!isUuid(catId)) {
        const cat = await db.select({ id: categories.id }).from(categories).where(eq(categories.kind, "service")).limit(1);
        if (cat[0]) catId = cat[0].id;
      }
      if (isUuid(catId)) {
        updateData.categoryId = catId;
      }
    }

    await db
      .update(services)
      .set(updateData)
      .where(eq(services.id, targetId));

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
    let targetId = id;
    if (!isUuid(targetId)) {
      return { success: false, error: "ID layanan tidak valid." };
    }

    await db
      .update(services)
      .set({ isActive: !currentStatus, updatedAt: new Date() })
      .where(eq(services.id, targetId));

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
    let targetId = id;
    if (!isUuid(targetId)) {
      return { success: false, error: "ID layanan tidak valid." };
    }

    await db.delete(services).where(eq(services.id, targetId));
    revalidatePath("/admin/layanan");
    revalidatePath("/layanan");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal menghapus layanan." };
  }
}
