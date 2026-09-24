import { getCategoriesData } from "@/db/queries";
import AdminKategoriClient from "./kategori-client";

export const dynamic = "force-dynamic";

export default async function AdminKategoriPage() {
  const categories = await getCategoriesData();
  return <AdminKategoriClient initialCategories={categories} />;
}
