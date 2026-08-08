"use client";

import { ShieldCheck, CheckCircle2, Building2, GraduationCap, ArrowRight } from "lucide-react";
import Container from "@/components/common/Container";
import Link from "next/link";

export default function Testimonials() {
  return (
    <section className="bg-[#faf5f0] py-16 md:py-24 border-y border-[#ede0d4] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-10 w-96 h-96 rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-10 w-96 h-96 rounded-full bg-blue-500/3 blur-[120px] pointer-events-none" />

      <Container className="space-y-10 relative z-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="rounded bg-orange-100/70 border border-orange-200/50 px-3.5 py-1 text-xs font-bold text-orange-600 uppercase tracking-wider">
            Enterprise Integrity &amp; Outcomes
          </span>
          <h2 className="font-display text-3xl font-bold sm:text-4xl text-[#0b172a] tracking-tight">
            Journey Par Excellence
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            EpitomeTRC operates on rigorous service level commitments. We support professional placement pipelines, institutional upskilling, and agile developer staffing.
          </p>
        </div>

        {/* Dynamic Trust Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          <div className="bg-white border border-[#e8dcd0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h4 className="font-display font-bold text-[#0b172a] text-sm">7,000+ Careers Upskilled</h4>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed font-sans">
              Since inception, we have facilitated virtual internships, training bootcamps, and core skill assessments for over 7,000 graduates across India.
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="h-3 w-3" /> Track Record Verified
            </div>
          </div>

          <div className="bg-white border border-[#e8dcd0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <Building2 className="h-5 w-5" />
              </div>
              <h4 className="font-display font-bold text-[#0b172a] text-sm">340+ Corporate Partners</h4>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed font-sans">
              Servicing global enterprises and tech startups. We handle contract staffing, payroll models, executive search, and technology consulting plans.
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="h-3 w-3" /> Active SLA Structures
            </div>
          </div>

          <div className="bg-white border border-[#e8dcd0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="font-display font-bold text-[#0b172a] text-sm">ISO 9001:2015 Quality</h4>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed font-sans">
              Operating out of Indore, MP (Swadesh Bhawan LIG complex). ISO quality certified processes governing our training systems and recruitment modules.
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="h-3 w-3" /> Process Certified
            </div>
          </div>

        </div>

        {/* Action Call */}
        <div className="text-center pt-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0b172a] hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm"
          >
            Connect with our Placement &amp; Consulting Team <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
