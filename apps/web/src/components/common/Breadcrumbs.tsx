"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-3 px-4 md:px-6 bg-slate-50 border-b border-slate-200/40 text-xs font-semibold text-slate-500 font-sans">
      <div className="mx-auto max-w-7xl flex items-center space-x-2">
        <Link href="/" className="flex items-center gap-1 text-slate-400 hover:text-[#0b172a] transition-colors">
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <ChevronRight className="h-3.5 w-3.5 text-slate-350 shrink-0" />
            {item.href ? (
              <Link href={item.href} className="hover:text-[#0b172a] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-[#0b172a] font-bold">{item.label}</span>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
