export type TemplateId =
  | "modern"
  | "professional"
  | "classic"
  | "minimal"
  | "executive"
  | "compact"
  | "creative";

export interface TemplateConfig {
  fontFamily: "font-sans" | "font-serif" | "font-mono";
  accentColor: string; // hex
  fontSize: "sm" | "base" | "lg";
  spacing: "compact" | "normal" | "spacious";
  margins: "narrow" | "normal" | "wide";
  headerLayout: "center" | "left" | "split";
  showIcons: boolean;
  pageSize: "A4" | "Letter";
}

export const DEFAULT_TEMPLATE_CONFIG: TemplateConfig = {
  fontFamily: "font-sans",
  accentColor: "#0f172a",
  fontSize: "base",
  spacing: "normal",
  margins: "normal",
  headerLayout: "left",
  showIcons: true,
  pageSize: "A4",
};

export const TEMPLATE_METADATA: Record<TemplateId, { name: string; description: string; previewBadge: string }> = {
  modern: {
    name: "Modern ATS",
    description: "Sleek dark header accent bar with high ATS readability and categorized skills grid.",
    previewBadge: "Popular",
  },
  professional: {
    name: "Professional Corporate",
    description: "Traditional corporate layout featuring bold section dividers and executive typography.",
    previewBadge: "Recommended",
  },
  classic: {
    name: "Classic Academic",
    description: "Serif typography with centered contact headers, ideal for research, academia, and senior roles.",
    previewBadge: "Formal",
  },
  minimal: {
    name: "Minimalist Clean",
    description: "Ultra-clean layout prioritizing maximum whitespace, typography elegance, and subtle borders.",
    previewBadge: "Clean",
  },
  executive: {
    name: "Executive Leadership",
    description: "Navy and amber highlights designed for senior managers, leads, and directors.",
    previewBadge: "Executive",
  },
  compact: {
    name: "Engineering Compact",
    description: "Dense single-page optimization engineered to fit maximum technical achievements cleanly.",
    previewBadge: "Tech Dense",
  },
  creative: {
    name: "Creative Portfolio",
    description: "Split two-column layout highlighting key skills, contact details, and project achievements.",
    previewBadge: "Modern",
  },
};
