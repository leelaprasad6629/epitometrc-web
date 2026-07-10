"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, ShieldCheck } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";
import Container from "@/components/common/Container";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Support");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <Navbar />
      <main className="pt-20 font-sans bg-slate-50/50 min-h-screen">
        <section className="py-16">
          <Container className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Info Column */}
            <div className="space-y-8">
              <div className="space-y-3">
                <span className="rounded bg-orange-50 px-3 py-1 text-xs font-bold text-orange-500 uppercase tracking-wider">
                  Contact Us
                </span>
                <h1 className="font-display text-3xl font-bold text-[#0b172a] sm:text-4xl">
                  Connect with Our Advisors
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed max-w-md">
                  Discuss corporate partnerships, staffing needs, or training enrollments with our global team.
                </p>
              </div>

              <div className="space-y-4 text-xs font-semibold text-slate-600 font-sans">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-xl bg-orange-50 text-orange-500 shrink-0">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <span>123 Business Park, Hyderabad, India</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-xl bg-orange-50 text-orange-500 shrink-0">
                    <Mail className="h-5 w-5" />
                  </span>
                  <span>info@epitometrc.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-xl bg-orange-50 text-orange-500 shrink-0">
                    <Phone className="h-5 w-5" />
                  </span>
                  <span>+91 98765 43210</span>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              {sent ? (
                <div className="text-center py-10 space-y-4 max-w-sm mx-auto">
                  <ShieldCheck className="mx-auto h-12 w-12 text-emerald-500" />
                  <div className="space-y-1">
                    <h3 className="font-display text-base font-bold text-[#0b172a]">Message Sent Successfully</h3>
                    <p className="text-slate-500 text-xs font-sans">
                      Our strategy coordinators will review your enquiry and get back to you within 24 hours.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                      Name
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-10 rounded-xl border-slate-200 w-full"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10 rounded-xl border-slate-200 w-full"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                      Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-orange-500 w-full"
                    >
                      <option>General Support</option>
                      <option>Business Consulting</option>
                      <option>Recruitment & Staffing</option>
                      <option>Training & Academics</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                      Message
                    </label>
                    <textarea
                      required
                      placeholder="Describe your inquiry..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-3.5 text-xs text-slate-600 font-sans leading-relaxed focus:border-orange-500 outline-none h-32 resize-none"
                    />
                  </div>

                  <Button type="submit" variant="primary" className="w-full h-11 rounded-xl font-bold shadow-md shadow-orange-500/10">
                    Send Message <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
