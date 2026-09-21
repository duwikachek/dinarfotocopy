"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { settings, messageTemplates } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateStoreSettingsAction(key: string, value: unknown) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Akses ditolak." };
  }

  if (!process.env.DATABASE_URL) {
    return { success: true, message: "Pengaturan tersimpan (simulasi mode dev)" };
  }

  try {
    await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value, updatedAt: new Date() },
      });

    revalidatePath("/admin/pengaturan");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal menyimpan pengaturan." };
  }
}

export async function updateMessageTemplateAction(key: string, title: string, body: string) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Akses ditolak." };
  }

  if (!process.env.DATABASE_URL) {
    return { success: true };
  }

  try {
    await db
      .insert(messageTemplates)
      .values({ key, title, body })
      .onConflictDoUpdate({
        target: messageTemplates.key,
        set: { title, body, updatedAt: new Date() },
      });

    revalidatePath("/admin/pengaturan");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal menyimpan template." };
  }
}
