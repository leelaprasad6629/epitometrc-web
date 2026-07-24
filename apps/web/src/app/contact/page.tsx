"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ShieldCheck,
  Sparkles,
  MessageSquare,
  Clock,
  Globe,
  Briefcase,
  Calendar,
  Award,
  CheckCircle,
  Paperclip,
  Users,
  Building,
  Check,
  ChevronDown
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";
import Container from "@/components/common/Container";
import Link from "next/link";

type SubjectType = "General Support" | "Business Consulting" | "Recruitment & Staffing" | "Training & Academics";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<SubjectType>("General Support");
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-mesh-gradient font-sans pt-28 pb-16 relative overflow-hidden">
        {/* Floating blurred circles */}
        <div className="absolute top-1/4 left-10 w-80 h-80 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-violet-400/10 rounded-full blur-[100px] pointer-events-none" />

        <section className="relative z-10">
          <Container className="max-w-6xl mx-auto space-y-16 px-4">
            
            {/* Header Section */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="rounded-full bg-blue-50 border border-blue-100 px-3.5 py-1 text-[10px] font-bold text-blue-600 uppercase tracking-widest inline-flex items-center gap-1.5 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-pulse" /> Contact & Consultation Hub
              </span>
              <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
                Let's Build Something <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-orange-500 bg-clip-text text-transparent">Extraordinary.</span>
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                Whether you are seeking custom corporate bootcamps, executive staffing pipelines, or AI business automation workflow setups—our strategic consulting team is here to coordinate.
              </p>
            </div>

            {/* Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Left Column: Graphics & Info */}
              <div className="lg:col-span-5 space-y-8">
                
                {/* Visual Graphics Card */}
                <div className="bg-[#0b172a] rounded-3xl border border-white/10 p-6 shadow-2xl relative overflow-hidden text-white space-y-4">
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600/20 rounded-full blur-[60px]" />
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-[60px]" />
                  
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/10">
                    <Sparkles className="h-5 w-5 text-orange-500 animate-pulse" />
                  </div>
                  
                  <div className="space-y-1 relative z-10">
                    <h3 className="font-display text-base font-bold">Premium Enterprise Support</h3>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                      Experience high-velocity response times backed by automated client-relationship timeline trackers.
                    </p>
                  </div>

                  {/* Interactive Visual Network Preview */}
                  <div className="h-32 border border-white/5 rounded-2xl bg-white/5 flex items-center justify-center relative overflow-hidden">
                    <div className="flex gap-4 items-center justify-center">
                      <div className="h-10 w-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center animate-float">
                        <Users className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="h-[2px] w-12 bg-gradient-to-r from-blue-500 to-indigo-500" />
                      <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-orange-500 p-[1.5px] animate-pulse">
                        <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center font-bold text-[9.5px]">AI</div>
                      </div>
                      <div className="h-[2px] w-12 bg-gradient-to-r from-indigo-500 to-orange-500" />
                      <div className="h-10 w-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center animate-float [animation-delay:1.5s]">
                        <Building className="h-4 w-4 text-orange-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Assistant Contact Card */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-md hover-scale-card space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded text-[8px] font-black bg-violet-50 text-violet-600 border border-violet-100 uppercase tracking-widest">Instant Resolution</span>
                      <h4 className="font-display text-sm font-bold text-slate-900">Talk to AI Advisor</h4>
                      <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                        Need instant course advisory or training details? Our chatbot is ready.
                      </p>
                    </div>
                    <div className="h-9 w-9 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 border border-violet-100">
                      <MessageSquare className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAiModal(true)}
                    className="w-full h-10 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-indigo-600 hover:to-violet-600 text-white font-bold text-xs shadow-md shadow-indigo-500/10 flex items-center justify-center gap-1.5 transition-all duration-300"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> Launch AI Assistant
                  </button>
                </div>

                {/* Rich Information Panel */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-md space-y-5 text-xs font-semibold text-slate-600">
                  <h4 className="font-display text-sm font-bold text-slate-900 border-b border-slate-50 pb-2">Office Information</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                        <MapPin className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Office Address</p>
                        <p className="text-slate-800 text-[11.5px] font-bold">208, Swadesh Bhawan, Behind Press Complex, LIG Colony, Indore - 452001, MP, India</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="p-2.5 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 shrink-0">
                        <Mail className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Email Address</p>
                        <p className="text-slate-800 text-[11.5px] font-bold">info@epitometrc.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 shrink-0">
                        <Phone className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Contact Number</p>
                        <p className="text-slate-800 text-[11.5px] font-bold">+91-626-596-6705</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
                        <Clock className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Response Speed</p>
                        <p className="text-slate-800 text-[11.5px] font-bold">Average response within 24 hours</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Contact Form / Success State */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xl min-h-[420px] flex flex-col justify-center">
                {sent ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-left space-y-6 font-sans text-xs"
                  >
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                      <div className="h-10 w-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-md">
                        <Check className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-sm font-bold text-[#0b172a]">Request Received</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ref ID: EPT-2026-1048</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Next Steps Pipeline</p>
                      <div className="space-y-2.5 text-slate-600">
                        <div className="flex items-start gap-2.5">
                          <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="font-medium">AI system successfully categorized and routed your enquiry.</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="font-medium">Expert advisor assigned to review project attachments.</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="font-medium">Outbound email receipt confirmation sent.</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="font-medium">Expected response speed: <strong>Within 24 hours</strong>.</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => alert("Request EPT-2026-1048 is in queue: Assigned to B2B Strategy Coordinator.")}
                        className="flex-1 h-10 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold transition-all"
                      >
                        Track Request
                      </button>
                      <Link
                        href="/"
                        className="flex-1 h-10 rounded-xl bg-[#0b172a] hover:bg-orange-500 text-white font-bold transition-all flex items-center justify-center"
                      >
                        Return Home
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="font-display text-base font-bold text-slate-900 border-b border-slate-50 pb-2.5">
                      Submit Strategic Inquiry
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Your Name
                        </label>
                        <Input
                          type="text"
                          required
                          placeholder="E.g. John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="h-10 rounded-xl border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          required
                          placeholder="name@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-10 rounded-xl border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Subject Area
                      </label>
                      <div className="relative">
                        <select
                          value={subject}
                          onChange={(e) => setSubject(e.target.value as SubjectType)}
                          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full appearance-none pr-8 font-semibold text-slate-600"
                        >
                          <option value="General Support">General Support</option>
                          <option value="Business Consulting">Business Consulting</option>
                          <option value="Recruitment & Staffing">Recruitment & Staffing</option>
                          <option value="Training & Academics">Training & Academics</option>
                        </select>
                        <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Detailed Message
                      </label>
                      <textarea
                        required
                        placeholder="Describe your inquiry or target objectives..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-3.5 text-xs text-slate-600 font-sans leading-relaxed focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none h-36 resize-none"
                      />
                    </div>

                    {/* File Attachment option */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Attachments (Optional)
                      </label>
                      <label className="flex items-center gap-2 border border-dashed border-slate-200 hover:border-slate-300 rounded-xl p-3.5 cursor-pointer bg-slate-50/50 hover:bg-slate-100/30 transition-colors text-xs font-semibold text-slate-500 justify-center">
                        <Paperclip className="h-4 w-4 text-slate-400" />
                        <span>{fileName || "Click to upload specifications / RFP"}</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={sending}
                      className="w-full h-11 rounded-xl font-bold shadow-md shadow-orange-500/10"
                    >
                      {sending ? "Sending Message..." : "Send Message"} <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                )}
              </div>

            </div>

            {/* Customer Journey Timeline */}
            <div className="space-y-6 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
              <div className="text-center space-y-1">
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Enquiry Process</p>
                <h3 className="font-display text-lg font-bold text-slate-900">Your Journey with EpitomeTRC</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-6 pt-4 text-center font-sans text-xs">
                {[
                  { title: "Submit Request", desc: "Fill RFP / consult form" },
                  { title: "AI Classifies", desc: "Automated routing" },
                  { title: "Team Assigned", desc: "Matched with coordinators" },
                  { title: "Expert Review", desc: "Evaluate deliverables" },
                  { title: "Meeting Booking", desc: "Configure bootcamps" },
                  { title: "Project Begins", desc: "Launch development" }
                ].map((step, idx) => (
                  <div key={idx} className="space-y-2 relative">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold mx-auto border border-blue-100 relative z-10 shadow-sm">
                      {idx + 1}
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800">{step.title}</p>
                      <p className="text-slate-400 text-[10px] font-semibold leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Partner Reviews</p>
                <h3 className="font-display text-lg font-bold text-slate-900">Trusted globally by leaders</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs leading-relaxed">
                {[
                  { quote: "EpitomeTRC's B2B suite halved our developer onboarding time. The AI cohort planner is magic.", author: "Marcus Vance", role: "VP of Talent, TechCorp" },
                  { quote: "The candidate matchmaking accuracy is unparalleled. A game-changer for engineering hiring.", author: "Lina Thorne", role: "Lead Recruiter, InnovateHQ" },
                  { quote: "The Speech AI Mock Interview built my confidence. Landed my first Senior DevOps role in weeks!", author: "Sreya Reddy", role: "Full Stack Engineer Graduate" }
                ].map((test, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover-scale-card space-y-3">
                    <p className="text-slate-500 font-medium italic">"{test.quote}"</p>
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800">{test.author}</p>
                      <p className="text-slate-400 text-[10px] font-semibold">{test.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="space-y-6">
              <h3 className="text-center font-display text-sm font-bold text-slate-900 uppercase tracking-wider">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 font-sans">
                {[
                  { name: "Talk to Sales", desc: "Consult custom packages.", email: "info@epitometrc.com", color: "border-blue-100 hover:border-blue-300" },
                  { name: "Hiring Support", desc: "Build developer teams.", email: "hr@epitometrc.com", color: "border-violet-100 hover:border-violet-300" },
                  { name: "Training Enquiry", desc: "Enroll in bootcamps.", email: "academy@epitometrc.com", color: "border-orange-100 hover:border-orange-300" }
                ].map((act, idx) => (
                  <div key={idx} className={`bg-white rounded-2xl border p-5 shadow-sm space-y-2 hover-scale-card transition-all ${act.color}`}>
                    <p className="font-bold text-xs text-slate-900">{act.name}</p>
                    <p className="text-[10.5px] text-slate-400 font-medium leading-relaxed">{act.desc}</p>
                    <a
                      href={`mailto:${act.email}`}
                      className="text-[10.5px] font-bold text-blue-600 hover:text-orange-500 transition-colors inline-block pt-1"
                    >
                      {act.email}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Indicators Section */}
            <div className="border-t border-slate-100 pt-12 space-y-6 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Trusted by Students, Recruiters & Enterprises
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto text-center font-sans">
                {[
                  { count: "94.8%", label: "Placement Success", icon: Award },
                  { count: "12k+", label: "Resumes Optimized", icon: Sparkles },
                  { count: "450+", label: "Hiring Channels", icon: Briefcase },
                  { count: "2,500+", label: "Consultations", icon: Users }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="space-y-1 text-center">
                      <div className="flex justify-center mb-1">
                        <Icon className="h-5 w-5 text-orange-500 animate-pulse" />
                      </div>
                      <p className="text-lg font-black text-slate-900">{stat.count}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

          </Container>
        </section>
      </main>

      {/* AI Assistant Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b172a]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-violet-50 flex items-center justify-center border border-violet-100">
                  <Sparkles className="h-4 w-4 text-violet-500 animate-pulse" />
                </div>
                <h3 className="font-display text-xs font-bold text-[#0b172a]">
                  EpitomeTRC AI Advisor
                </h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 leading-relaxed text-slate-600 font-medium">
                🤖 Hello! I am the automated advisory chatbot assistant. Ask me questions about active tech bootcamps, resume matching rules, or custom client consulting details.
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Suggested Prompts</p>
                <div className="space-y-1.5">
                  {[
                    "What corporate training tracks do you offer?",
                    "How does the AI Proposal Generator operate?",
                    "What is the average response time for consultancies?"
                  ].map((p, i) => (
                    <button
                      key={i}
                      onClick={() => alert(`Simulating AI Reply for: "${p}"`)}
                      className="w-full text-left p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors text-slate-600 text-[10.5px] font-semibold"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
