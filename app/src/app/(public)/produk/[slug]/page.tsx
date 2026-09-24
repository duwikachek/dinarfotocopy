import { notFound } from "next/navigation";
import { getProductsData } from "@/db/queries";
import DetailProdukClient from "./detail-client";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DetailProdukPage({ params }: Props) {
  const { slug } = await params;
  const products = await getProductsData();
  const product = products.find((p) => p.slug === slug);

  if (!product) notFound();

  return <DetailProdukClient product={product} />;
}
