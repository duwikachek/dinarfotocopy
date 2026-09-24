"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

const isUuid = (val?: string | null): boolean =>
  typeof val === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

const productSchema = z.object({
  categoryId: z.string().min(1, "Kategori harus dipilih."),
  name: z.string().min(3, "Nama produk minimal 3 karakter."),
  slug: z.string().min(3, "Slug minimal 3 karakter."),
  description: z.string().min(5, "Deskripsi minimal 5 karakter."),
  price: z.number().int().min(0, "Harga jual tidak boleh negatif."),
  costPrice: z.number().int().min(0).default(0),
  stock: z.number().int().min(0, "Stok tidak boleh negatif.").default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  imageUrl: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export async function createProductAction(rawInput: z.infer<typeof productSchema>) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Akses ditolak. Silakan login terlebih dahulu." };
  }

  const parsed = productSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Input tidak valid." };
  }

  if (!process.env.DATABASE_URL) {
    return { success: true, message: "Produk berhasil dibuat (simulasi mode dev)" };
  }

  try {
    let resolvedCategoryId = parsed.data.categoryId;
    if (!isUuid(resolvedCategoryId)) {
      const cat = await db.select({ id: categories.id }).from(categories).where(eq(categories.kind, "product")).limit(1);
      if (cat[0]) {
        resolvedCategoryId = cat[0].id;
      } else {
        return { success: false, error: "Kategori produk tidak valid di database." };
      }
    }

    const inserted = await db
      .insert(products)
      .values({
        ...parsed.data,
        categoryId: resolvedCategoryId,
      })
      .returning();

    revalidatePath("/admin/produk");
    revalidatePath("/produk");
    return { success: true, product: inserted[0] };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal membuat produk." };
  }
}

export async function updateProductStockAction(id: string, newStock: number) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Akses ditolak." };
  }

  if (newStock < 0) {
    return { success: false, error: "Stok tidak boleh negatif." };
  }

  if (!process.env.DATABASE_URL) {
    return { success: true };
  }

  try {
    let targetId = id;
    if (!isUuid(targetId)) {
      return { success: false, error: "ID produk tidak valid." };
    }

    await db
      .update(products)
      .set({ stock: newStock, updatedAt: new Date() })
      .where(eq(products.id, targetId));

    revalidatePath("/admin/produk");
    revalidatePath("/admin/dashboard");
    revalidatePath("/produk");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal update stok." };
  }
}

export async function updateProductAction(id: string, rawInput: Partial<z.infer<typeof productSchema>>) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Akses ditolak." };
  }

  if (!process.env.DATABASE_URL) {
    return { success: true, message: "Produk berhasil diperbarui (simulasi mode dev)" };
  }

  try {
    let targetId = id;
    if (!isUuid(targetId)) {
      if (rawInput.slug) {
        const found = await db.select({ id: products.id }).from(products).where(eq(products.slug, rawInput.slug)).limit(1);
        if (found[0]) {
          targetId = found[0].id;
        }
      }
      if (!isUuid(targetId)) {
        return { success: false, error: "ID produk tidak valid untuk pembaruan database." };
      }
    }

    const updateData: Record<string, any> = { updatedAt: new Date() };
    if (rawInput.name !== undefined) updateData.name = rawInput.name;
    if (rawInput.slug !== undefined) updateData.slug = rawInput.slug;
    if (rawInput.description !== undefined) updateData.description = rawInput.description;
    if (rawInput.price !== undefined) updateData.price = Number(rawInput.price);
    if (rawInput.costPrice !== undefined) updateData.costPrice = Number(rawInput.costPrice);
    if (rawInput.stock !== undefined) updateData.stock = Number(rawInput.stock);
    if (rawInput.lowStockThreshold !== undefined) updateData.lowStockThreshold = Number(rawInput.lowStockThreshold);
    if (rawInput.imageUrl !== undefined) updateData.imageUrl = rawInput.imageUrl;
    if (rawInput.isActive !== undefined) updateData.isActive = rawInput.isActive;

    if (rawInput.categoryId !== undefined) {
      let catId = rawInput.categoryId;
      if (!isUuid(catId)) {
        const cat = await db.select({ id: categories.id }).from(categories).where(eq(categories.kind, "product")).limit(1);
        if (cat[0]) catId = cat[0].id;
      }
      if (isUuid(catId)) {
        updateData.categoryId = catId;
      }
    }

    await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, targetId));

    revalidatePath("/admin/produk");
    revalidatePath("/produk");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal memperbarui produk." };
  }
}

export async function deleteProductAction(id: string) {
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
      return { success: false, error: "ID produk tidak valid." };
    }

    await db.delete(products).where(eq(products.id, targetId));
    revalidatePath("/admin/produk");
    revalidatePath("/produk");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal menghapus produk." };
  }
}
