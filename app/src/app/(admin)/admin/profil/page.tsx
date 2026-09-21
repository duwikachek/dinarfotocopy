"use client";

import { useState } from "react";
import { Save, CheckCircle, User, Lock, Eye, EyeOff } from "lucide-react";

export default function AdminProfilPage() {
  const [profileForm, setProfileForm] = useState({ name: "Admin Dinar", email: "admin@dinarfotocopy.id" });
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [toast, setToast] = useState("");

  const handleSave = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-white text-sm font-medium shadow-md animate-fade-in">
          <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
          {toast}
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
          <p className="text-xs text-[hsl(220,10%,55%)] mt-0.5">Admin · Login terakhir: hari ini</p>
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
              className="w-full h-10 px-3 text-sm rounded-lg border border-[hsl(220,13%,91%)] bg-white focus:outline-none focus:border-[hsl(224,12%,12%)] focus:ring-2 focus:ring-amber-400/20 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Email</label>
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              className="w-full h-10 px-3 text-sm rounded-lg border border-[hsl(220,13%,91%)] bg-white focus:outline-none focus:border-[hsl(224,12%,12%)] focus:ring-2 focus:ring-amber-400/20 transition-colors"
            />
          </div>
        </div>
        <button
          onClick={() => handleSave("Data akun berhasil diperbarui!")}
          className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[hsl(224,12%,12%)] text-white text-sm font-medium hover:bg-[hsl(224,12%,20%)] transition-colors mt-5"
        >
          <Save className="w-4 h-4" strokeWidth={1.5} />
          Simpan Perubahan
        </button>
      </div>

      {/* Ganti Password */}
      <div className="p-5 rounded-xl bg-white border border-[hsl(220,13%,91%)]">
        <h2 className="text-xs font-semibold text-[hsl(220,10%,55%)] uppercase tracking-widest mb-4 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5" strokeWidth={1.5} />
          Ganti Password
        </h2>
        <div className="flex flex-col gap-4">
          {/* Current password */}
          <div>
            <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Password Saat Ini</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={pwForm.current}
                onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                placeholder="••••••••"
                className="w-full h-10 px-3 pr-10 text-sm rounded-lg border border-[hsl(220,13%,91%)] bg-white focus:outline-none focus:border-[hsl(224,12%,12%)] focus:ring-2 focus:ring-amber-400/20 transition-colors"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,55%)] hover:text-[hsl(224,12%,12%)] transition-colors">
                {showCurrent ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
              </button>
            </div>
          </div>
          {/* New password */}
          <div>
            <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Password Baru</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={pwForm.newPw}
                onChange={(e) => setPwForm({ ...pwForm, newPw: e.target.value })}
                placeholder="Minimal 8 karakter"
                className="w-full h-10 px-3 pr-10 text-sm rounded-lg border border-[hsl(220,13%,91%)] bg-white focus:outline-none focus:border-[hsl(224,12%,12%)] focus:ring-2 focus:ring-amber-400/20 transition-colors"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,55%)] hover:text-[hsl(224,12%,12%)] transition-colors">
                {showNew ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
              </button>
            </div>
          </div>
          {/* Confirm */}
          <div>
            <label className="text-xs font-medium text-[hsl(224,12%,12%)] mb-1.5 block">Konfirmasi Password Baru</label>
            <input
              type="password"
              value={pwForm.confirm}
              onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
              placeholder="••••••••"
              className="w-full h-10 px-3 text-sm rounded-lg border border-[hsl(220,13%,91%)] bg-white focus:outline-none focus:border-[hsl(224,12%,12%)] focus:ring-2 focus:ring-amber-400/20 transition-colors"
            />
          </div>
        </div>
        <button
          onClick={() => {
            if (pwForm.newPw !== pwForm.confirm) { alert("Password baru tidak cocok!"); return; }
            if (pwForm.newPw.length < 8) { alert("Password minimal 8 karakter!"); return; }
            handleSave("Password berhasil diperbarui!");
            setPwForm({ current: "", newPw: "", confirm: "" });
          }}
          className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[hsl(224,12%,12%)] text-white text-sm font-medium hover:bg-[hsl(224,12%,20%)] transition-colors mt-5"
        >
          <Lock className="w-4 h-4" strokeWidth={1.5} />
          Perbarui Password
        </button>
      </div>
    </div>
  );
}
