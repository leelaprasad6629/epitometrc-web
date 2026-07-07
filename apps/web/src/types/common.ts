import type { LucideIcon } from "lucide-react";

export type ServiceCard = {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
  icon: LucideIcon;
};

export type JobListing = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  tagColor: string;
};

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  author: string;
  date: string;
  href: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type StatItem = {
  label: string;
  value: string;
  icon?: LucideIcon;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar?: string;
};
