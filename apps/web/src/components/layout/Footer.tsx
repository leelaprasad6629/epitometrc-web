"use client";

import Link from "next/link";
import { ShieldCheck, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";


import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const servicesLinks = [
    { name: "Business Consulting", href: "#services" },
    { name: "Strategic Recruitment", href: "#services" },
    { name: "IT Development", href: "#services" },
    { name: "Cloud Management", href: "#services" },
    { name: "Academic Synergy", href: "#services" },
  ];

  const companyLinks = [
    { name: "Careers", href: "#about" },
    { name: "Insights & Blog", href: "#blog" },
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
    { name: "Licensing", href: "#licensing" },
  ];

  return (
    <footer className="bg-[#050e1e] text-white pt-20">
      
      {/* 1. Call to Action Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-orange-500 to-[#e04e1a] rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Decorative subtle circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-20 -translate-y-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full -translate-x-12 translate-y-12 pointer-events-none" />

          <div className="max-w-xl text-center md:text-left relative z-10">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white leading-tight">
              Ready to Elevate Your Strategy?
            </h2>
            <p className="text-orange-50 mt-3 font-sans text-sm sm:text-base leading-relaxed">
              Partner with EpitomeTEC to design a customized roadmap that streamlines your operations and deploys scalable technology.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full md:w-auto shrink-0 justify-center">
            <Link
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-3.5 text-base font-bold text-orange-600 bg-white rounded-xl shadow-lg hover:bg-slate-50 transition-all text-center"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-3.5 text-base font-bold text-white bg-transparent border border-white/40 rounded-xl hover:bg-white/10 hover:border-white transition-all text-center"
            >
              Schedule Consult
            </Link>
          </div>
        </motion.div>
      </div>

      {/* 2. Core Footer Links Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 border-t border-slate-800/80">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* Brand/Logo Column (takes 4 cols) */}
          <div className="md:col-span-4 flex flex-col space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="p-1.5 bg-slate-900 rounded-lg border border-slate-800">
                <ShieldCheck className="h-6 w-6 text-orange-500" />
              </span>
              <span className="font-display font-bold text-2xl text-white tracking-tight">
                Epitome<span className="text-orange-500">TRC</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm font-sans leading-relaxed max-w-sm">
              Precision in Strategy, Excellence in Execution. We design robust digital transformations and enterprise software systems to connect technology with clear outcomes.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-3">
              <a href="#" className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-colors">
                <FaLinkedin className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-colors">
                <FaTwitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-colors">
              <FaFacebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Services Links Column */}
          <div className="md:col-span-2">
            <h3 className="text-white font-display font-bold text-sm tracking-wider uppercase mb-5">
              Services
            </h3>
            <ul className="space-y-3">
              {servicesLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-white text-sm font-sans transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links Column */}
          <div className="md:col-span-3">
            <h3 className="text-white font-display font-bold text-sm tracking-wider uppercase mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-white text-sm font-sans transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-3 flex flex-col space-y-4">
            <h3 className="text-white font-display font-bold text-sm tracking-wider uppercase mb-5">
              Meet Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-slate-400">
                <MapPin className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="font-sans leading-relaxed">
                  100 Ave of the Americas, Suite 400<br />New York, NY 10013
                </span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-slate-400">
                <Mail className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <a href="mailto:info@epitometec.com" className="font-sans hover:text-white transition-colors">
                  info@epitometec.com
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sm text-slate-400">
                <Phone className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <a href="tel:+12025550143" className="font-sans hover:text-white transition-colors">
                  +1 (202) 555-0143
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* 3. Bottom Legal Copyright Bar */}
      <div className="bg-[#030a15] py-6 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-slate-500">
          <p>&copy; {currentYear} EpitomeTEC. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="#privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link href="#terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
            <Link href="#sitemap" className="hover:text-slate-400 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}