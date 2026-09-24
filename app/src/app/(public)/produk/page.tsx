import { getProductsData, getCategoriesData } from "@/db/queries";
import KatalogProdukClient from "./produk-client";

export const dynamic = "force-dynamic";

export default async function KatalogProdukPage() {
  const [products, categories] = await Promise.all([
    getProductsData(),
    getCategoriesData("product"),
  ]);

  return <KatalogProdukClient initialProducts={products} categories={categories} />;
}
