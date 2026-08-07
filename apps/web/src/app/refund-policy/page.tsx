import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import { Metadata, Viewport } from "next";
import { generateSEOMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Refund and Cancellation Policy",
  description: "Official Refund and Cancellation Policy of EpitomeTRC.",
  keywords: ["Refund Policy", "Cancellation Policy", "Refunds and Returns", "EpitomeTRC Policy"],
  path: "/refund-policy",
});

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function RefundPolicyPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Refund & Cancellation Policy", item: "/refund-policy" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />
      <main id="main-content" className="pt-24 pb-16 font-sans bg-slate-50/50">
        <Container className="max-w-4xl bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm space-y-8">
          <div className="space-y-3 border-b border-slate-100 pb-6 text-center sm:text-left">
            <h1 className="font-display text-3xl font-extrabold text-red-600 sm:text-4xl">REFUND &amp; CANCELLATION POLICY</h1>
            <p className="text-orange-500 font-bold text-sm">EPITOME TRC</p>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Epitome Training &amp; Recruitment Consultants</p>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Last updated: August 2026</p>
          </div>

          <div className="text-slate-600 text-sm leading-relaxed space-y-6">
            <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 md:p-8 space-y-4">
              <h2 className="font-display text-lg font-extrabold text-red-600">NO REFUND &amp; NO RETURN POLICY</h2>
              <p className="text-red-700 font-extrabold text-xs tracking-wider uppercase">PLEASE READ CAREFULLY BEFORE MAKING ANY PAYMENT.</p>
              <p className="text-slate-700 text-sm">
                All Services offered by EpitomeTRC — including but not limited to Recruitment Solutions, Training &amp; Development programs, Coaching &amp; Mentorship, Consulting Services, courses, workshops, and Internship placements — are strictly <strong>NON-REFUNDABLE</strong> and <strong>NON-RETURNABLE</strong> once payment has been made and the Service, course access, session, or engagement has commenced or been confirmed.
              </p>
              <p className="text-slate-700 text-sm font-semibold">Specifically:</p>
              <ul className="list-disc pl-5 text-slate-700 text-sm space-y-2.5">
                <li><strong>No Refunds:</strong> EpitomeTRC does not offer monetary refunds, whether in full or in part, for any purchased plan, package, training program, course, coaching session, consulting engagement, or recruitment service, regardless of the reason, including but not limited to change of mind, non-attendance, dissatisfaction with outcomes, or early withdrawal.</li>
                <li><strong>No Returns / Exchanges:</strong> As our Services are intangible, time-bound, and delivered on a service basis (not physical goods), no &ldquo;return&rdquo; or &ldquo;exchange&rdquo; of a Service is possible once it has been availed, scheduled, delivered, or accessed.</li>
                <li><strong>No Cancellations for Consideration:</strong> Once a payment is confirmed and a slot, batch, session, or engagement is allocated, the User cannot cancel the Service for monetary consideration or credit.</li>
                <li><strong>Service Rescheduling (at EpitomeTRC&apos;s discretion only):</strong> In exceptional circumstances (such as a program being cancelled by EpitomeTRC itself), EpitomeTRC may, at its sole discretion, offer a one-time rescheduling to an alternate batch or date. This is offered as a goodwill gesture only and does not constitute a right to a refund or return, and is not guaranteed.</li>
              </ul>
              <p className="text-slate-700 text-sm pt-2">
                By making any payment to EpitomeTRC or ticking the mandatory Terms and Conditions checkbox before submitting a form, you expressly acknowledge and accept this No Refund and No Return Policy. It is strongly recommended that you review the Service details, scope, and pricing carefully and clarify any doubts with our team before making payment, as no reversal will be possible thereafter.
              </p>
              <p className="text-slate-700 text-sm">
                For any concerns regarding a payment or Service, please contact our support team at <a href="mailto:support@epitometrc.com" className="text-orange-500 hover:underline">support@epitometrc.com</a> or <a href="mailto:info@epitometrc.com" className="text-orange-500 hover:underline">info@epitometrc.com</a> before proceeding with payment.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
              <p>&copy; 2026 EpitomeTRC. All Rights Reserved. Indore, Madhya Pradesh, India.</p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
