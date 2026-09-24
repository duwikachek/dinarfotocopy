"use client";

import { useState, useTransition } from "react";
import { Save, CheckCircle, User, Lock, Eye, EyeOff, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { updateProfileAction, changePasswordAction } from "@/actions/admin-actions";

export default function AdminProfilPage() {
  const { data: session, update: updateSession } = useSession();
  const [profileForm, setProfileForm] = useState({
    name: session?.user?.name ?? "Admin Dinar",
    email: session?.user?.email ?? "admin@dinarfotocopy.id",
  });
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "success" as "success" | "error" });
  const [profilePending, startProfile] = useTransition();
  const [passwordPending, startPassword] = useTransition();

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
  };

  const handleSaveProfile = () => {
    startProfile(async () => {
      const res = await updateProfileAction({
        name: profileForm.name,
        email: profileForm.email,
      });
      if (res.success) {
        await updateSession({ name: profileForm.name, email: profileForm.email });
        showToast("Data akun berhasil diperbarui!");
      } else {
        showToast(res.error || "Gagal memperbarui profil.", "error");
      }
    });
  };

  const handleChangePassword = () => {
    if (!pwForm.current) { showToast("Masukkan password saat ini.", "error"); return; }
    if (pwForm.newPw.length < 8) { showToast("Password baru minimal 8 karakter.", "error"); return; }
    if (pwForm.newPw !== pwForm.confirm) { showToast("Konfirmasi password tidak cocok.", "error"); return; }

    startPassword(async () => {
      const res = await changePasswordAction({
        currentPassword: pwForm.current,
        newPassword: pwForm.newPw,
      });
      if (res.success) {
        showToast("Password berhasil diperbarui!");
        setPwForm({ current: "", newPw: "", confirm: "" });
      } else {
        showToast(res.error || "Gagal memperbarui password.", "error");
      }
    });
  };

  const inputCls = "w-full h-10 px-3 text-sm rounded-lg border border-[hsl(220,13%,91%)] bg-white text-[hsl(224,12%,12%)] focus:outline-none focus:border-[hsl(224,12%,12%)] focus:ring-2 focus:ring-amber-400/20 transition-colors";

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      {/* Toast */}
      {toast.msg && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-md animate-fade-in ${
            toast.type === "error" ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {toast.type === "error" ? (
            <X className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
          )}
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-[hsl(224,12%,12%)] tracking-tight">Profil Saya</h1>
        <p className="text-sm text-[hsl(220,10%,46%)] mt-0.5">Kelola data akun dan keamanan login Anda.</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 p-5 rounded-xl bg-white border border-[hsl(220,13%,91%)]">
        <div className="w-14 h-14 rounded-full bg-[hsl(220,14%,96%)] border border-[hsl(220,13%,91%)] flex items-center justify-center">
          <User className="w-7 h-7 text-[hsl(220,10%,55%)]" strokeWidth={1.5} />
        </div>
        <div>
          <p className="font-semibold text-[hsl(224,12%,12%)]">{profileForm.name}</p>
          <p className="text-sm text-[hsl(220,10%,46%)]">{profileForm.email}</p>
          <p className="text-xs text-[hsl(220,10%,55%)] mt-0.5">
            {(session?.user as any)?.role ?? "Admin"} · Login terakhir: hari ini
          </p>
        </div>
      </div>

      {/* Data Akun */}
      <div className="p-5 rounded-xl bg-white border border-[hsl(220,13%,91%)]">
        <h2 className="text-xs font-semibold text-[hsl(220,10%,55%)] uppercase tracking-widest mb-4 flex items-center gap-2">
          <User className="w-3.5 h-3.5" strokeWidth={1.5} />
          Data Akun
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Nama Tampilan</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Email</label>
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              className={inputCls}
            />
          </div>
        </div>
        <button
          onClick={handleSaveProfile}
          disabled={profilePending}
          className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[hsl(224,12%,12%)] text-white text-sm font-medium hover:bg-[hsl(224,12%,20%)] disabled:opacity-60 transition-colors mt-5"
        >
          {profilePending ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" strokeWidth={1.5} />
          )}
          {profilePending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>

      {/* Ganti Password */}
      <div className="p-5 rounded-xl bg-white border border-[hsl(220,13%,91%)]">
        <h2 className="text-xs font-semibold text-[hsl(220,10%,55%)] uppercase tracking-widest mb-4 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5" strokeWidth={1.5} />
          Ganti Password
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Password Saat Ini</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={pwForm.current}
                onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                placeholder="••••••••"
                className={`${inputCls} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,55%)] hover:text-[hsl(224,12%,12%)] transition-colors"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Password Baru</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={pwForm.newPw}
                onChange={(e) => setPwForm({ ...pwForm, newPw: e.target.value })}
                placeholder="Minimal 8 karakter"
                className={`${inputCls} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,55%)] hover:text-[hsl(224,12%,12%)] transition-colors"
              >
                {showNew ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Konfirmasi Password Baru</label>
            <input
              type="password"
              value={pwForm.confirm}
              onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
              placeholder="••••••••"
              className={inputCls}
            />
          </div>
        </div>
        <button
          onClick={handleChangePassword}
          disabled={passwordPending}
          className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[hsl(224,12%,12%)] text-white text-sm font-medium hover:bg-[hsl(224,12%,20%)] disabled:opacity-60 transition-colors mt-5"
        >
          {passwordPending ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Lock className="w-4 h-4" strokeWidth={1.5} />
          )}
          {passwordPending ? "Memperbarui..." : "Perbarui Password"}
        </button>
      </div>
    </div>
  );
}
