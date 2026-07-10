"use client";

import Image from "next/image";
import { BookOpen, UserCheck, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";

const features = [
  {
    icon: BookOpen,
    title: "Elite Curriculum",
    description: "Industry-vetted curriculum designed by senior practitioners and academic advisors.",
  },
  {
    icon: UserCheck,
    title: "1:1 Mentorship",
    description: "Direct access to mentors who guide your learning journey and career development.",
  },
  {
    icon: Rocket,
    title: "Live Capstone Projects",
    description: "Build real portfolio projects that demonstrate your skills to potential employers.",
  },
];

export default function LearningPath() {
  return (
    <section className="bg-[#f8fafd] py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionTitle
              title="The Epitome Learning Path"
              description="A hands-on approach that combines structured learning with practical application and mentorship."
            />
            <div className="mt-8 space-y-6">
              {features.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-[#0b172a]">{item.title}</h3>
                    <p className="mt-1 font-sans text-sm text-slate-600">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-2xl shadow-xl"
          >
            <Image
              src="/images/cloud_infra_insight.jpg"
              alt="Modern training facility"
              width={560}
              height={420}
              className="h-[320px] w-full object-cover sm:h-[400px]"
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
