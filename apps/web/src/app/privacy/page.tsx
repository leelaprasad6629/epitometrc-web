import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";

export const metadata: Metadata = {
  title: "Privacy Policy | Epitome TRC",
  description: "Official privacy policy and data governance practices at EpitomeTRC.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 font-sans bg-slate-50/50">
        <Container className="max-w-3xl bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm space-y-6">
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <h1 className="font-display text-3xl font-extrabold text-[#0b172a]">Privacy Policy</h1>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Last updated: July 24, 2026</p>
          </div>
          <div className="text-slate-600 text-sm leading-relaxed space-y-4">
            <p>
              At EpitomeTRC, we value your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, process, and safeguard your information when you use our recruitment, training, and strategic consulting platforms.
            </p>
            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-2">1. Information We Collect</h2>
            <p>
              We collect information that you directly provide to us, including your name, email address, telephone number, qualifications, and resume details when you sign up or upload resumes to the AI Career Suite.
            </p>
            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-2">2. How We Use Your Data</h2>
            <p>
              Your data is utilized to deliver customized strategic recommendations, coordinate learning path workflows, manage student recruitment pipelines, and process AI-driven interview feedback.
            </p>
            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-2">3. Data Security & Retention</h2>
            <p>
              We implement industry-standard encryption protocols and secure database setups to protect your personal details against unauthorized access.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
