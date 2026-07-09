"use client";

import Link from "next/link";
import { ShieldCheck, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  footerServicesLinks,
  footerCompanyLinks,
  footerProgramsLinks,
} from "@/constants/navigation";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050e1e] pt-20 text-white">
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-[#e04e1a] p-8 shadow-2xl md:flex-row md:p-12"
        >
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-20 -translate-y-20 rounded-full bg-white/5" />
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h2 className="font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Ready to Elevate Your Strategy?
            </h2>
            <p className="mt-3 font-sans text-sm leading-relaxed text-orange-50 sm:text-base">
              Partner with EpitomeTRC to design a customized roadmap that streamlines your operations and deploys scalable technology.
            </p>
          </div>
          <div className="relative z-10 flex w-full shrink-0 flex-col justify-center gap-4 sm:flex-row md:w-auto">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 text-center text-base font-bold text-orange-600 shadow-lg transition-all hover:bg-slate-50"
            >
              Submit An Inquiry
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-xl border border-white/40 bg-transparent px-6 py-3.5 text-center text-base font-bold text-white transition-all hover:border-white hover:bg-white/10"
            >
              View Case Studies
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-slate-800/80 px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          <div className="flex flex-col space-y-6 md:col-span-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="rounded-lg border border-slate-800 bg-slate-900 p-1.5">
                <ShieldCheck className="h-6 w-6 text-orange-500" />
              </span>
              <span className="font-display text-2xl font-bold tracking-tight text-white">
                Epitome<span className="text-orange-500">TRC</span>
              </span>
            </Link>
            <p className="max-w-sm font-sans text-sm leading-relaxed text-slate-400">
              Precision in Strategy, Excellence in Execution. We design robust digital transformations and enterprise software systems to connect technology with clear outcomes.
            </p>
            <div className="flex space-x-3">
              {[FaLinkedin, FaTwitter, FaFacebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-400 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="mb-5 font-display text-sm font-bold uppercase tracking-wider text-white">
              Our Services
            </h3>
            <ul className="space-y-3">
              {footerServicesLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="font-sans text-sm text-slate-400 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="mb-5 font-display text-sm font-bold uppercase tracking-wider text-white">
              Programs
            </h3>
            <ul className="space-y-3">
              {footerProgramsLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="font-sans text-sm text-slate-400 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="mb-5 font-display text-sm font-bold uppercase tracking-wider text-white">
              Company
            </h3>
            <ul className="space-y-3">
              {footerCompanyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="font-sans text-sm text-slate-400 transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col space-y-4 md:col-span-2">
            <h3 className="mb-5 font-display text-sm font-bold uppercase tracking-wider text-white">
              Contact Info
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-slate-400">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                <span className="font-sans leading-relaxed">
                  100 Ave of the Americas, Suite 400
                  <br />
                  New York, NY 10013
                </span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-slate-400">
                <Mail className="h-5 w-5 shrink-0 text-orange-500" />
                <a href="mailto:info@epitometrc.com" className="font-sans transition-colors hover:text-white">
                  info@epitometrc.com
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sm text-slate-400">
                <Phone className="h-5 w-5 shrink-0 text-orange-500" />
                <a href="tel:+12025550143" className="font-sans transition-colors hover:text-white">
                  +1 (202) 555-0143
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-900 bg-[#030a15] py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 font-sans text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>&copy; {currentYear} EpitomeTRC. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/contact#privacy" className="transition-colors hover:text-slate-400">
              Privacy Policy
            </Link>
            <Link href="/contact#terms" className="transition-colors hover:text-slate-400">
              Terms of Service
            </Link>
            <Link href="/contact" className="transition-colors hover:text-slate-400">
              Site Map
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
