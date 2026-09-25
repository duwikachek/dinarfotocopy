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
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal menyimpan pengaturan." };
  }
}

import type { StoreSettings } from "@/db/queries";

export async function updateAllStoreSettingsAction(data: Partial<StoreSettings> | Record<string, unknown>) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Akses ditolak." };
  }

  if (!process.env.DATABASE_URL) {
    return { success: true };
  }

  try {
    for (const [key, value] of Object.entries(data)) {
      await db
        .insert(settings)
        .values({ key, value })
        .onConflictDoUpdate({
          target: settings.key,
          set: { value, updatedAt: new Date() },
        });
    }

    // Keep store_profile in sync as well
    await db
      .insert(settings)
      .values({
        key: "store_profile",
        value: {
          store_name: data.store_name,
          store_tagline: data.store_tagline,
          store_address: data.store_address,
          store_whatsapp: data.store_whatsapp,
          store_operational_hours: data.store_operational_hours,
          map_embed_url: data.map_embed_url,
        },
      })
      .onConflictDoUpdate({
        target: settings.key,
        set: {
          value: {
            store_name: data.store_name,
            store_tagline: data.store_tagline,
            store_address: data.store_address,
            store_whatsapp: data.store_whatsapp,
            store_operational_hours: data.store_operational_hours,
            map_embed_url: data.map_embed_url,
          },
          updatedAt: new Date(),
        },
      });

    revalidatePath("/admin/pengaturan");
    revalidatePath("/", "layout");
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
