"use client";

import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";

export default function CompanyStory() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <SectionTitle
            eyebrow="Our Story"
            title="Built on Precision, Powered by Innovation"
            description="Founded with a mission to redefine how enterprises approach strategy and talent, EpitomeTRC has grown into a trusted partner for Fortune 500 companies, startups, and academic institutions worldwide."
          />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 font-sans text-sm leading-relaxed text-slate-600 sm:text-base"
          >
            <p>
              Our journey began with a simple belief: that the best outcomes emerge when strategic thinking meets technical excellence. Today, we deliver end-to-end solutions spanning business consulting, recruitment, IT services, and professional training.
            </p>
            <p>
              With a global network of industry experts and a data-driven approach, we help clients navigate digital transformation, build high-performing teams, and achieve measurable growth across every sector we serve.
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
