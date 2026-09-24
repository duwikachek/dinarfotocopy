import { db } from "@/db";
import { services, categories, products, serviceVariants, settings } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import { dummyServices, dummyCategories, dummyProducts } from "@/lib/dummy-data";

export interface ServiceWithCategory {
  id: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  unit: string;
  basePrice: number;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  variants: {
    id: string;
    label: string;
    price: number;
    attributes: Record<string, string>;
    sortOrder: number;
  }[];
  useCases?: string[];
}

export interface ProductWithCategory {
  id: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  costPrice: number;
  stock: number;
  lowStockThreshold: number;
  imageUrl: string | null;
  isActive: boolean;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  kind: "service" | "product";
  sortOrder: number;
  isActive?: boolean;
}

export async function getServicesData(): Promise<ServiceWithCategory[]> {
  if (!process.env.DATABASE_URL) {
    return dummyServices as unknown as ServiceWithCategory[];
  }

  try {
    const rows = await db
      .select({
        id: services.id,
        categoryId: services.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        name: services.name,
        slug: services.slug,
        shortDescription: services.shortDescription,
        description: services.description,
        unit: services.unit,
        basePrice: services.basePrice,
        imageUrl: services.imageUrl,
        sortOrder: services.sortOrder,
        isActive: services.isActive,
      })
      .from(services)
      .leftJoin(categories, eq(services.categoryId, categories.id))
      .orderBy(asc(services.sortOrder));

    if (!rows || rows.length === 0) {
      return dummyServices as unknown as ServiceWithCategory[];
    }

    // Ambil variants
    let variantsRows: any[] = [];
    try {
      variantsRows = await db
        .select()
        .from(serviceVariants)
        .orderBy(asc(serviceVariants.sortOrder));
    } catch {
      variantsRows = [];
    }

    const variantsByServiceId: Record<string, any[]> = {};
    for (const v of variantsRows) {
      if (!variantsByServiceId[v.serviceId]) {
        variantsByServiceId[v.serviceId] = [];
      }
      variantsByServiceId[v.serviceId].push({
        id: v.id,
        label: v.label,
        price: v.price,
        attributes: (v.attributes as Record<string, string>) || {},
        sortOrder: v.sortOrder,
      });
    }

    return rows.map((r) => {
      const dbVariants = variantsByServiceId[r.id] || [];
      const dummyMatch = dummyServices.find((ds) => ds.slug === r.slug);

      return {
        id: r.id,
        categoryId: r.categoryId,
        categoryName: r.categoryName || dummyMatch?.categoryName || "Umum",
        categorySlug: r.categorySlug || dummyMatch?.categorySlug || "umum",
        name: r.name,
        slug: r.slug,
        shortDescription: r.shortDescription,
        description: r.description,
        unit: r.unit,
        basePrice: r.basePrice,
        imageUrl: r.imageUrl,
        sortOrder: r.sortOrder,
        isActive: r.isActive,
        variants: dbVariants.length > 0 ? dbVariants : (dummyMatch?.variants || []),
        useCases: dummyMatch?.useCases || [],
      };
    });
  } catch (err) {
    console.error("Gagal mengambil data services dari DB, gunakan fallback:", err);
    return dummyServices as unknown as ServiceWithCategory[];
  }
}

export async function getCategoriesData(kind?: "service" | "product"): Promise<CategoryItem[]> {
  if (!process.env.DATABASE_URL) {
    const list = kind
      ? dummyCategories[kind]
      : [...dummyCategories.service, ...dummyCategories.product];
    return list.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      kind: c.kind as "service" | "product",
      sortOrder: c.sortOrder,
    }));
  }

  try {
    let query = db.select().from(categories).orderBy(asc(categories.sortOrder));
    const rows = await query;

    if (!rows || rows.length === 0) {
      const list = kind
        ? dummyCategories[kind]
        : [...dummyCategories.service, ...dummyCategories.product];
      return list.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        kind: c.kind as "service" | "product",
        sortOrder: c.sortOrder,
      }));
    }

    const filtered = kind ? rows.filter((r) => r.kind === kind) : rows;
    return filtered.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      kind: r.kind as "service" | "product",
      sortOrder: r.sortOrder,
      isActive: r.isActive,
    }));
  } catch (err) {
    console.error("Gagal mengambil data categories dari DB, gunakan fallback:", err);
    const list = kind
      ? dummyCategories[kind]
      : [...dummyCategories.service, ...dummyCategories.product];
    return list.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      kind: c.kind as "service" | "product",
      sortOrder: c.sortOrder,
    }));
  }
}

export async function getProductsData(): Promise<ProductWithCategory[]> {
  if (!process.env.DATABASE_URL) {
    return dummyProducts as unknown as ProductWithCategory[];
  }

  try {
    const rows = await db
      .select({
        id: products.id,
        categoryId: products.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        name: products.name,
        slug: products.slug,
        description: products.description,
        price: products.price,
        costPrice: products.costPrice,
        stock: products.stock,
        lowStockThreshold: products.lowStockThreshold,
        imageUrl: products.imageUrl,
        isActive: products.isActive,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .orderBy(asc(products.name));

    if (!rows || rows.length === 0) {
      return dummyProducts as unknown as ProductWithCategory[];
    }

    return rows.map((r) => {
      const dummyMatch = dummyProducts.find((dp) => dp.slug === r.slug);
      return {
        id: r.id,
        categoryId: r.categoryId,
        categoryName: r.categoryName || dummyMatch?.categoryName || "Alat Tulis",
        categorySlug: r.categorySlug || dummyMatch?.categorySlug || "alat-tulis",
        name: r.name,
        slug: r.slug,
        description: r.description,
        price: r.price,
        costPrice: r.costPrice,
        stock: r.stock,
        lowStockThreshold: r.lowStockThreshold,
        imageUrl: r.imageUrl,
        isActive: r.isActive,
      };
    });
  } catch (err) {
    console.error("Gagal mengambil data products dari DB, gunakan fallback:", err);
    return dummyProducts as unknown as ProductWithCategory[];
  }
}
