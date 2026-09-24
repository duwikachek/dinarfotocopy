import { getServicesData, getCategoriesData } from "@/db/queries";
import KatalogLayananClient from "./layanan-client";

export const dynamic = "force-dynamic";

export default async function KatalogLayananPage() {
  const [services, categories] = await Promise.all([
    getServicesData(),
    getCategoriesData("service"),
  ]);

  return <KatalogLayananClient initialServices={services} categories={categories} />;
}
