"use client";

import { motion } from "framer-motion";
import { Award, ShieldCheck, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";

export default function CertificationsPage() {
  const certs = [
    { id: 1, title: "Epitome Strategic Leader", details: "Validate leadership, agile PMO systems, and digital consulting practices." },
    { id: 2, title: "Epitome Cloud Solutions Specialist", details: "Validate cloud architecture, multi-cloud migration strategies, and production uptime parameters." },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-20 font-sans bg-slate-50/50 min-h-screen">
        <section className="py-16">
          <Container className="space-y-8">
            <div className="text-center space-y-2">
              <span className="rounded bg-orange-50 px-3 py-1 text-xs font-bold text-orange-500 uppercase tracking-wider">
                Verification
              </span>
              <h1 className="font-display text-3xl font-bold text-[#0b172a] sm:text-4xl">
                Professional Certifications
              </h1>
              <p className="text-slate-500 text-sm max-w-lg mx-auto">
                Validate your expertise with cryptographically secured certifications recognized by global enterprise partners.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-6">
              {certs.map((c) => (
                <div key={c.id} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between space-y-6">
                  <div className="flex gap-4 items-start">
                    <span className="p-3 rounded-xl bg-orange-50 text-orange-500 border border-orange-100 shrink-0">
                      <Award className="h-6 w-6" />
                    </span>
                    <div className="space-y-1.5">
                      <h3 className="font-display text-base font-bold text-[#0b172a] leading-snug">
                        {c.title}
                      </h3>
                      <p className="text-slate-500 text-xs font-sans leading-relaxed">
                        {c.details}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 flex items-center gap-3 border border-slate-100">
                    <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-500 font-sans leading-normal">
                      Secured via EpitomeTRC Verification Registry with ISO alignment.
                    </span>
                  </div>

                  <Button href="/register" variant="primary" size="sm" className="h-10 rounded-xl text-xs font-bold w-full">
                    Register for Certification exam
                  </Button>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
