"use client";

import Image from "next/image";
import { BarChart3, Layers, Target } from "lucide-react";
import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";

const benefits = [
  {
    icon: BarChart3,
    title: "Data-driven Insights",
    description: "Leverage analytics and market intelligence to make informed strategic decisions with measurable outcomes.",
  },
  {
    icon: Layers,
    title: "Scalable Solutions",
    description: "Implement frameworks and systems designed to grow with your organization across markets and teams.",
  },
  {
    icon: Target,
    title: "Strategic Alignment",
    description: "Ensure every initiative aligns with your core business objectives and long-term vision.",
  },
];

export default function ConsultingBenefits() {
  return (
    <section className="bg-[#f8fafd] py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionTitle
              eyebrow="Why Partner With Us"
              title="Benefits of Partnering with EpitomeTRC"
            />
            <div className="mt-8 space-y-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                    <benefit.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-[#0b172a]">{benefit.title}</h3>
                    <p className="mt-1 font-sans text-sm text-slate-600">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/images/scaling_operations_insight.jpg"
                alt="Data analytics on tablet"
                width={560}
                height={420}
                className="h-[320px] w-full object-cover sm:h-[400px]"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 max-w-xs rounded-xl border border-slate-100 bg-white p-4 shadow-lg sm:-bottom-6 sm:-left-6">
              <p className="font-display text-2xl font-bold text-orange-500">94%</p>
              <p className="font-sans text-xs text-slate-500">
                Increase in efficiency for clients who partner with our consulting team
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
