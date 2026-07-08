"use client";

import { motion } from "framer-motion";
import { Award, Download, ExternalLink, ShieldCheck, Share2 } from "lucide-react";
import Button from "@/components/common/Button";

export default function StudentCertificatesPage() {
  const certificates = [
    {
      id: "CERT-90812-UX",
      title: "Introduction to Corporate Ethics",
      issuedBy: "EpitomeTRC Academy",
      issuedDate: "15 May 2026",
      type: "Professional Course Certificate",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
        <h1 className="font-display text-2xl font-bold text-[#0b172a] sm:text-3xl">
          Certificates
        </h1>
        <p className="text-slate-500 text-sm font-sans">
          Verify and share your earned certifications and credentials.
        </p>
      </div>

      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div key={cert.id} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between space-y-6">
              <div className="flex gap-4 items-start">
                <span className="p-3 rounded-xl bg-orange-50 text-orange-500 border border-orange-100 shrink-0">
                  <Award className="h-6 w-6" />
                </span>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans block">
                    Verification ID: {cert.id}
                  </span>
                  <h3 className="font-display text-base font-bold text-[#0b172a] leading-snug">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-sans">
                    Issued by {cert.issuedBy} • {cert.issuedDate}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 flex items-center gap-3 border border-slate-100">
                <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                <div className="text-xs font-sans text-slate-600">
                  This credential is authenticated and cryptographically secured on the EpitomeTRC verification registry.
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button variant="primary" size="sm" className="h-9 rounded-xl text-xs font-bold px-4 flex-1">
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Download PDF
                </Button>
                <Button variant="outline" size="sm" className="h-9 rounded-xl text-xs font-bold px-3">
                  <Share2 className="mr-1.5 h-3.5 w-3.5" />
                  Share
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center max-w-lg mx-auto space-y-4">
          <Award className="mx-auto h-12 w-12 text-slate-300" />
          <div className="space-y-1">
            <h3 className="font-display text-base font-bold text-[#0b172a]">No certificates yet</h3>
            <p className="text-slate-500 text-xs font-sans">
              Complete your enrolled courses to receive professional verified credentials.
            </p>
          </div>
          <Button href="/student/courses" variant="primary" size="sm" className="h-9 rounded-xl px-5 font-bold">
            Go to My Courses
          </Button>
        </div>
      )}
    </motion.div>
  );
}
