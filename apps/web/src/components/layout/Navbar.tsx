"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, ShieldCheck, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import MobileMenu from "@/components/layout/MobileMenu";

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
      { name: "Recruitment", href: "/services#recruitment" },
      { name: "Staffing", href: "/services#staffing" },
      { name: "Consulting", href: "/consulting" },
      { name: "Corporate Training", href: "/training" },
      { name: "Technology Solutions", href: "/services#it-services" },
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
      { name: "Recruitment", href: "/services#recruitment" },
      { name: "Staffing", href: "/services#staffing" },
      { name: "Consulting", href: "/consulting" },
      { name: "Corporate Training", href: "/training" },
      { name: "Technology Solutions", href: "/services#it-services" },
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
    <div ref={ref} className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1 py-2 text-sm font-medium transition-colors",
          isActive ? "text-orange-500" : "text-slate-600 hover:text-[#0b172a]",
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
        suppressHydrationWarning
      >
        {item.name}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-180")} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full z-50 mt-1 min-w-[220px] rounded-xl border border-slate-100 bg-white py-2 shadow-lg"
          >
            {item.children?.map((child) => (
              <Link
                key={child.name}
                href={child.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#0b172a]"
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
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
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
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
        isScrolled || !isHome
          ? "border-b border-slate-200/50 bg-white/90 py-3 shadow-md backdrop-blur-md"
          : "bg-transparent py-5",
      )}
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between">
          <Link href="/" className="flex shrink-0 items-center space-x-2">
            <span className="rounded-lg bg-[#0b172a] p-1.5">
              <ShieldCheck className="h-6 w-6 text-orange-500" />
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-[#0b172a] sm:text-2xl">
              Epitome<span className="text-orange-500">TRC</span>
            </span>
          </Link>

          <div className="hidden items-center gap-5 xl:flex">
            {desktopNavItems.map((item) =>
              item.children ? (
                <NavDropdown key={item.name} item={item} pathname={pathname} />
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative py-2 text-sm font-medium transition-colors group",
                    pathname === item.href
                      ? "text-orange-500"
                      : "text-slate-600 hover:text-[#0b172a]",
                  )}
                >
                  {item.name}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-0.5 w-full origin-left bg-orange-500 transition-transform",
                      pathname === item.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
              ),
            )}
          </div>

          <div className="hidden items-center space-x-3 md:flex xl:space-x-4">
            <Link
              href="/contact"
              className="px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-[#0b172a]"
            >
              Login
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              Register Now
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#0b172a] focus:outline-none md:xl:hidden"
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
