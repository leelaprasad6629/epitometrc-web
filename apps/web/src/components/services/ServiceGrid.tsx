"use client";

import {
  Share2,
  Briefcase,
  Server,
  MapPin,
  CloudUpload,
  Code2,
} from "lucide-react";
import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import Card from "@/components/common/Card";

const services = [
  {
    id: "consulting",
    title: "Business Consulting",
    description:
      "Strategic advisory services that align your business objectives with actionable roadmaps for sustainable growth and market leadership.",
    image: "/images/boardroom_hero.jpg",
    href: "/consulting",
    icon: Share2,
  },
  {
    id: "recruitment",
    title: "Recruitment",
    description:
      "End-to-end talent acquisition solutions connecting elite professionals with organizations that value excellence and innovation.",
    image: "/images/executive_trust.jpg",
    href: "/recruitment",
    icon: Briefcase,
  },
  {
    id: "it-services",
    title: "IT Services",
    description:
      "Robust infrastructure and digital solutions including cloud management, cybersecurity, and enterprise support for modern businesses.",
    image: "/images/cloud_infra_insight.jpg",
    href: "/it-services",
    icon: Server,
  },
  {
    id: "college",
    title: "College Collaboration",
    description:
      "Bridging academia and industry through campus recruitment, skill development programs, and research partnerships worldwide.",
    image: "/images/scaling_operations_insight.jpg",
    href: "/college-collaboration",
    icon: MapPin,
  },
  {
    id: "training",
    title: "Training & Internships",
    description:
      "Industry-aligned training ecosystems and internship programs designed to cultivate the next generation of tech and business leaders.",
    image: "/images/ai_recruitment_insight.jpg",
    href: "/training",
    icon: CloudUpload,
  },
  {
    id: "development",
    title: "IT Development",
    description:
      "Custom software development, mobile applications, and cloud systems built with agile methodologies and modern technology stacks.",
    image: "/images/cloud_infra_insight.jpg",
    href: "/it-development",
    icon: Code2,
  },
];

export default function ServiceGrid() {
  return (
    <section className="bg-[#f8fafd] py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              id={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Card {...service} />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
