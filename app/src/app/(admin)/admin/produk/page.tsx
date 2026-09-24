import { getProductsData, getCategoriesData } from "@/db/queries";
import AdminProdukClient from "./produk-client";

export const dynamic = "force-dynamic";

export default async function AdminProdukPage() {
  const [products, categories] = await Promise.all([
    getProductsData(),
    getCategoriesData("product"),
  ]);

  return <AdminProdukClient initialProducts={products} categories={categories} />;
}
