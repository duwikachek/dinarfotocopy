import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Hanya memproteksi rute admin, tidak mengganggu halaman publik, static assets, dan api
  matcher: ["/admin/:path*"],
};
