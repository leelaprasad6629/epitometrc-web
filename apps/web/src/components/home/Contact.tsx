"use client";

import { FaFacebook, FaInstagram, FaLinkedin, FaTelegram, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { FaThreads, FaXTwitter } from "react-icons/fa6";
import { useState, FormEvent } from "react";
import { Mail, Send, CheckCircle2, Phone, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          subject: formState.company 
            ? `Homepage Inquiry - ${formState.company}` 
            : "Homepage Inquiry (General)",
          message: formState.message,
        }),
      });
      if (res.ok) {
        setIsSubmitted(true);
        setFormState({ name: "", email: "", company: "", message: "" });
      } else {
        const d = await res.json();
        setErrorMsg(d.error || "Failed to submit enquiry.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-white relative overflow-hidden font-sans">
      {/* Background blobs */}
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Info Side (Takes 5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-orange-500 font-semibold text-xs uppercase tracking-wider block mb-2 font-sans">
                GET IN TOUCH
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0b172a] tracking-tight leading-tight">
                Let&apos;s Build Your <br />
                <span className="text-orange-500">Next Strategic Advantage</span>
              </h2>
              <p className="text-slate-600 mt-4 font-sans leading-relaxed text-sm sm:text-base">
                Have questions about our technology solutions or executive advisory packages? Drop us a line. Our consultation leads typically reply within 2 hours.
              </p>
            </div>

            {/* Info List */}
            <div className="mt-10 lg:mt-0 space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-orange-50 rounded-xl text-orange-500 shadow-sm flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-800 text-sm tracking-wider uppercase">HQ Office</h4>
                  <a 
                    href="https://maps.google.com/?q=Epitome+Training+%26+Recruitment+Consultants,+Indore" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-[#0b172a] text-sm mt-1 block transition-colors font-sans"
                  >
                    Headquartered in Indore, Madhya Pradesh | Serving PAN India
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-500 shadow-sm flex-shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-800 text-sm tracking-wider uppercase">Direct Email</h4>
                  <a href="mailto:careers@epitometrc.com" className="text-slate-500 hover:text-[#0b172a] text-sm mt-1 block">
                    careers@epitometrc.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-500 shadow-sm flex-shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-800 text-sm tracking-wider uppercase">Direct Phone</h4>
                  <a href="tel:+916265966705" className="text-slate-500 hover:text-[#0b172a] text-sm mt-1 block">
                    +91-626-596-6705
                  </a>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-3">
                <h4 className="font-display font-bold text-slate-800 text-xs tracking-wider uppercase">Connect With Us</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { Icon: FaLinkedin, href: "https://www.linkedin.com/in/epitometrc", label: "LinkedIn" },
                    { Icon: FaFacebook, href: "https://www.facebook.com/epitometrc", label: "Facebook" },
                    { Icon: FaInstagram, href: "https://www.instagram.com/epitometrc007/", label: "Instagram" },
                    { Icon: FaTelegram, href: "https://t.me/epitometrc", label: "Telegram" },
                    { Icon: FaYoutube, href: "https://youtube.com/@epitometrc", label: "YouTube" },
                    { Icon: FaWhatsapp, href: "https://wa.me/916265966705", label: "WhatsApp" },
                    { Icon: FaThreads, href: "https://threads.net/@epitometrc007", label: "Threads" },
                    { Icon: FaXTwitter, href: "https://x.com/epitometrc", label: "X" }
                  ].map(({ Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition-all hover:border-orange-500 hover:bg-orange-500 hover:text-white hover:scale-105"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Wrapper (Takes 7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#f8fafd] border border-slate-100 p-8 rounded-2xl shadow-sm relative">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 font-sans">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          placeholder="Daniel Rose"
                          className="w-full px-4 py-3 bg-white border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all text-sm font-sans shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 font-sans">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          placeholder="daniel@nexa.com"
                          className="w-full px-4 py-3 bg-white border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all text-sm font-sans shadow-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 font-sans">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        value={formState.company}
                        onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                        placeholder="Nexa Industries"
                        className="w-full px-4 py-3 bg-white border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all text-sm font-sans shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 font-sans">
                        How can we help? *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        placeholder="Tell us about your strategic aims, technology requirements, or recruitment needs..."
                        className="w-full px-4 py-3 bg-white border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all text-sm font-sans shadow-sm"
                      />
                    </div>

                    {errorMsg && (
                      <div className="text-red-500 text-xs font-bold bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                        {errorMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full inline-flex items-center justify-center px-6 py-4 text-base font-bold text-white bg-orange-500 rounded-xl shadow-lg shadow-orange-500/10 hover:bg-orange-600 transition-colors duration-200 focus:outline-none disabled:opacity-50"
                    >
                      {isLoading ? (
                        <span className="flex items-center space-x-2">
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          <span>Submitting proposal...</span>
                        </span>
                      ) : (
                        <span className="flex items-center">
                          Send Message Proposal
                          <Send className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="contact-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12 flex flex-col items-center justify-center space-y-4"
                  >
                    <div className="p-4 bg-orange-50 rounded-full text-orange-500 shadow-sm animate-bounce">
                      <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <h3 className="font-display font-bold text-2xl text-[#0b172a]">
                      Proposal Sent Successfully!
                    </h3>
                    <p className="text-slate-500 text-sm font-sans max-w-sm leading-relaxed">
                      Thank you for connecting with EpitomeTRC. One of our lead consulting partners has been notified and will contact you shortly.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="mt-6 px-6 py-2.5 bg-[#0b172a] text-white hover:bg-slate-800 text-sm font-bold rounded-xl transition-all shadow-sm"
                    >
                      Send another message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}