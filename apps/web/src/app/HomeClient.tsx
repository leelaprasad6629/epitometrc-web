"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import WalkthroughDemo from "@/components/home/WalkthroughDemo";
import About from "@/components/home/About";
import Services from "@/components/home/Services";
import Courses from "@/components/home/Courses";
import CaseStudies from "@/components/common/CaseStudies";
import TrustedBy from "@/components/home/TrustedBy";
import Testimonials from "@/components/home/Testimonials";
import Footer from "@/components/layout/Footer";

export default function HomeClient() {
  const [persona, setPersona] = useState<"student" | "corporate">("student");

  return (
    <>
      <Navbar />
      <Hero persona={persona} setPersona={setPersona} />
      <WalkthroughDemo />
      <TrustedBy />
      <About persona={persona} />
      <Services persona={persona} />
      <Courses persona={persona} />
      <CaseStudies />
      <Testimonials />
      <Footer />
    </>
  );
}
