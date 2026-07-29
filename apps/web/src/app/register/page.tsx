import RegisterClient from "./RegisterClient";
import { Metadata, Viewport } from "next";
import { generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Create Account",
  description: "Create your EpitomeTRC account to access professional recruitment solutions, courses, and managed IT services.",
  path: "/register",
  noIndex: true,
});

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function RegisterPage() {
  return <RegisterClient />;
}
