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

export interface StoreSettings {
  store_name: string;
  store_tagline: string;
  store_address: string;
  store_whatsapp: string;
  store_operational_hours: string;
  map_embed_url: string;
  bulk_discount_rules: { minQty: number; percent: number }[];
  notify_admin_on_new_order: boolean;
}

export async function getStoreSettings(): Promise<StoreSettings> {
  const defaults: StoreSettings = {
    store_name: "Dinar Fotocopy",
    store_tagline: "Cetak cepat, rapi, dan terpercaya sejak 2024.",
    store_address: "Jl. Melati No. 22, Kel. Sukamaju, Kota Bandung",
    store_whatsapp: process.env.NEXT_PUBLIC_STORE_WHATSAPP || "628123456789",
    store_operational_hours: "Senin–Sabtu 08.00–21.00 WIB, Minggu 09.00–17.00 WIB",
    map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.8044444444446!2d107.6189!3d-6.9175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTUnMDMuMCJTIDEwN8KwMzcnMDguMCJF!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid",
    bulk_discount_rules: [
      { minQty: 100, percent: 5 },
      { minQty: 500, percent: 10 },
    ],
    notify_admin_on_new_order: true,
  };

  if (!process.env.DATABASE_URL) {
    return defaults;
  }

  try {
    const rows = await db.select().from(settings);
    if (!rows || rows.length === 0) {
      return defaults;
    }

    const map = new Map<string, any>();
    for (const r of rows) {
      map.set(r.key, r.value);
    }

    const profile = (map.get("store_profile") as Record<string, any>) || {};

    return {
      store_name: String(map.get("store_name") || profile.store_name || defaults.store_name),
      store_tagline: String(map.get("store_tagline") || profile.store_tagline || defaults.store_tagline),
      store_address: String(map.get("store_address") || profile.store_address || defaults.store_address),
      store_whatsapp: String(map.get("store_whatsapp") || profile.store_whatsapp || defaults.store_whatsapp),
      store_operational_hours: String(map.get("store_operational_hours") || profile.store_operational_hours || defaults.store_operational_hours),
      map_embed_url: String(map.get("map_embed_url") || profile.map_embed_url || defaults.map_embed_url),
      bulk_discount_rules: (map.get("bulk_discount_rules") as any) || defaults.bulk_discount_rules,
      notify_admin_on_new_order: map.has("notify_admin_on_new_order")
        ? Boolean(map.get("notify_admin_on_new_order"))
        : (profile.notify_admin_on_new_order ?? defaults.notify_admin_on_new_order),
    };
  } catch (err) {
    console.error("Gagal mengambil pengaturan dari DB, gunakan fallback:", err);
    return defaults;
  }
}

