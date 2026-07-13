"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Calendar, Clock, ArrowRight, MapPin, Compass, Navigation } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";

const getHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function BlogPage() {
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");

  const handleGetLocation = () => {
    setGeoLoading(true);
    setGeoError("");
    
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      setGeoLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
        
        // Epitome HQ coordinates (London, UK): 51.5074, -0.1278
        const dist = getHaversineDistance(latitude, longitude, 51.5074, -0.1278);
        setDistance(dist);
        setGeoLoading(false);
      },
      () => {
        setGeoError("Location access denied. Please grant permissions.");
        setGeoLoading(false);
      }
    );
  };

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
              {/* Blog posts list */}
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

              {/* Geolocation Widget Card */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-orange-50 px-2.5 py-0.5 text-[9px] font-bold text-orange-500 uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Geolocation
                    </span>
                    <Compass className="h-4.5 w-4.5 text-slate-400 animate-spin-slow" />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <h3 className="font-display text-base font-bold text-[#0b172a]">
                      Local Telemetry Widget
                    </h3>
                    <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
                      Enable browser location tracking to calculate your distance to our London Headquarters and match local region updates.
                    </p>
                  </div>

                  {coords ? (
                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-3 animate-in fade-in duration-300 text-xs">
                      <div className="flex justify-between items-center py-1 border-b border-slate-100/60 font-semibold text-slate-600">
                        <span>Latitude</span>
                        <span className="font-mono text-[#0b172a]">{coords.latitude.toFixed(4)}° N</span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-100/60 font-semibold text-slate-600">
                        <span>Longitude</span>
                        <span className="font-mono text-[#0b172a]">{coords.longitude.toFixed(4)}° W</span>
                      </div>
                      {distance !== null && (
                        <div className="flex justify-between items-center py-1 border-b border-slate-100/60 font-semibold text-slate-600">
                          <span>HQ Proximity</span>
                          <span className="font-mono text-orange-500 font-bold">{distance.toFixed(1)} km</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50/50 p-1.5 rounded-lg border border-green-100">
                        <Navigation className="h-3 w-3 animate-pulse" />
                        Region Matched (Epitome node active)
                      </div>
                    </div>
                  ) : (
                    <div className="h-36 rounded-xl bg-slate-50 border border-slate-100 border-dashed flex flex-col items-center justify-center text-center p-4 space-y-2">
                      <MapPin className="h-6 w-6 text-slate-300" />
                      {geoError ? (
                        <p className="text-red-500 text-[10px] font-semibold">{geoError}</p>
                      ) : (
                        <p className="text-slate-400 text-[10px] font-medium">Location information is currently locked.</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleGetLocation}
                    disabled={geoLoading}
                    variant="primary"
                    size="sm"
                    className="w-full h-9 rounded-xl text-xs font-bold shadow-sm"
                  >
                    {geoLoading ? "Acquiring lock..." : coords ? "Refresh Coordinates" : "Enable Location Insights"}
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
