import { getStoreSettings } from "@/db/queries";
import PengaturanClient from "./pengaturan-client";

export const dynamic = "force-dynamic";

export default async function AdminPengaturanPage() {
  const settings = await getStoreSettings();
  return <PengaturanClient initialSettings={settings} />;
}
