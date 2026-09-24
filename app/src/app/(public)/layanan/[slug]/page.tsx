import { notFound } from "next/navigation";
import { getServicesData } from "@/db/queries";
import DetailLayananClient from "./detail-client";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DetailLayananPage({ params }: Props) {
  const { slug } = await params;
  const services = await getServicesData();
  const service = services.find((s) => s.slug === slug);

  if (!service) notFound();

  return <DetailLayananClient service={service} />;
}
