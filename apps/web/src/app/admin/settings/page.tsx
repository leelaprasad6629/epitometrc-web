"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Save,
  ShieldCheck,
  Building2,
  GraduationCap,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Plus,
  Trash2,
  ListTodo,
} from "lucide-react";
import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";

type TabType = "general" | "ai" | "memberships" | "marketing";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // States for configs
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [mapQuery, setMapQuery] = useState("");

  const [aiFeatures, setAiFeatures] = useState<any[]>([]);
  const [membershipPlans, setMembershipPlans] = useState<any[]>([]);
  const [statsList, setStatsList] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);

  // Create form states for appending new items
  const [newStat, setNewStat] = useState({ key: "", label: "", value: "", desc: "", order: 1 });
  const [newService, setNewService] = useState({ title: "", subtitle: "", slug: "", description: "", iconName: "", category: "", features: [] as string[] });
  const [newFeatureText, setNewFeatureText] = useState("");

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const payload = await res.json();
      if (payload.success) {
        const info = payload.settings.companyInfo;
        setPhone(info.phone || "");
        setEmail(info.email || "");
        setAddress(info.address || "");
        setMapQuery(info.mapQuery || "");

        setAiFeatures(payload.settings.aiFeatures || []);
        setMembershipPlans(payload.settings.membershipPlans || []);
        setStatsList(payload.settings.statsList || []);
        setServicesList(payload.settings.servicesList || []);
      }
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const saveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "info",
          data: { phone, email, address, mapQuery },
        }),
      });
      if (res.ok) alert("General info updated successfully!");
    } catch {
      alert("Failed to save info.");
    } finally {
      setSaving(false);
    }
  };

  const toggleAiFeature = async (id: string, currentVal: boolean) => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ai",
          data: { id, isEnabled: !currentVal },
        }),
      });
      if (res.ok) {
        setAiFeatures((prev) =>
          prev.map((f) => (f.id === id ? { ...f, isEnabled: !currentVal } : f))
        );
      }
    } catch {
      alert("Failed to toggle feature flag.");
    }
  };

  const saveMembershipPlan = async (plan: any) => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "membership",
          data: plan,
        }),
      });
      if (res.ok) alert(`Plan limits for ${plan.name} updated successfully!`);
    } catch {
      alert("Failed to update plan parameters.");
    }
  };

  const handleStatAction = async (id: string, action: string, payload?: any) => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "stat",
          data: { id, action, ...payload },
        }),
      });
      if (res.ok) {
        loadSettings();
        if (action === "create") setNewStat({ key: "", label: "", value: "", desc: "", order: 1 });
      }
    } catch {
      alert("Stat operation failed.");
    }
  };

  const handleServiceAction = async (id: string, action: string, payload?: any) => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "service",
          data: { id, action, ...payload },
        }),
      });
      if (res.ok) {
        loadSettings();
        if (action === "create") {
          setNewService({ title: "", subtitle: "", slug: "", description: "", iconName: "", category: "", features: [] });
        }
      }
    } catch {
      alert("Service operation failed.");
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
    <div className="space-y-6 font-sans">
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
        <h1 className="font-display text-2xl font-bold text-[#0b172a] sm:text-3xl">
          Site Settings Dashboard
        </h1>
        <p className="text-slate-500 text-sm">
          Update your contact info, pricing configurations, and homepage resources dynamically without code modifications.
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex gap-2 border-b border-slate-100 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "general" ? "bg-orange-500 text-white" : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          Company Information
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "ai" ? "bg-orange-500 text-white" : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          AI Config Toggles
        </button>
        <button
          onClick={() => setActiveTab("memberships")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "memberships" ? "bg-orange-500 text-white" : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          Membership Pricing
        </button>
        <button
          onClick={() => setActiveTab("marketing")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "marketing" ? "bg-orange-500 text-white" : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          Stats &amp; Services
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* Tab 1: General Info */}
        {activeTab === "general" && (
          <motion.form
            key="general"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onSubmit={saveInfo}
            className="rounded-2xl border border-slate-150 bg-white p-6 shadow-sm space-y-4 max-w-xl"
          >
            <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider flex items-center gap-2">
              <Building2 className="h-4.5 w-4.5 text-orange-500" /> Corporate Headquarters Info
            </h2>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 uppercase block">Office Contact Phone</label>
              <Input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 uppercase block">Official Careers Email</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 uppercase block">Swadesh Bhawan Physical Address</label>
              <textarea
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 uppercase block">Google Maps Search Query</label>
              <Input
                type="text"
                value={mapQuery}
                onChange={(e) => setMapQuery(e.target.value)}
                className="h-10 rounded-xl"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="sm" className="h-9 px-5 rounded-xl font-bold" disabled={saving}>
                <Save className="mr-1.5 h-4 w-4" /> {saving ? "Saving..." : "Save Info"}
              </Button>
            </div>
          </motion.form>
        )}

        {/* Tab 2: AI Configs */}
        {activeTab === "ai" && (
          <motion.div
            key="ai"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {aiFeatures.map((feat) => (
              <div key={feat.id} className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-[#0b172a] text-sm flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-orange-500" /> {feat.featureName}
                    </h3>
                    <button onClick={() => toggleAiFeature(feat.id, feat.isEnabled)} className="focus:outline-none text-[#0b172a]">
                      {feat.isEnabled ? (
                        <ToggleRight className="h-7 w-7 text-emerald-500 fill-current" />
                      ) : (
                        <ToggleLeft className="h-7 w-7 text-slate-300" />
                      )}
                    </button>
                  </div>
                  <p className="text-slate-500 text-xs">{feat.description}</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl text-[10px] text-slate-600">
                  <span className="font-bold uppercase tracking-wider block mb-1">Capabilities:</span>
                  {JSON.parse(feat.capabilities).map((cap: string, i: number) => (
                    <span key={i} className="block">• {cap}</span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Tab 3: Membership plans */}
        {activeTab === "memberships" && (
          <motion.div
            key="memberships"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {membershipPlans.map((plan) => (
              <div key={plan.id} className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div>
                  <h3 className="font-display font-bold text-[#0b172a] text-sm">{plan.name}</h3>
                  <span className="text-slate-400 text-xs uppercase tracking-wider">Plan ID: {plan.id.slice(0, 8)}</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-700 uppercase block">Plan Price</label>
                  <Input
                    type="text"
                    value={plan.price}
                    onChange={(e) =>
                      setMembershipPlans((prev) =>
                        prev.map((p) => (p.id === plan.id ? { ...p, price: e.target.value } : p))
                      )
                    }
                    className="h-9 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-700 uppercase block">Max Interviews</label>
                    <Input
                      type="number"
                      value={plan.maxInterviews}
                      onChange={(e) =>
                        setMembershipPlans((prev) =>
                          prev.map((p) => (p.id === plan.id ? { ...p, maxInterviews: e.target.value } : p))
                        )
                      }
                      className="h-9 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-700 uppercase block">Max Resumes</label>
                    <Input
                      type="number"
                      value={plan.maxResumes}
                      onChange={(e) =>
                        setMembershipPlans((prev) =>
                          prev.map((p) => (p.id === plan.id ? { ...p, maxResumes: e.target.value } : p))
                        )
                      }
                      className="h-9 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2 md:pt-0">
                  <Button
                    onClick={() => saveMembershipPlan(plan)}
                    variant="primary"
                    size="sm"
                    className="h-9 px-4 rounded-xl font-bold"
                  >
                    <Save className="mr-1 h-3.5 w-3.5" /> Save Plan
                  </Button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Tab 4: Stats and Services */}
        {activeTab === "marketing" && (
          <motion.div
            key="marketing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Stats section */}
            <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-sm space-y-4">
              <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="h-4.5 w-4.5 text-orange-500" /> Platform Statistics
              </h2>

              <div className="space-y-2">
                {statsList.map((stat) => (
                  <div key={stat.id} className="flex gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-800 w-1/4 truncate">{stat.label}</span>
                    <span className="text-xs font-bold text-orange-600">{stat.value}</span>
                    <span className="text-xs text-slate-400 truncate flex-1">{stat.desc}</span>
                    <button
                      onClick={() => handleStatAction(stat.id, "delete")}
                      className="p-1 hover:text-red-500 text-slate-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add stat form */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-2 border-t border-slate-100">
                <Input
                  placeholder="Key (e.g. clients)"
                  value={newStat.key}
                  onChange={(e) => setNewStat((prev) => ({ ...prev, key: e.target.value }))}
                  className="h-9 text-xs rounded-xl"
                />
                <Input
                  placeholder="Label (e.g. Corporate Clients)"
                  value={newStat.label}
                  onChange={(e) => setNewStat((prev) => ({ ...prev, label: e.target.value }))}
                  className="h-9 text-xs rounded-xl"
                />
                <Input
                  placeholder="Value (e.g. 340+)"
                  value={newStat.value}
                  onChange={(e) => setNewStat((prev) => ({ ...prev, value: e.target.value }))}
                  className="h-9 text-xs rounded-xl"
                />
                <Input
                  placeholder="Short Description"
                  value={newStat.desc}
                  onChange={(e) => setNewStat((prev) => ({ ...prev, desc: e.target.value }))}
                  className="h-9 text-xs rounded-xl"
                />
                <Button
                  onClick={() => handleStatAction("", "create", newStat)}
                  variant="primary"
                  size="sm"
                  className="h-9 rounded-xl font-bold flex items-center justify-center"
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Stat
                </Button>
              </div>
            </div>

            {/* Services section */}
            <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-sm space-y-4">
              <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider flex items-center gap-2">
                <ListTodo className="h-4.5 w-4.5 text-orange-500" /> Company Services
              </h2>

              <div className="space-y-4">
                {servicesList.map((srv) => (
                  <div key={srv.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 relative">
                    <button
                      onClick={() => handleServiceAction(srv.id, "delete")}
                      className="absolute top-4 right-4 p-1 hover:text-red-500 text-slate-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div>
                      <h4 className="text-xs font-bold text-[#0b172a]">{srv.title}</h4>
                      <p className="text-[11px] text-slate-400">{srv.subtitle} | Slug: {srv.slug}</p>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">{srv.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {JSON.parse(srv.features).map((feat: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-orange-100/50 text-[10px] text-orange-700 font-semibold border border-orange-200/20">
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add service form */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Input
                    placeholder="Service Title"
                    value={newService.title}
                    onChange={(e) => setNewService((prev) => ({ ...prev, title: e.target.value }))}
                    className="h-9 text-xs rounded-xl"
                  />
                  <Input
                    placeholder="Subtitle / Tagline"
                    value={newService.subtitle}
                    onChange={(e) => setNewService((prev) => ({ ...prev, subtitle: e.target.value }))}
                    className="h-9 text-xs rounded-xl"
                  />
                  <Input
                    placeholder="Slug (e.g. consulting)"
                    value={newService.slug}
                    onChange={(e) => setNewService((prev) => ({ ...prev, slug: e.target.value }))}
                    className="h-9 text-xs rounded-xl"
                  />
                  <Input
                    placeholder="Category"
                    value={newService.category}
                    onChange={(e) => setNewService((prev) => ({ ...prev, category: e.target.value }))}
                    className="h-9 text-xs rounded-xl"
                  />
                </div>
                <textarea
                  placeholder="Enter service details description..."
                  rows={2}
                  value={newService.description}
                  onChange={(e) => setNewService((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                />

                <div className="flex gap-2">
                  <Input
                    placeholder="Add a key feature and click Enter"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newFeatureText.trim()) {
                        e.preventDefault();
                        setNewService((prev) => ({
                          ...prev,
                          features: [...prev.features, newFeatureText.trim()],
                        }));
                        setNewFeatureText("");
                      }
                    }}
                    className="h-9 text-xs rounded-xl"
                  />
                  <div className="flex flex-wrap gap-1 items-center">
                    {newService.features.map((f, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-semibold border">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => handleServiceAction("", "create", newService)}
                  variant="primary"
                  size="sm"
                  className="h-9 rounded-xl font-bold px-5"
                >
                  <Plus className="mr-1.5 h-4 w-4" /> Save New Service
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
