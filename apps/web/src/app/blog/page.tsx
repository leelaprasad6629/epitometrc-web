"use client";

import { motion } from "framer-motion";
import { FileText, Calendar, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "Scaling Next.js Micro-Frontends in 2026",
      category: "Technology",
      date: "24 Oct 2026",
      readTime: "8 min read",
      excerpt: "Deep dive into architectural blueprints, performance optimizations, and layout systems in modern enterprise React apps.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
      slug: "scaling-nextjs-microfrontends",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-20 font-sans bg-slate-50/50 min-h-screen">
        <section className="py-16">
          <Container className="space-y-8">
            <div className="text-center space-y-2">
              <span className="rounded bg-orange-50 px-3 py-1 text-xs font-bold text-orange-500 uppercase tracking-wider">
                Insights
              </span>
              <h1 className="font-display text-3xl font-bold text-[#0b172a] sm:text-4xl">
                Epitome Engineering Blog
              </h1>
              <p className="text-slate-500 text-sm max-w-lg mx-auto">
                Read the latest technology guides, agile case studies, and business consulting reviews written by our top architects.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto pt-6">
              {posts.map((post) => (
                <div key={post.id} className="group rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-103 transition-transform"
                        sizes="(max-width: 768px) 100vw, 30vw"
                      />
                      <span className="absolute top-4 left-4 rounded bg-[#0b172a]/95 backdrop-blur-sm px-2.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                        {post.category}
                      </span>
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex gap-3 text-[10px] font-semibold text-slate-400 font-sans">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{post.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.readTime}</span>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="font-display text-base font-bold text-[#0b172a] leading-snug group-hover:text-orange-500 transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-slate-500 text-xs font-sans leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <Button href={`/blog/${post.slug}`} variant="outline" size="sm" className="w-full h-9 rounded-xl text-xs font-bold">
                      Read Article <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
