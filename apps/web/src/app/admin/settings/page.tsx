"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Save, ShieldCheck } from "lucide-react";
import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState("EpitomeTRC");
  const [adminEmail, setAdminEmail] = useState("");
  const [maintenance, setMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) {
          setSiteName(payload.settings.siteName);
          setAdminEmail(payload.settings.adminEmail);
          setMaintenance(payload.settings.maintenance);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteName, adminEmail, maintenance }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Configuration saved successfully!");
      } else {
        alert(data.error || "Failed to save settings");
      }
    } catch {
      alert("Failed to save settings due to a network error.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 font-sans"
    >
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
        <h1 className="font-display text-2xl font-bold text-[#0b172a] sm:text-3xl">
          System Settings
        </h1>
        <p className="text-slate-500 text-sm">
          Configure site-wide metadata, administrator profiles, and operational modes.
        </p>
      </div>

      <form onSubmit={handleSave} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5 max-w-xl">
        <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider flex items-center gap-2">
          <Settings className="h-4.5 w-4.5 text-orange-500" /> Platform Configuration
        </h2>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
            Platform Site Name
          </label>
          <Input
            type="text"
            required
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="h-10 rounded-xl border-slate-200 w-full"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
            System Administrator Email
          </label>
          <Input
            type="email"
            required
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            className="h-10 rounded-xl border-slate-200 w-full"
          />
        </div>

        <label className="flex items-center space-x-2.5 cursor-pointer py-1 select-none">
          <input
            type="checkbox"
            checked={maintenance}
            onChange={(e) => setMaintenance(e.target.checked)}
            className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 h-4 w-4 accent-orange-500"
          />
          <span className="text-xs text-slate-600 font-semibold font-sans">
            Enable Maintenance Mode
          </span>
        </label>

        <div className="pt-2">
          <Button type="submit" variant="primary" size="sm" className="h-9 px-5 rounded-xl font-bold" disabled={saving}>
            <Save className="mr-1.5 h-4 w-4" /> {saving ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
