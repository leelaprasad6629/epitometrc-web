import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import { Metadata, Viewport } from "next";
import { generateSEOMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Terms and Conditions",
  description: "Official Terms and Conditions and platform usage policies of EpitomeTRC.",
  keywords: ["Terms and Conditions", "Terms of Service", "EpitomeTRC Policies", "User Agreement"],
  path: "/terms",
});

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function TermsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Terms & Conditions", item: "/terms" },
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
            <h1 className="font-display text-3xl font-extrabold text-[#0b172a] sm:text-4xl">TERMS AND CONDITIONS</h1>
            <p className="text-orange-500 font-bold text-sm">EPITOME TRC</p>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Epitome Training &amp; Recruitment Consultants</p>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Last updated: August 2026</p>
          </div>
          
          <div className="text-slate-600 text-sm leading-relaxed space-y-6">
            <p>
              Welcome to the EpitomeTRC website, <a href="https://www.epitometrc.com" className="text-orange-500 hover:underline">www.epitometrc.com</a> (&ldquo;Website&rdquo;), owned and operated by Epitome Training &amp; Recruitment Consultants (&ldquo;EpitomeTRC&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), a sole proprietorship based in Indore, Madhya Pradesh, India. These Terms and Conditions (&ldquo;Terms&rdquo;) govern your access to and use of the Website and all recruitment, training, and consulting services offered by us (collectively, the &ldquo;Services&rdquo;).
            </p>
            <p>
              By accessing the Website, registering for any Service, enrolling in any course or training program, or submitting any enquiry or payment to EpitomeTRC, you (&ldquo;User&rdquo;, &ldquo;you&rdquo;, or &ldquo;your&rdquo;) confirm that you have read, understood, and agree to be bound by these Terms, our Privacy Policy, and any other policies referenced herein. If you do not agree with these Terms, you must not use the Website or avail of any Service.
            </p>

            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-4 border-t border-slate-100">1. Definitions</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>&ldquo;Employer&rdquo; or &ldquo;Recruiter&rdquo;</strong> means an individual or organization that registers with EpitomeTRC to access recruitment or hiring solutions.</li>
              <li><strong>&ldquo;Candidate&rdquo;</strong> means an individual applying to job opportunities, internships, or training/coaching programs through the Website.</li>
              <li><strong>&ldquo;Client&rdquo;</strong> means any User who purchases, subscribes to, or registers for a paid Service, including Training &amp; Development, Consulting Services, or Recruitment Solutions.</li>
              <li><strong>&ldquo;Services&rdquo;</strong> means Recruitment Solutions, Training and Development programs, Coaching and Mentorship, Internships, Consulting Services, and any other offering made available by EpitomeTRC through the Website.</li>
              <li><strong>&ldquo;Content&rdquo;</strong> means any data, text, documents, resumes, graphics, or material submitted, posted, or shared by a User on or through the Website.</li>
            </ul>

            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-4 border-t border-slate-100">2. Acceptance of Terms &amp; Mandatory Agreement</h2>
            <p>
              Use of the Website and any Service is conditional on your express acceptance of these Terms. Wherever a registration form, enquiry form, enrolment form, or payment/checkout process is provided on the Website, you will be required to actively tick the &ldquo;I have read and agree to the Terms and Conditions&rdquo; checkbox before you can submit the form or proceed with any Service.
            </p>
            <p>
              The checkbox will not be pre-selected by default, and the submit/proceed/pay button will remain inactive until the checkbox is selected. Submission of any form without accepting the checkbox is not permitted, and EpitomeTRC will not process, register, or deliver any Service where this acceptance has not been recorded.
            </p>
            <p>
              We may amend these Terms from time to time. Continued use of the Website or Services after any amendment constitutes your acceptance of the revised Terms. You are encouraged to review this page periodically.
            </p>

            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-4 border-t border-slate-100">3. Registration</h2>
            <h3 className="font-display text-md font-bold text-[#0b172a] pt-2">3.1 Employers / Clients</h3>
            <p>
              Employers and organizations seeking recruitment, HR consulting, or technical interview support may register by agreeing to the terms and conditions presented at the time of selecting a service plan. Once a plan is chosen through the Website, an EpitomeTRC representative will contact you to confirm the specific scope, pricing, and terms applicable to your engagement.
            </p>
            <h3 className="font-display text-md font-bold text-[#0b172a] pt-2">3.2 Candidates / Job Seekers</h3>
            <p>
              Individuals seeking job opportunities, internships, or training may register as a Candidate. Registration requires acceptance of these Terms and any additional terms presented during the registration process. On successful registration, an account will be created, accessible through your registered username and password.
            </p>
            <h3 className="font-display text-md font-bold text-[#0b172a] pt-2">3.3 Account Responsibility</h3>
            <p>
              You are solely responsible for all activity on your account and for maintaining the confidentiality of your login credentials. You must notify EpitomeTRC immediately of any unauthorized use of your account. EpitomeTRC is not liable for any loss arising from your failure to safeguard your credentials.
            </p>

            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-4 border-t border-slate-100">4. Services Offered</h2>
            <p>
              EpitomeTRC provides Recruitment Services, Training &amp; Development programs (including but not limited to Microsoft Azure Training, Digital Marketing, Data Engineering, SEO, and Coaching &amp; Mentorship), Consulting Services, and Internship placements. The specific scope, deliverables, timelines, and fees for each Service will be communicated at the time of enrolment, registration, or engagement, and form part of these Terms by reference.
            </p>

            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-4 border-t border-slate-100">5. Fees and Payment</h2>
            <p>
              Fees for paid Services (training programs, courses, coaching, consulting engagements, and recruitment packages) are as displayed on the Website or as communicated by an EpitomeTRC representative at the time of enrolment. Prices are subject to change; any revision will apply only to subsequent purchases and will not affect a Service already paid for and confirmed.
            </p>
            <p>
              Full or part payment (as applicable to the Service) must be made through the payment methods specified by EpitomeTRC before access to the Service is provided. An invoice or payment confirmation will be shared upon successful payment.
            </p>

            <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 md:p-8 space-y-4">
              <h2 className="font-display text-lg font-extrabold text-red-600">6. NO REFUND &amp; NO RETURN POLICY</h2>
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
                For any concerns regarding a payment or Service, please contact our support team at <a href="mailto:careers@epitometrc.com" className="text-orange-500 hover:underline">careers@epitometrc.com</a> before proceeding with payment.
              </p>
            </div>

            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-4 border-t border-slate-100">7. User Content</h2>
            <p>
              Users may submit, post, or share resumes, data, text, or other material (&ldquo;Content&rdquo;) on the Website. You retain ownership of your Content but grant EpitomeTRC a non-exclusive, worldwide, royalty-free license to use, host, store, reproduce, and display such Content solely for the purpose of operating, providing, and improving the Services. You represent that you own or have the necessary rights to any Content you submit and that it does not infringe any third party rights or violate applicable law.
            </p>
            <p>
              EpitomeTRC does not guarantee the accuracy of Content submitted by Users and is not liable for any loss or damage arising from reliance on such Content. EpitomeTRC reserves the right to remove or refuse any Content that violates these Terms.
            </p>

            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-4 border-t border-slate-100">8. Code of Conduct</h2>
            <p>
              Users must not engage in any of the following while using the Website or Services: harassment, abuse, or threats against any person; posting unlawful, defamatory, obscene, or discriminatory content; impersonation or misrepresentation; unsolicited advertising or spam; transmission of viruses or harmful software; sharing account credentials with third parties; or any activity that violates applicable law. EpitomeTRC may suspend or terminate access for violation of this Code of Conduct.
            </p>

            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-4 border-t border-slate-100">9. Intellectual Property</h2>
            <p>
              All content on the Website — including text, graphics, logos, course material, and software — is the property of EpitomeTRC or its licensors and is protected under Indian copyright, trademark, and other applicable laws. No part of the Website or training material may be reproduced, distributed, or used for commercial purposes without prior written consent from EpitomeTRC.
            </p>

            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-4 border-t border-slate-100">10. Third-Party Links</h2>
            <p>
              The Website may contain links to third-party websites or services provided for convenience only. EpitomeTRC does not endorse and is not responsible for the content, accuracy, or practices of any linked third-party site. Access to such sites is at your own risk.
            </p>

            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-4 border-t border-slate-100">11. Communication Consent</h2>
            <p>
              By registering with EpitomeTRC, you consent to being contacted by our team via call, SMS, WhatsApp, or email regarding your registration, application, or Services availed, even if your mobile number is registered under the National Do Not Call (NDNC) registry, to the extent permitted by law.
            </p>

            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-4 border-t border-slate-100">12. Limitation of Liability</h2>
            <p>
              EpitomeTRC provides Services on a reasonable-efforts basis and does not guarantee specific outcomes such as job placement, interview success, or business results from consulting engagements. To the maximum extent permitted by law, EpitomeTRC shall not be liable for any indirect, incidental, or consequential loss arising from the use of, or inability to use, the Website or Services.
            </p>

            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-4 border-t border-slate-100">13. Indemnification</h2>
            <p>
              You agree to indemnify and hold EpitomeTRC, its affiliates, officers, and employees harmless from any claims, damages, or liabilities arising from your use of the Website, your Content, or your violation of these Terms.
            </p>

            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-4 border-t border-slate-100">14. Termination</h2>
            <p>
              EpitomeTRC reserves the right to suspend or terminate your account or access to any Service if you violate these Terms, without any obligation to refund fees already paid, in line with the No Refund Policy set out in Section 6 above. You may terminate your account at any time by writing to <a href="mailto:careers@epitometrc.com" className="text-orange-500 hover:underline">careers@epitometrc.com</a>; any fees already paid remain non-refundable in accordance with Section 6.
            </p>

            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-4 border-t border-slate-100">15. Governing Law &amp; Jurisdiction</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms or the Services shall be subject to the exclusive jurisdiction of the courts at Indore, Madhya Pradesh, India.
            </p>

            <h2 className="font-display text-lg font-bold text-[#0b172a] pt-4 border-t border-slate-100">16. Contact Us</h2>
            <p>
              For any questions regarding these Terms and Conditions, the No Refund &amp; No Return Policy, or our Services, please contact us at:
            </p>
            <ul className="list-none space-y-1.5 pl-0 pt-2 font-sans font-semibold">
              <li>• Email: <a href="mailto:careers@epitometrc.com" className="text-orange-500 hover:underline">careers@epitometrc.com</a></li>
              <li>• Phone: +91-626-596-6705</li>
              <li>• Location: PAN India (Registered office: Indore, Madhya Pradesh)</li>
            </ul>

            <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
              <p>&copy; 2026 EpitomeTRC. All Rights Reserved. This document supersedes any earlier version of the Terms and Conditions published on www.epitometrc.com.</p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
