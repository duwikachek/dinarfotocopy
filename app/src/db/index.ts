import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

function createDbClient() {
  if (!connectionString) {
    console.warn("⚠️ DATABASE_URL belum diatur. Koneksi database Neon belum aktif.");
    // Fallback dummy client instance agar tidak runtime throw saat build tanpa DATABASE_URL
    const dummyClient = neon("postgresql://dummy:dummy@dummy.neon.tech/dummy?sslmode=require");
    return drizzle(dummyClient, { schema });
  }

  const sql = neon(connectionString);
  return drizzle(sql, { schema });
}

export const db = createDbClient();
export type Database = typeof db;
export * from "./schema";
