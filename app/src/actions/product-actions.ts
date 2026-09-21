"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

const productSchema = z.object({
  categoryId: z.string().uuid("Kategori harus dipilih."),
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
    const inserted = await db.insert(products).values(parsed.data).returning();
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
    await db
      .update(products)
      .set({ stock: newStock, updatedAt: new Date() })
      .where(eq(products.id, id));

    revalidatePath("/admin/produk");
    revalidatePath("/admin/dashboard");
    revalidatePath("/produk");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal update stok." };
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
    await db.delete(products).where(eq(products.id, id));
    revalidatePath("/admin/produk");
    revalidatePath("/produk");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal menghapus produk." };
  }
}
