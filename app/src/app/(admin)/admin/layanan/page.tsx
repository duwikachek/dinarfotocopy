import { getServicesData, getCategoriesData } from "@/db/queries";
import AdminLayananClient from "./layanan-client";

export const dynamic = "force-dynamic";

export default async function AdminLayananPage() {
  const [services, categories] = await Promise.all([
    getServicesData(),
    getCategoriesData("service"),
  ]);

  return <AdminLayananClient initialServices={services} categories={categories} />;
}
