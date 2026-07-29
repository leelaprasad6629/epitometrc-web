"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import MobileMenu from "@/components/layout/MobileMenu";
import Image from "next/image";

type DesktopNavItem = {
  name: string;
  href: string;
  children?: { name: string; href: string }[];
};

const desktopNavItems: DesktopNavItem[] = [
  { name: "Home", href: "/" },
  {
    name: "Services",
    href: "/services",
    children: [
      { name: "Recruitment & Staffing", href: "/recruitment" },
      { name: "Consulting", href: "/consulting" },
      { name: "Corporate Training", href: "/training" },
      { name: "Technology Solutions", href: "/it-services" },
    ],
  },
  { name: "Training", href: "/training" },
  { name: "Consulting", href: "/consulting" },
  {
    name: "Courses",
    href: "/courses",
    children: [
      { name: "Technical Courses", href: "/courses#technical" },
      { name: "Soft Skills", href: "/courses#soft-skills" },
      { name: "Certifications", href: "/certifications" },
      { name: "Workshops", href: "/courses#workshops" },
    ],
  },
  {
    name: "Career",
    href: "/careers",
    children: [
      { name: "Jobs", href: "/jobs" },
      { name: "Internships", href: "/internships" },
      { name: "Placement Assistance", href: "/careers#placement" },
      { name: "Resume Building", href: "/careers#resume" },
    ],
  },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const mobileNavItems = [
  { name: "Home", href: "/" },
  {
    name: "Services",
    href: "/services",
    children: [
      { name: "Recruitment & Staffing", href: "/recruitment" },
      { name: "Consulting", href: "/consulting" },
      { name: "Corporate Training", href: "/training" },
      { name: "Technology Solutions", href: "/it-services" },
    ],
  },
  { name: "Training", href: "/training" },
  { name: "Consulting", href: "/consulting" },
  {
    name: "Courses",
    href: "/courses",
    children: [
      { name: "Technical Courses", href: "/courses#technical" },
      { name: "Soft Skills", href: "/courses#soft-skills" },
      { name: "Certifications", href: "/certifications" },
      { name: "Workshops", href: "/courses#workshops" },
    ],
  },
  { name: "Jobs", href: "/jobs" },
  { name: "Internships", href: "/internships" },
  {
    name: "Career",
    href: "/careers",
    children: [
      { name: "Jobs", href: "/jobs" },
      { name: "Internships", href: "/internships" },
      { name: "Placement Assistance", href: "/careers#placement" },
      { name: "Resume Building", href: "/careers#resume" },
    ],
  },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

function NavDropdown({
  item,
  pathname,
}: {
  item: DesktopNavItem;
  pathname: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive =
    pathname === item.href ||
    item.children?.some((c) => pathname === c.href.split("#")[0]);

  return (
    <div 
      ref={ref} 
      className="relative flex items-center" 
      onMouseEnter={() => setIsOpen(true)} 
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-1 py-1.5 px-3.5 rounded-xl text-sm font-semibold transition-all duration-250",
          isActive 
            ? "text-orange-600 bg-orange-50/50" 
            : "text-slate-600 hover:bg-slate-900/5 hover:text-slate-900",
        )}
      >
        {item.name}
        <ChevronDown className={cn("h-3.5 w-3.5 opacity-60 transition-transform duration-250", isOpen && "rotate-180")} />
      </Link>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-1.5 min-w-[240px] rounded-2xl border border-slate-200/60 bg-white/95 p-1.5 shadow-[0_12px_38px_-4px_rgba(15,23,42,0.08)] backdrop-blur-md"
          >
            {item.children?.map((child) => (
              <Link
                key={child.name}
                href={child.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                {child.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  return (
    <nav
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "border-slate-200/90 bg-[#e6f1fc]/92 py-3 shadow-[0_10px_35px_rgba(15,23,42,0.06)] backdrop-blur-lg"
          : "border-slate-200/50 bg-[#f0f7ff]/80 py-4.5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] backdrop-blur-md",
      )}
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          <Link href="/" className="flex shrink-0 items-center space-x-2.5 hover:opacity-90 transition-opacity">
            <Image
              src="/images/Epitome_logo_black.png"
              alt="EpitomeTRC Logo"
              width={499}
              height={390}
              className="h-10 w-auto object-contain"
              priority
            />
            <span className="font-heading text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              Epitome<span className="text-orange-500">TRC</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1.5 xl:flex">
            {desktopNavItems.map((item) =>
              item.children ? (
                <NavDropdown key={item.name} item={item} pathname={pathname} />
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "py-1.5 px-3.5 rounded-xl text-sm font-semibold transition-all duration-250",
                    pathname === item.href
                      ? "text-orange-600 bg-orange-50/50"
                      : "text-slate-600 hover:bg-slate-900/5 hover:text-slate-900",
                  )}
                >
                  {item.name}
                </Link>
              ),
            )}
          </div>

          <div className="hidden items-center space-x-4 md:flex">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-4.5 h-10 text-sm font-bold text-white shadow-[0_4px_12px_rgba(249,115,22,0.15)] hover:shadow-[0_6px_16px_rgba(249,115,22,0.25)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Register Now
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none md:xl:hidden"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} navItems={mobileNavItems} />
    </nav>
  );
}
