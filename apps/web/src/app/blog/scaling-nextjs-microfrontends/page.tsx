"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, Share2, Heart, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";

export default function BlogPostDetail() {
  return (
    <>
      <Navbar />
      <main className="pt-20 font-sans bg-slate-50/50 min-h-screen">
        <article className="py-12 md:py-16">
          <Container className="max-w-3xl space-y-8">
            {/* Back Button */}
            <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-orange-500 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>

            {/* Header info */}
            <div className="space-y-4">
              <span className="rounded bg-orange-50 px-3 py-1 text-xs font-bold text-orange-500 uppercase tracking-wider">
                Technology
              </span>
              <h1 className="font-display text-3xl font-extrabold text-[#0b172a] sm:text-4xl leading-tight">
                Scaling Next.js Micro-Frontends in 2026
              </h1>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> 24 Oct 2026</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 8 min read</span>
                <span>•</span>
                <span>By Sarah Jennings</span>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop"
                alt="Scaling Next.js Micro-Frontends in 2026"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </div>

            {/* Content */}
            <div className="prose prose-slate prose-sm sm:prose-base font-sans text-slate-600 space-y-6 leading-relaxed">
              <p className="text-sm sm:text-base font-medium text-slate-900 border-l-4 border-orange-500 pl-4 py-1.5 bg-orange-50/20">
                Micro-frontends have evolved from a luxury strategy to an essential architectural foundation for enterprise platforms. In this deep dive, we explore how Next.js 16 and modern bundling environments optimize runtime latency and type safety.
              </p>
              
              <h2 className="font-display text-xl font-bold text-[#0b172a] pt-4">
                1. The Shift to Next.js Multi-Zone Layouts
              </h2>
              <p>
                In 2026, Next.js Multi-Zones remain the cleanest method to merge decoupled web applications under a single domain nameserver. By utilizing custom routing rewrites inside Next.js configuration, we route `/shop`, `/dashboard`, and static pages to completely separate, independently deployed Next.js instances.
              </p>

              <h2 className="font-display text-xl font-bold text-[#0b172a] pt-4">
                2. Shared State Management & Dependency Sharing
              </h2>
              <p>
                To avoid duplicate vendor bundles loading in the browser, we construct shared monorepo workspace packages. Utilizing Turborepo configurations, we cache build modules and ensure shared utilities (like authentication state hooks and common styling systems) are resolved statically during compile passes.
              </p>

              <h2 className="font-display text-xl font-bold text-[#0b172a] pt-4">
                3. Conclusion
              </h2>
              <p>
                By implementing custom rewrites, isolated component design systems, and Turborepo cache validation, teams can scale application frontends seamlessly without compromising user performance metrics.
              </p>
            </div>

            {/* Feedback / Social Engagement */}
            <div className="flex justify-between items-center border-t border-b border-slate-100 py-4 font-sans text-xs font-bold text-slate-400 uppercase tracking-wider">
              <div className="flex gap-4">
                <button className="flex items-center gap-1.5 hover:text-rose-500 transition-colors cursor-pointer">
                  <Heart className="h-4.5 w-4.5" /> 42 Likes
                </button>
                <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors cursor-pointer">
                  <MessageSquare className="h-4.5 w-4.5" /> 8 Comments
                </button>
              </div>
              <button className="flex items-center gap-1.5 hover:text-orange-500 transition-colors cursor-pointer">
                <Share2 className="h-4.5 w-4.5" /> Share
              </button>
            </div>
          </Container>
        </article>
      </main>
      <Footer />
    </>
  );
}
