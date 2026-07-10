"use client";

import { Search } from "lucide-react";
import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";

const programs = [
  {
    title: "Advanced React Patterns",
    level: "Intermediate",
    duration: "10 Weeks",
    description: "Master advanced React patterns including compound components, render props, and performance optimization.",
  },
  {
    title: "DevOps & Cloud Ops",
    level: "Advanced",
    duration: "12 Weeks",
    description: "End-to-end DevOps pipeline design with CI/CD, containerization, and cloud infrastructure management.",
  },
  {
    title: "Enterprise UX Strategy",
    level: "Advanced",
    duration: "8 Weeks",
    description: "Design thinking and UX strategy for enterprise applications with user research and prototyping.",
  },
];

export default function ProgramGrid() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="mb-10 rounded-2xl bg-[#0b172a] p-4 sm:p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Find a program..."
              aria-label="Search programs"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3.5 pl-12 pr-4 font-sans text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {programs.map((program, index) => (
            <motion.article
              key={program.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <Badge variant="orange">{program.level}</Badge>
              <h3 className="mt-3 font-display text-lg font-bold text-[#0b172a]">{program.title}</h3>
              <p className="mt-1 font-sans text-xs text-slate-500">{program.duration}</p>
              <p className="mt-3 font-sans text-sm text-slate-600">{program.description}</p>
              <Button href="/contact" variant="outline" size="sm" className="mt-4 w-full">
                Apply
              </Button>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
