import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import { Metadata, Viewport } from "next";
import { generateSEOMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Privacy Policy",
  description: "Official Privacy Policy of EpitomeTRC outlining data governance, candidate information safety, and compliance details.",
  keywords: ["Privacy Policy", "Data Governance", "Candidate Security", "EpitomeTRC Privacy Rules"],
  path: "/privacy",
});

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function PrivacyPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Privacy Policy", item: "/privacy" },
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
            <h1 className="font-display text-3xl font-extrabold text-[#0b172a] sm:text-4xl">PRIVACY POLICY</h1>
            <p className="text-orange-500 font-bold text-sm">EPITOME TRC</p>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Epitome Training &amp; Recruitment Consultants</p>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Last updated: August 2026</p>
          </div>

          <div className="text-slate-600 text-sm leading-relaxed space-y-6">
            <p>
              At EpitomeTRC, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, process, share, and safeguard your personal information when you access our website <a href="https://www.epitometrc.com" className="text-orange-500 hover:underline">www.epitometrc.com</a> (&ldquo;Website&rdquo;) and avail of our recruitment, training, and strategic consulting services (&ldquo;Services&rdquo;).
            </p>
            <p>
              By accessing the Website, creating an account, or registering for any of our services, you consent to the collection and processing of your personal data as outlined in this Privacy Policy.
            </p>

            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-4 border-t border-slate-100">1. Information We Collect</h2>
            <p>We collect personal information directly from you when you register on our Website, upload files, or fill in enquiry forms. This includes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Identity Details:</strong> Full name, username, and account passwords.</li>
              <li><strong>Contact Information:</strong> Email address, mobile telephone number, and physical location coordinates.</li>
              <li><strong>Candidate Profiles:</strong> Resume files, video summaries, educational qualifications, projects, work experience, and skillset details.</li>
              <li><strong>Communication Consent Data:</strong> Explicit agreements to be contacted via call, SMS, WhatsApp, or email.</li>
            </ul>

            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-4 border-t border-slate-100">2. How We Use Your Data</h2>
            <p>EpitomeTRC utilizes the gathered data to deliver professional recruitment and training services, including:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Setting up and securing your Candidate or Employer account.</li>
              <li>Processing resumes through our AI parser engine to calculate ATS compatibility scores.</li>
              <li>Recommending optimized courses, learning paths, and mock interview slots.</li>
              <li>Matching candidate profiles to active job openings listed by our recruitment partners.</li>
              <li>Communicating system notifications, schedules, and program updates.</li>
            </ul>

            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-4 border-t border-slate-100">3. Data Sharing and Disclosures</h2>
            <p>
              We do not sell or rent your personal details to third parties. We share your information solely with certified hiring partners, employers, and system coordinators to enable placement matching. By uploading your resume or applying to listed job openings, you authorize us to share your candidate credentials with designated recruiters.
            </p>

            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-4 border-t border-slate-100">4. Security and Storage</h2>
            <p>
              EpitomeTRC implements industry-standard technical measures, secure database models, and SSL encryption protocols to protect your personal details against unauthorized access, loss, or alteration. While we employ rigorous security methods, no system is entirely invulnerable; therefore, you are responsible for maintaining the absolute secrecy of your login passwords.
            </p>

            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-4 border-t border-slate-100">5. Communications and NDNC Compliance</h2>
            <p>
              By registering an account with EpitomeTRC, you consent to being contacted by our operations team via voice call, text SMS, WhatsApp messaging, or email regarding your registration status, internship tracks, and candidate submissions, even if your phone number is registered on the National Do Not Call (NDNC) registry.
            </p>

            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-4 border-t border-slate-100">6. Data Retention Period</h2>
            <p>
              We retain your personal data (such as profile details, logs, resume history, and course progress) for as long as your account remains active or as needed to provide you with the Services. If your account shows no activity for three (3) consecutive years, we will securely archive or permanently anonymize your data unless we are legally required to retain it for compliance, audit, or tax obligations.
            </p>

            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-4 border-t border-slate-100">7. Deletion and Access Requests</h2>
            <p>
              You have the right to access, update, correct, or request the permanent erasure of your personal data stored on our servers at any time. You can submit a deletion request or request a copy of your records by writing to our compliance support team at <a href="mailto:info@epitometrc.com" className="text-orange-500 hover:underline">info@epitometrc.com</a> or <a href="mailto:support@epitometrc.com" className="text-orange-500 hover:underline">support@epitometrc.com</a>. Upon verification of your identity, we will process and confirm your request within thirty (30) business days.
            </p>

            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-4 border-t border-slate-100">8. Governing Law &amp; Contact Information</h2>
            <p>
              This Privacy Policy is governed by and construed in accordance with the laws of India. Any concerns or disputes regarding data protection and policy compliance shall be handled exclusively by courts in Indore, Madhya Pradesh, India.
            </p>
            <p>For any questions or clarification regarding this policy, please reach out to us at:</p>
            <ul className="list-none space-y-1.5 pl-0 pt-2 font-sans font-semibold">
              <li>• Email: <a href="mailto:info@epitometrc.com" className="text-orange-500 hover:underline">info@epitometrc.com</a> / <a href="mailto:careers@epitometrc.com" className="text-orange-500 hover:underline">careers@epitometrc.com</a></li>
              <li>• Phone: +91-626-596-6705</li>
              <li>• Registered Office Location: Indore, Madhya Pradesh, India</li>
            </ul>

            <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
              <p>&copy; 2026 EpitomeTRC. All Rights Reserved.</p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
