"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CardoraLogo } from "@/components/CardoraLogo";
import {
  Shield,
  Lock,
  Mail,
  Search,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Users,
  CreditCard,
  Eye,
  History,
  X,
  Save,
  LogOut,
  Upload,
} from "lucide-react";

export default function AdminPage() {
  const [admin, setAdmin] = useState<any>(null);
  const [email, setEmail] = useState("admin@cardora.io");
  const [password, setPassword] = useState("admin12345");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(true);

  // Admin Data State
  const [cards, setCards] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalCards: 0, totalViews: 0, totalSaves: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"cards" | "audit">("cards");

  // Edit Modal State
  const [editingCard, setEditingCard] = useState<any | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkAdminSession();
  }, []);

  const checkAdminSession = async () => {
    try {
      const res = await fetch("/api/admin/cards");
      if (res.ok) {
        const data = await res.json();
        setAdmin(data.admin);
        setCards(data.cards);
        setStats(data.stats);
        fetchAuditLogs();
      } else {
        setAdmin(null);
      }
    } catch (e) {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch("/api/admin/audit-logs");
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Admin authentication failed");
      }

      await checkAdminSession();
    } catch (err: any) {
      setLoginError(err.message || "Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAdmin(null);
  };

  const handleDeleteCard = async (cardId: string, cardName: string) => {
    if (!confirm(`ADMIN CONFIRMATION: Are you sure you want to delete card "${cardName}"? This action will be recorded in the audit log.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/cards/${cardId}`, { method: "DELETE" });
      if (res.ok) {
        setCards((prev) => prev.filter((c) => c.id !== cardId));
        fetchAuditLogs();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminPhotoFile = async (file: File | undefined) => {
    if (!file || !editingCard) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;

    setUploadingPhoto(true);
    try {
      const payload = new FormData();
      payload.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: payload });
      const data = await res.json();
      if (res.ok && data.url) {
        setEditingCard({ ...editingCard, photoData: data.url });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  };

  const handleSaveEditCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;

    try {
      const res = await fetch(`/api/admin/cards/${editingCard.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCard),
      });

      if (res.ok) {
        const data = await res.json();
        setCards((prev) => prev.map((c) => (c.id === editingCard.id ? data.card : c)));
        setEditingCard(null);
        fetchAuditLogs();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredCards = cards.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-12 h-12 rounded-full border-4 border-rose-500 border-t-transparent animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  // Admin Login Screen if not authenticated as Admin
  if (!admin) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-rose-500 selection:text-white">
        <Navbar />

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2 flex flex-col items-center">
              <div className="mb-2">
                <CardoraLogo size={48} showText={false} />
              </div>
              <h2 className="text-2xl font-black font-grotesk tracking-tight">Admin Portal Login</h2>
              <p className="text-xs text-slate-400">Protected site owner authentication</p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-slate-900 border border-slate-800 focus:border-rose-500 focus:outline-none text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-slate-900 border border-slate-800 focus:border-rose-500 focus:outline-none text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 via-rose-500 to-orange-500 hover:opacity-90 text-white font-extrabold text-xs shadow-lg transition-all active:scale-95 font-grotesk"
              >
                Authenticate Admin Access
              </button>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black font-grotesk tracking-tight">Admin System Control</h1>
              <p className="text-xs text-slate-400">Logged in as {admin.email} (Audit logging active)</p>
            </div>
          </div>

          <button
            onClick={handleAdminLogout}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            Log Out Admin
          </button>
        </div>

        {/* Global Platform Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Total Platform Users</span>
            </div>
            <p className="text-3xl font-black text-white font-grotesk">{stats.totalUsers}</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
              <CreditCard className="w-4 h-4 text-rose-400" />
              <span>Total Digital Cards</span>
            </div>
            <p className="text-3xl font-black text-white font-grotesk">{stats.totalCards}</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
              <Eye className="w-4 h-4 text-orange-400" />
              <span>Total Card Views</span>
            </div>
            <p className="text-3xl font-black text-white font-grotesk">{stats.totalViews}</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
              <History className="w-4 h-4 text-purple-400" />
              <span>Audit Log Entries</span>
            </div>
            <p className="text-3xl font-black text-white font-grotesk">{auditLogs.length}</p>
          </div>
        </div>

        {/* Navigation Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab("cards")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "cards" ? "bg-gradient-to-r from-purple-500 via-rose-500 to-orange-500 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              All User Cards ({cards.length})
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "audit" ? "bg-gradient-to-r from-purple-500 via-rose-500 to-orange-500 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Audit Log History ({auditLogs.length})
            </button>
          </div>

          {activeTab === "cards" && (
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search cards, users, titles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-rose-500 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* TAB 1: ALL USER CARDS TABLE */}
        {activeTab === "cards" && (
          <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Card Profile</th>
                    <th className="p-4">Owner Email</th>
                    <th className="p-4">Slug / Link</th>
                    <th className="p-4">Views / Saves</th>
                    <th className="p-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredCards.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        No cards matching search filter.
                      </td>
                    </tr>
                  ) : (
                    filteredCards.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {c.photoData ? (
                              <img src={c.photoData} alt={c.name} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-rose-500 text-white font-bold flex items-center justify-center">
                                {c.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-white text-sm font-grotesk">{c.name}</div>
                              <div className="text-[11px] text-slate-400">{c.title}</div>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 font-mono text-slate-300">
                          {c.user?.email || "Unknown User"}
                        </td>

                        <td className="p-4 font-mono text-rose-400">
                          /c/{c.slug}
                        </td>

                        <td className="p-4">
                          <div className="text-xs font-semibold">
                            <span className="text-purple-400">{c.views} views</span> • <span className="text-orange-400">{c.saves} saves</span>
                          </div>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingCard(c)}
                              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-400 border border-slate-800 transition-colors"
                              title="Admin Edit Card"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCard(c.id, c.name)}
                              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-800 transition-colors"
                              title="Admin Delete Card"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: AUDIT LOG HISTORY TABLE */}
        {activeTab === "audit" && (
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="text-lg font-black font-grotesk text-white">Immutable Admin Audit Log</h3>
              <p className="text-xs text-slate-400">Records all admin card modifications and deletions with timestamps</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Admin</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300 font-mono">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-slate-500">
                        No admin audit actions logged yet.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-900/50">
                        <td className="p-3 text-slate-400 text-[11px]">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="p-3 text-rose-400 font-bold">
                          {log.admin?.name || log.admin?.email || "Admin"}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.action.includes("DELETE") ? "bg-red-500/20 text-red-400" : "bg-purple-500/20 text-purple-300"}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="p-3 text-slate-200">{log.details}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Admin Edit Card Modal */}
      {editingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-extrabold text-base font-grotesk flex items-center gap-2">
                <Edit className="w-4 h-4 text-purple-400" /> Admin Edit Card
              </h3>
              <button onClick={() => setEditingCard(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCard} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Profile Photo</label>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => handleAdminPhotoFile(e.target.files?.[0])}
                />
                {editingCard.photoData ? (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <img
                      src={editingCard.photoData}
                      alt="Card photo"
                      className="w-12 h-12 rounded-full object-cover border border-slate-700 shrink-0"
                    />
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      disabled={uploadingPhoto}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-200"
                    >
                      {uploadingPhoto ? "Uploading..." : "Change"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCard({ ...editingCard, photoData: "" })}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                      aria-label="Remove photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="w-full py-4 rounded-xl border-2 border-dashed border-slate-700 bg-slate-900 hover:border-rose-500/50 text-center"
                  >
                    <Upload className="w-4 h-4 text-rose-400 mx-auto mb-1" />
                    <span className="text-[11px] font-semibold text-slate-300">
                      {uploadingPhoto ? "Uploading..." : "Upload photo"}
                    </span>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Name</label>
                <input
                  type="text"
                  value={editingCard.name}
                  onChange={(e) => setEditingCard({ ...editingCard, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={editingCard.title}
                  onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Bio</label>
                <textarea
                  rows={2}
                  value={editingCard.bio}
                  onChange={(e) => setEditingCard({ ...editingCard, bio: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 via-rose-500 to-orange-500 text-white font-bold flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
