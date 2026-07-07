"use client";

import { Award, BookMarked, BadgeCheck, Users } from "lucide-react";
import Container from "@/components/common/Container";

const features = [
  { icon: Award, label: "Specialization" },
  { icon: BookMarked, label: "Coursework" },
  { icon: BadgeCheck, label: "Certified" },
  { icon: Users, label: "Peer Network" },
];

export default function CertificationBar() {
  return (
    <section className="border-y border-slate-200 bg-white py-8">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <h2 className="font-display text-lg font-bold text-[#0b172a]">Certification Courses</h2>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {features.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <item.icon className="h-5 w-5 text-orange-500" />
                <span className="font-sans text-sm font-medium text-slate-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
