"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Services from "@/components/home/Services";
import Courses from "@/components/home/Courses";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const [persona, setPersona] = useState<"student" | "corporate">("student");

  return (
    <>
      <Navbar />
      <Hero persona={persona} setPersona={setPersona} />
      <About persona={persona} />
      <Services persona={persona} />
      <Courses persona={persona} />
      <Footer />
    </>
  );
}