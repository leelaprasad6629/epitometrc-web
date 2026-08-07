import SuggestionsClient from "./SuggestionsClient";
import { Metadata, Viewport } from "next";
import { generateSEOMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Ideas & Suggestions Portal",
  description: "Submit innovative ideas and product enhancements to the EpitomeTRC Innovation Team. Selected contributions may receive a Letter of Appreciation (LOA).",
  keywords: ["Ideas and Suggestions", "Platform Enhancement", "Product Feedback", "Letter of Appreciation", "EpitomeTRC Innovation"],
  path: "/suggestions",
});

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function SuggestionsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Ideas & Suggestions", item: "/suggestions" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SuggestionsClient />
    </>
  );
}
