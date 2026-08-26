"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Trash2,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Upload,
  Eye,
  EyeOff,
  LogOut,
  Camera,
  Mail,
  Lock,
  Globe,
  X,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"account" | "notifications" | "privacy" | "billing">("account");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Account state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [photoData, setPhotoData] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Notifications state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [cardAlerts, setCardAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Privacy state
  const [publicProfile, setPublicProfile] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(true);

  // Billing state
  const [plan, setPlan] = useState("FREE");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [nextBillingDate, setNextBillingDate] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) {
        router.push("/login");
        return;
      }
      const meData = await meRes.json();
      setUser(meData.user);
      setName(meData.user.name);
      setEmail(meData.user.email);
      setPlan(meData.user.plan || "FREE");
      setPhotoData(meData.user.photoUrl || "");
      
      if (meData.user.plan === "PAID") {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        setNextBillingDate(date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }));
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      setSaveMessage({ type: "error", text: "Image must be 5MB or smaller" });
      return;
    }

    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setPhotoData(data.url);
        setSaveMessage({ type: "success", text: "Profile photo updated" });
      } else {
        setSaveMessage({ type: "error", text: data.error || "Upload failed" });
      }
    } catch (error) {
      setSaveMessage({ type: "error", text: "Upload failed" });
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  };

  const handleSaveAccount = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, photoData, password: password || undefined }),
      });
      const data = await res.json();
      if (res.ok) {
        setSaveMessage({ type: "success", text: "Account updated successfully" });
        setPassword("");
        fetchUserData();
      } else {
        setSaveMessage({ type: "error", text: data.error || "Update failed" });
      }
    } catch (error) {
      setSaveMessage({ type: "error", text: "Update failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailNotifications, cardAlerts, marketingEmails }),
      });
      const data = await res.json();
      if (res.ok) {
        setSaveMessage({ type: "success", text: "Notification preferences updated" });
      } else {
        setSaveMessage({ type: "error", text: data.error || "Update failed" });
      }
    } catch (error) {
      setSaveMessage({ type: "error", text: "Update failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePrivacy = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicProfile, showAnalytics }),
      });
      const data = await res.json();
      if (res.ok) {
        setSaveMessage({ type: "success", text: "Privacy settings updated" });
      } else {
        setSaveMessage({ type: "error", text: data.error || "Update failed" });
      }
    } catch (error) {
      setSaveMessage({ type: "error", text: "Update failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (res.ok) {
        window.location.href = "/";
      } else {
        const data = await res.json();
        setSaveMessage({ type: "error", text: data.error || "Delete failed" });
      }
    } catch (error) {
      setSaveMessage({ type: "error", text: "Delete failed" });
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black font-grotesk tracking-tight">Settings</h1>
          <p className="text-slate-400 mt-1">Manage your account, preferences, and security.</p>
        </div>

        {/* Message */}
        {saveMessage && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            saveMessage.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/10 border border-red-500/20"
          }`}>
            {saveMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span className={saveMessage.type === "success" ? "text-emerald-300" : "text-red-300"}>
              {saveMessage.text}
            </span>
            <button onClick={() => setSaveMessage(null)} className="ml-auto text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-slate-900 rounded-xl mb-8 w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setSaveMessage(null); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Account Settings */}
        {activeTab === "account" && (
          <div className="space-y-6">
            {/* Profile Photo */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-rose-400" />
                Profile Photo
              </h3>
              <div className="flex items-center gap-6">
                <div className="relative">
                  {photoData ? (
                    <img src={photoData} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-slate-700" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-rose-500 flex items-center justify-center text-3xl font-bold border-2 border-slate-700">
                      {name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePhotoUpload(e.target.files?.[0])}
                  />
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center transition-colors disabled:opacity-50"
                  >
                    {uploadingPhoto ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                  </button>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Click to upload a new photo</p>
                  <p className="text-xs text-slate-500 mt-1">JPG, PNG, or GIF. Max 5MB.</p>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-rose-400" />
                Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-rose-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
                    <Mail className="w-4 h-4" />
                    <span>{email}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-rose-500 focus:outline-none transition-colors"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSaveAccount}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-rose-500 to-orange-500 hover:opacity-90 text-white font-bold transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Settings */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-rose-400" />
                Email Notifications
              </h3>
              <div className="space-y-4">
                {[
                  { key: "emailNotifications", label: "Card Activity", desc: "Get notified when someone views or saves your card" },
                  { key: "cardAlerts", label: "New Connections", desc: "Alerts when someone connects with you" },
                  { key: "marketingEmails", label: "Marketing Emails", desc: "Product updates, tips, and promotions" },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
                    <div>
                      <p className="font-medium">{label}</p>
                      <p className="text-sm text-slate-400">{desc}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (key === "emailNotifications") setEmailNotifications(!emailNotifications);
                        if (key === "cardAlerts") setCardAlerts(!cardAlerts);
                        if (key === "marketingEmails") setMarketingEmails(!marketingEmails);
                      }}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        (key === "emailNotifications" && emailNotifications) ||
                        (key === "cardAlerts" && cardAlerts) ||
                        (key === "marketingEmails" && marketingEmails)
                          ? "bg-rose-500"
                          : "bg-slate-700"
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          (key === "emailNotifications" && emailNotifications) ||
                          (key === "cardAlerts" && cardAlerts) ||
                          (key === "marketingEmails" && marketingEmails)
                            ? "translate-x-7"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSaveNotifications}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-rose-500 to-orange-500 hover:opacity-90 text-white font-bold transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Settings */}
        {activeTab === "privacy" && (
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-rose-400" />
                Profile Privacy
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-800">
                  <div>
                    <p className="font-medium">Public Profile</p>
                    <p className="text-sm text-slate-400">Allow anyone to view your card</p>
                  </div>
                  <button
                    onClick={() => setPublicProfile(!publicProfile)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      publicProfile ? "bg-rose-500" : "bg-slate-700"
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      publicProfile ? "translate-x-7" : "translate-x-1"
                    }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">Show Analytics</p>
                    <p className="text-sm text-slate-400">Display view counts on your card</p>
                  </div>
                  <button
                    onClick={() => setShowAnalytics(!showAnalytics)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      showAnalytics ? "bg-rose-500" : "bg-slate-700"
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      showAnalytics ? "translate-x-7" : "translate-x-1"
                    }`} />
                  </button>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSavePrivacy}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-rose-500 to-orange-500 hover:opacity-90 text-white font-bold transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </div>

            {/* Data Download */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h3 className="text-lg font-bold mb-4">Your Data</h3>
              <p className="text-slate-400 text-sm mb-4">Download a copy of all your data including cards and analytics.</p>
              <button className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors">
                Download My Data
              </button>
            </div>
          </div>
        )}

        {/* Billing Settings */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-rose-400" />
                Current Plan
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      plan === "PAID" 
                        ? "bg-gradient-to-r from-purple-500 to-rose-500" 
                        : "bg-slate-800 text-slate-300"
                    }`}>
                      {plan === "PAID" ? "Pro" : "Free"}
                    </span>
                    <div>
                      <p className="font-medium">{plan === "PAID" ? "Pro Plan" : "Free Plan"}</p>
                      <p className="text-sm text-slate-400">
                        {plan === "PAID" ? "$5/month" : "Unlimited free cards"}
                      </p>
                    </div>
                  </div>
                  {plan === "PAID" && nextBillingDate && (
                    <p className="text-sm text-slate-500 mt-3">
                      Next billing date: <span className="text-slate-300">{nextBillingDate}</span>
                    </p>
                  )}
                </div>
                {plan === "FREE" ? (
                  <Link
                    href="/editor"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-rose-500 to-orange-500 hover:opacity-90 text-white font-bold transition-all"
                  >
                    Upgrade to Pro
                  </Link>
                ) : (
                  <button className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all">
                    Manage Subscription
                  </button>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h3 className="text-lg font-bold mb-4">Payment Method</h3>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center text-xs font-bold">
                  VISA
                </div>
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-slate-400">Expires 12/2026</p>
                </div>
                <button className="ml-auto text-rose-400 hover:text-rose-300 text-sm font-medium">
                  Change
                </button>
              </div>
            </div>

            {/* Billing History */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h3 className="text-lg font-bold mb-4">Billing History</h3>
              <div className="space-y-3">
                {[
                  { date: "Jul 26, 2026", amount: "$5.00", status: "Paid" },
                  { date: "Jun 26, 2026", amount: "$5.00", status: "Paid" },
                  { date: "May 26, 2026", amount: "$5.00", status: "Paid" },
                ].map((invoice, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
                    <div>
                      <p className="font-medium">{invoice.date}</p>
                      <p className="text-sm text-slate-400">Pro Plan - Monthly</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{invoice.amount}</span>
                      <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                        {invoice.status}
                      </span>
                      <button className="text-slate-400 hover:text-white text-sm">
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div className="mt-8 bg-red-500/5 rounded-2xl p-6 border border-red-500/20">
          <h3 className="text-lg font-bold text-red-400 mb-2">Danger Zone</h3>
          <p className="text-slate-400 text-sm mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <button
            onClick={handleDeleteAccount}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium text-sm transition-colors border border-red-500/20"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>

        {/* Logout */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium text-sm transition-colors border border-slate-800"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
