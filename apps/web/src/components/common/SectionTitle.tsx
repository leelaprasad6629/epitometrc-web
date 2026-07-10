import { cn } from "@/lib/utils";

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  light?: boolean;
};

export default function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  titleClassName,
  light = false,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <span className="mb-2 block font-sans text-xs font-semibold uppercase tracking-wider text-orange-500">
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "font-display text-3xl font-bold tracking-tight sm:text-4xl",
          light ? "text-white" : "text-[#0b172a]",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 font-sans text-sm leading-relaxed sm:text-base",
            light ? "text-slate-300" : "text-slate-600",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
