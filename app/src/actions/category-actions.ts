"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";

const isUuid = (val?: string | null): boolean =>
  typeof val === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

const categorySchema = z.object({
  name: z.string().min(2, "Nama kategori minimal 2 karakter."),
  slug: z.string().min(2, "Slug minimal 2 karakter.").regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung."),
  kind: z.enum(["service", "product"], { message: "Jenis harus 'service' atau 'product'." }),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export async function createCategoryAction(rawInput: z.infer<typeof categorySchema>) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Akses ditolak. Silakan login terlebih dahulu." };
  }

  const parsed = categorySchema.safeParse(rawInput);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Input tidak valid." };
  }

  if (!process.env.DATABASE_URL) {
    return { success: true, message: "Kategori berhasil dibuat (simulasi mode dev)" };
  }

  try {
    const inserted = await db.insert(categories).values(parsed.data).returning();
    revalidatePath("/admin/kategori");
    revalidatePath("/admin/layanan");
    revalidatePath("/admin/produk");
    revalidatePath("/layanan");
    revalidatePath("/produk");
    return { success: true, category: inserted[0] };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal membuat kategori." };
  }
}

export async function updateCategoryAction(
  id: string,
  rawInput: Partial<z.infer<typeof categorySchema>>
) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Akses ditolak." };
  }

  if (!process.env.DATABASE_URL) {
    return { success: true, message: "Kategori berhasil diperbarui (simulasi mode dev)" };
  }

  try {
    let targetId = id;
    if (!isUuid(targetId)) {
      if (rawInput.slug) {
        const found = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, rawInput.slug)).limit(1);
        if (found[0]) targetId = found[0].id;
      }
      if (!isUuid(targetId)) {
        return { success: false, error: "ID kategori tidak valid untuk pembaruan database." };
      }
    }

    await db.update(categories).set(rawInput).where(eq(categories.id, targetId));
    revalidatePath("/admin/kategori");
    revalidatePath("/admin/layanan");
    revalidatePath("/admin/produk");
    revalidatePath("/layanan");
    revalidatePath("/produk");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal memperbarui kategori." };
  }
}

export async function deleteCategoryAction(id: string) {
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
      return { success: false, error: "ID kategori tidak valid." };
    }

    await db.delete(categories).where(eq(categories.id, targetId));
    revalidatePath("/admin/kategori");
    revalidatePath("/admin/layanan");
    revalidatePath("/admin/produk");
    return { success: true };
  } catch (err: any) {
    if (err?.message?.includes("restrict") || err?.message?.includes("foreign key")) {
      return { success: false, error: "Kategori ini masih memiliki layanan/produk terkait. Hapus atau pindahkan item terlebih dahulu." };
    }
    return { success: false, error: err?.message || "Gagal menghapus kategori." };
  }
}
