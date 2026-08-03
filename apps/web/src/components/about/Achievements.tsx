"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import Statistics from "@/components/common/Statistics";

export default function Achievements() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/company/info")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      })
      .catch(() => {});
  }, []);

  const statsItems = [
    { label: "Trainings & Internships", value: stats?.trainingsInternships ? `${stats.trainingsInternships}+` : "5000+" },
    { label: "Corporate Clients", value: stats?.clients ? `${stats.clients}+` : "340+" },
    { label: "Projects Completed", value: stats?.projects ? `${stats.projects}+` : "160+" },
    { label: "College Partners", value: stats?.collegeTieUps ? `${stats.collegeTieUps}+` : "200+" },
  ];

  return (
    <section className="bg-[#0b172a] py-16 md:py-24">
      <Container>
        <SectionTitle
          eyebrow="Impact"
          title="Achievements That Define Us"
          description="Measurable outcomes across recruitment, training, and consulting services dynamically synchronized with the official website."
          align="center"
          light
          className="mx-auto mb-12"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Statistics stats={statsItems} variant="dark" />
        </motion.div>
      </Container>
    </section>
  );
}
