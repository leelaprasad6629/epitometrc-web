"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Play, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-36 lg:pb-28 bg-[#f8fafd] overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column - Content */}
          <div className="lg:col-span-7 flex flex-col space-y-6 md:space-y-8">
            {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex self-start"
            >
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-600 border border-orange-200 shadow-sm">
                Enterprise Consulting Solutions
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-[#0b172a] leading-[1.1] tracking-tight"
            >
              Precision in Strategy, <br />
              <span className="text-orange-500">Excellence in Execution</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-600 text-lg md:text-xl max-w-xl leading-relaxed font-sans"
            >
              Transforming complex business challenges into clear strategic victories. We deliver innovative consultancy and high-fidelity tech solutions to drive sustainable growth.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 sm:items-center"
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-orange-500 rounded-xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:shadow-orange-600/30 transition-all duration-200"
              >
                Keep in Touch
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-[#0b172a] shadow-sm transition-all duration-200"
              >
                <Play className="mr-2 h-4 w-4 fill-slate-700 text-slate-700" />
                Meet with us
              </Link>
            </motion.div>

            {/* Client Logo Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-6 sm:pt-10 border-t border-slate-200/80"
            >
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 font-sans">
                Trusted by global visionaries
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-4 items-center opacity-65 grayscale hover:grayscale-0 transition-all duration-300">
                <span className="font-display font-extrabold text-slate-500 text-lg tracking-wider">NexaGroup</span>
                <span className="font-display font-extrabold text-slate-500 text-lg tracking-wider">Australis</span>
                <span className="font-display font-extrabold text-slate-500 text-lg tracking-wider">Vertex</span>
                <span className="font-display font-extrabold text-slate-500 text-lg tracking-wider">Global.CO</span>
                <span className="font-display font-extrabold text-slate-500 text-lg tracking-wider">SkyLine</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Image & Floating Cards */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl max-w-md lg:max-w-none w-full"
            >
              {/* Note: Store your hero image at /public/images/boardroom_hero.jpg */}
              <Image
                src="/images/boardroom_hero.jpg"
                alt="EpitomeTEC Modern Conference Room"
                width={600}
                height={500}
                priority
                className="w-full h-[400px] lg:h-[480px] object-cover hover:scale-105 transition-transform duration-700"
              />
              
              {/* Floating Stat Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-slate-100 flex items-center space-x-4 max-w-xs"
              >
                <div className="p-2.5 bg-orange-100 rounded-lg text-orange-600">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xl text-[#0b172a] leading-none">500+</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1">Active Partners Worldwide</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}