"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Printer, AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.email.includes("@")) errs.email = "Masukkan alamat email yang valid.";
    if (form.password.length < 6) errs.password = "Password minimal 6 karakter.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setServerError("");
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (res?.error) {
        setServerError("Email atau password salah. Silakan periksa kembali.");
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setServerError("Terjadi kendala saat menghubungi server. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm animate-fade-in">
      {/* Brand */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-[hsl(224,12%,12%)] flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Printer className="w-6 h-6 text-white" strokeWidth={1.5} />
        </div>
        <h1 className="text-xl font-bold text-[hsl(224,12%,12%)] tracking-tight">
          Dinar Fotocopy
        </h1>
        <p className="text-sm text-[hsl(220,10%,46%)] mt-1">Panel Admin</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl border border-[hsl(220,13%,91%)] p-6 shadow-sm">
        <h2 className="text-base font-semibold text-[hsl(224,12%,12%)] mb-5">
          Masuk ke Dashboard
        </h2>

        {/* Server Error */}
        {serverError && (
          <div className="flex items-center gap-2.5 p-3 mb-4 rounded-lg bg-red-50 border border-red-200">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" strokeWidth={1.5} />
            <p className="text-xs text-red-600">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@dinarfotocopy.id"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={cn(
                "w-full h-10 px-3 text-sm rounded-lg border bg-white text-[hsl(224,12%,12%)] placeholder:text-[hsl(220,10%,65%)] focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-colors",
                errors.email
                  ? "border-red-400 focus:border-red-400"
                  : "border-[hsl(220,13%,91%)] focus:border-[hsl(224,12%,12%)]"
              )}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={cn(
                  "w-full h-10 px-3 pr-10 text-sm rounded-lg border bg-white text-[hsl(224,12%,12%)] placeholder:text-[hsl(220,10%,65%)] focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-colors",
                  errors.password
                    ? "border-red-400 focus:border-red-400"
                    : "border-[hsl(220,13%,91%)] focus:border-[hsl(224,12%,12%)]"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,55%)] hover:text-[hsl(224,12%,12%)] transition-colors"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                ) : (
                  <Eye className="w-4 h-4" strokeWidth={1.5} />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full h-11 rounded-lg bg-[hsl(224,12%,12%)] text-white text-sm font-semibold hover:bg-[hsl(224,12%,20%)] disabled:opacity-60 disabled:pointer-events-none transition-colors mt-1"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memproses...
              </>
            ) : (
              "Masuk ke Dashboard"
            )}
          </button>
        </form>

        <p className="text-[11px] text-[hsl(220,10%,55%)] text-center mt-5">
          Default development: <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px]">admin@dinarfotocopy.id</code> / <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px]">Password123!</code>
        </p>
      </div>

      <div className="mt-4 text-center">
        <Link
          href="/"
          className="text-xs text-[hsl(220,10%,55%)] hover:text-[hsl(224,12%,12%)] transition-colors"
        >
          ← Kembali ke beranda utama
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="text-sm text-center text-slate-500">Memuat...</div>}>
      <LoginForm />
    </Suspense>
  );
}
