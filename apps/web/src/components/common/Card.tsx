import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type CardProps = {
  title: string;
  description: string;
  image?: string;
  href?: string;
  icon?: LucideIcon;
  tag?: string;
  className?: string;
  imageAlt?: string;
  variant?: "default" | "dark" | "featured";
};

export default function Card({
  title,
  description,
  image,
  href = "#",
  icon: Icon,
  tag,
  className,
  imageAlt,
  variant = "default",
}: CardProps) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        variant === "dark"
          ? "border-slate-800 bg-[#0b172a] text-white"
          : "border-slate-100 bg-white shadow-sm",
        className,
      )}
    >
      {image && (
        <div className="relative h-48 overflow-hidden sm:h-52">
          <Image
            src={image}
            alt={imageAlt ?? title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {Icon && (
            <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#0b172a]/90 text-white">
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        {tag && (
          <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange-500">
            {tag}
          </span>
        )}
        <h3
          className={cn(
            "font-display text-lg font-bold",
            variant === "dark" ? "text-white" : "text-orange-500",
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mt-2 flex-1 font-sans text-sm leading-relaxed",
            variant === "dark" ? "text-slate-300" : "text-slate-600",
          )}
        >
          {description}
        </p>
        <Link
          href={href}
          className="mt-4 inline-flex items-center font-sans text-sm font-semibold text-orange-500 transition-colors hover:text-orange-600"
        >
          Learn More
          <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
