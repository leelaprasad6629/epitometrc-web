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
                <Button
                  onClick={() => {
                    const printWindow = window.open("", "_blank");
                    if (!printWindow) return;
                    printWindow.document.write(`
                      <html>
                        <head>
                          <title>EpitomeTRC Certificate - ${cert.id}</title>
                          <style>
                            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Montserrat:wght@400;600&display=swap');
                            body {
                              margin: 0;
                              padding: 0;
                              display: flex;
                              justify-content: center;
                              align-items: center;
                              height: 100vh;
                              background-color: #f8fafc;
                              font-family: 'Montserrat', sans-serif;
                            }
                            .certificate-container {
                              width: 800px;
                              height: 560px;
                              padding: 40px;
                              border: 20px solid #0b172a;
                              background-color: #ffffff;
                              position: relative;
                              text-align: center;
                              box-sizing: border-box;
                              box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                            }
                            .inner-border {
                              border: 4px solid #f97316;
                              height: 100%;
                              width: 100%;
                              box-sizing: border-box;
                              padding: 30px;
                              display: flex;
                              flex-col: column;
                              flex-direction: column;
                              justify-content: space-between;
                            }
                            .header {
                              font-family: 'Cinzel', serif;
                              font-size: 32px;
                              color: #0b172a;
                              font-weight: 700;
                              margin: 0;
                            }
                            .subtitle {
                              font-size: 14px;
                              color: #f97316;
                              text-transform: uppercase;
                              letter-spacing: 4px;
                              font-weight: 600;
                              margin-top: 5px;
                            }
                            .certify {
                              font-size: 14px;
                              color: #64748b;
                              font-style: italic;
                              margin-top: 20px;
                            }
                            .name {
                              font-family: 'Cinzel', serif;
                              font-size: 28px;
                              color: #0b172a;
                              font-weight: 700;
                              border-bottom: 2px solid #cbd5e1;
                              width: 60%;
                              margin: 15px auto;
                              padding-bottom: 5px;
                            }
                            .details {
                              font-size: 13px;
                              color: #475569;
                              max-width: 500px;
                              margin: 10px auto;
                              line-height: 1.6;
                            }
                            .course-title {
                              font-weight: 600;
                              color: #0b172a;
                            }
                            .footer-section {
                              display: flex;
                              justify-content: space-between;
                              align-items: flex-end;
                              margin-top: 30px;
                            }
                            .signature-box {
                              width: 180px;
                              text-align: center;
                            }
                            .signature-line {
                              border-top: 1.5px solid #94a3b8;
                              margin-top: 5px;
                              padding-top: 5px;
                              font-size: 11px;
                              color: #64748b;
                              font-weight: 600;
                            }
                            .seal {
                              font-weight: bold;
                              color: #f97316;
                              font-size: 18px;
                            }
                            .verify-id {
                              position: absolute;
                              bottom: 15px;
                              right: 20px;
                              font-size: 9px;
                              color: #94a3b8;
                            }
                            @media print {
                              body { background: white; }
                              .certificate-container { box-shadow: none; border-color: #0b172a !important; -webkit-print-color-adjust: exact; }
                            }
                          </style>
                        </head>
                        <body>
                          <div class="certificate-container">
                            <div class="inner-border">
                              <div>
                                <div class="header">Certificate of Completion</div>
                                <div class="subtitle">Epitome TRC Academy</div>
                              </div>
                              
                              <div class="certify">This credential is proudly presented to</div>
                              <div class="name">Alex Thompson</div>
                              
                              <div class="details">
                                for successfully fulfilling all curriculum requirements and completing the professional course
                                <br/>
                                <span class="course-title">"${cert.title}"</span>
                              </div>
                              
                              <div class="footer-section">
                                <div class="signature-box">
                                  <div style="font-family: 'Cinzel', serif; font-size: 14px; font-style: italic; color: #0b172a;">Jennings</div>
                                  <div class="signature-line">Sarah Jennings, Director</div>
                                </div>
                                <div class="seal">
                                  ★ APPROVED ★
                                </div>
                                <div class="signature-box">
                                  <div style="font-size: 11px; color: #64748b; font-weight: 600;">Date: ${cert.issuedDate}</div>
                                  <div class="signature-line">EpitomeTRC Verification Registry</div>
                                </div>
                              </div>
                            </div>
                            <div class="verify-id">Verification ID: ${cert.id}</div>
                          </div>
                          <script>
                            window.onload = function() {
                              window.print();
                              window.onafterprint = function() {
                                window.close();
                              }
                            }
                          </script>
                        </body>
                      </html>
                    `);
                    printWindow.document.close();
                  }}
                  variant="primary"
                  size="sm"
                  className="h-9 rounded-xl text-xs font-bold px-4 flex-1"
                >
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
