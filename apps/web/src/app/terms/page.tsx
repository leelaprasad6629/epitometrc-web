import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";

export const metadata: Metadata = {
  title: "Terms of Service | Epitome TRC",
  description: "Terms and conditions governing the use of the EpitomeTRC platform.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 font-sans bg-slate-50/50">
        <Container className="max-w-3xl bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm space-y-6">
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <h1 className="font-display text-3xl font-extrabold text-[#0b172a]">Terms of Service</h1>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Last updated: July 24, 2026</p>
          </div>
          <div className="text-slate-600 text-sm leading-relaxed space-y-4">
            <p>
              Welcome to EpitomeTRC. By accessing our website and utilizing our recruitment dashboards, strategic consulting tools, and learning tracks, you agree to comply with the following terms and conditions.
            </p>
            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-2">1. Use of Platform</h2>
            <p>
              Users are responsible for maintaining the confidentiality of their credentials and registered accounts. Any activity performed under your account is your sole responsibility.
            </p>
            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-2">2. Intellectual Property</h2>
            <p>
              All materials, graphics, branding, training content, and custom AI tools rendered on the platform are the exclusive property of EpitomeTRC.
            </p>
            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-2">3. Limitation of Liability</h2>
            <p>
              EpitomeTRC provides services "as is" and is not liable for operational disruptions or indirect losses arising from platform usage.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
