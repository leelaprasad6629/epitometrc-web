"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  ShieldCheck,
  MapPin,
  Award,
  Phone,
  Globe,
  Briefcase,
  Sparkles,
  CheckCircle2,
  X,
  Edit,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Button from "@/components/common/Button";
import DashboardCard from "@/components/dashboard/DashboardCard";
import ProgressBar from "@/components/dashboard/ProgressBar";
import { Input } from "@/components/ui/input";

export default function EmployeeProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [office, setOffice] = useState("");
  const [availability, setAvailability] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const fetchProfile = () => {
    fetch("/api/employee/profile")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) {
          setProfile(payload.profile);
          setName(payload.profile.name);
          setPhone(payload.profile.phone);
          setSpecialization(payload.profile.specialization);
          setOffice(payload.profile.office);
          setAvailability(payload.profile.availability);
          setAvailabilityStatus(payload.profile.availabilityStatus);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/employee/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          specialization,
          office,
          availability,
          availabilityStatus,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveStatus("Profile updated successfully!");
        fetchProfile();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("user-profile-updated"));
        }
        setTimeout(() => {
          setIsEditing(false);
          setSaveStatus(null);
        }, 1500);
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch {
      alert("Failed to save changes due to a network error.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      if (!base64) return;

      try {
        setSaving(true);
        const res = await fetch("/api/employee/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileImage: base64 }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          fetchProfile();
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("user-profile-updated"));
          }
        } else {
          alert(data.error || "Failed to upload photo");
        }
      } catch (err) {
        console.error("Photo upload error:", err);
      } finally {
        setSaving(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const clientPortfolio = [
    { name: "GlobalTech Solutions", allocation: 60, status: "Active Lead", variant: "blue" as const },
    { name: "Apex Strategy Group", allocation: 25, status: "On Track", variant: "purple" as const },
    { name: "Torus Systems", allocation: 15, status: "Pending Review", variant: "orange" as const },
  ];

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center bg-slate-50/10">
        <div className="relative flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <Zap className="absolute h-4.5 w-4.5 text-orange-500 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 font-sans text-xs text-slate-700 pb-12"
    >
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
        <h1 className="font-display text-2xl font-bold text-[#0b172a] sm:text-3xl">
          My Profile Settings
        </h1>
        <p className="text-slate-500 text-sm">
          Manage your advisor credentials, professional specializations, and availability status.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card & Details */}
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard glowColor="blue" title="Advisor Profile" subtitle="Public directory overview credentials">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-5 items-center">
                <div className="relative h-20 w-20 rounded-2xl border border-slate-100 overflow-hidden shrink-0 shadow-inner group">
                  {profile?.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt="Advisor avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-orange-50 text-orange-500 flex items-center justify-center font-bold text-2xl">
                      {profile?.name?.charAt(0) || "U"}
                    </div>
                  )}
                  {/* Photo Upload Overlay */}
                  <label className="absolute inset-0 bg-black/45 text-white text-[9px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-center p-1 font-sans">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h3 className="font-display text-lg font-bold text-[#0b172a] leading-none">
                    {profile?.name}
                  </h3>
                  <p className="text-xs font-bold text-orange-500 font-sans">{profile?.role}</p>

                  <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-1 text-slate-400 text-[10.5px] font-sans font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" /> {profile?.office}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-slate-400" /> {profile?.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-slate-400" /> {profile?.phone || "No phone added"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-slate-50 text-left">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Specialization Focus
                </h4>
                <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                  {profile?.specialization}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="h-9 px-5 bg-[#0b172a] text-white hover:bg-slate-800 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit Details
                </button>
              </div>
            </div>
          </DashboardCard>

          {/* Active Client Portfolio Allocations */}
          <DashboardCard glowColor="purple" title="Active Client Allocations" subtitle="Current strategic lead task distribution">
            <div className="space-y-4">
              {clientPortfolio.map((item, idx) => (
                <div key={idx} className="space-y-2 text-left">
                  <div className="flex justify-between items-center text-slate-500 font-semibold font-sans">
                    <span className="text-xs text-slate-800 font-bold">{item.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] border font-bold uppercase tracking-wider ${
                      item.variant === "blue" 
                        ? "text-blue-700 bg-blue-50 border-blue-100" 
                        : item.variant === "purple" 
                        ? "text-purple-700 bg-purple-50 border-purple-100" 
                        : "text-orange-700 bg-orange-50 border-orange-100"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <ProgressBar percent={item.allocation} variant={item.variant} showLabel={true} />
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          <DashboardCard glowColor="orange" title="Verification Status" subtitle="Adviser validation and rank">
            <div className="space-y-5 text-left">
              <div className="flex items-center gap-3.5 p-3.5 bg-orange-50/20 border border-orange-100/50 rounded-2xl">
                <ShieldCheck className="h-6 w-6 text-orange-500 shrink-0" />
                <div>
                  <h4 className="font-display text-xs font-extrabold text-[#0b172a]">{profile?.verifiedStatus}</h4>
                  <p className="text-[10px] text-slate-400 font-medium font-sans">EpitomeTRC Advisor Network</p>
                </div>
              </div>

              <div className="space-y-1 pt-1.5 border-t border-slate-50">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                  Global Availability
                </span>
                <p className="text-xs font-extrabold text-slate-800 leading-snug">
                  {profile?.availability} ({profile?.availabilityStatus})
                </p>
              </div>
            </div>
          </DashboardCard>

          {/* AI companion widget */}
          <DashboardCard glowColor="purple" title="AI Advisor Companion" subtitle="Personalized automation assistant">
            <div className="space-y-3.5 text-left">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-sans">
                <Sparkles className="h-3.5 w-3.5 text-purple-500" /> Intelligent Insights
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold italic">
                "Currently tracking {profile?.availability} bandwidth availability. Focus allocations on Torus Systems review pipelines to accelerate Q4 corporate onboarding targets."
              </p>
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Edit Details Overlay Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-xl max-w-md w-full p-6 space-y-4 text-left"
            >
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <h3 className="font-display text-sm font-extrabold text-[#0b172a] uppercase tracking-wider">
                  Edit Advisor Profile
                </h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-9 text-xs font-semibold rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                    Contact Phone
                  </label>
                  <Input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-9 text-xs font-semibold rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                    Specialization Focus
                  </label>
                  <Input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="h-9 text-xs font-semibold rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                    Office Location
                  </label>
                  <Input
                    type="text"
                    value={office}
                    onChange={(e) => setOffice(e.target.value)}
                    className="h-9 text-xs font-semibold rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                      Availability (%)
                    </label>
                    <Input
                      type="text"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="h-9 text-xs font-semibold rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                      Status Label
                    </label>
                    <Input
                      type="text"
                      value={availabilityStatus}
                      onChange={(e) => setAvailabilityStatus(e.target.value)}
                      className="h-9 text-xs font-semibold rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  {saveStatus ? (
                    <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1 animate-pulse">
                      <CheckCircle2 className="h-4 w-4" /> {saveStatus}
                    </span>
                  ) : (
                    <div />
                  )}
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 bg-orange-500 text-white hover:bg-orange-655 text-xs font-bold rounded-xl transition-all shadow-md"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
