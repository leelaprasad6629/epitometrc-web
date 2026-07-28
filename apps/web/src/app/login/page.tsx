import { LoginClient } from "./LoginClient";
import { Metadata, Viewport } from "next";
import { generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Login",
  description: "Log in to your EpitomeTRC dashboard to access recruitment tools, custom courses, and AI interview features.",
  path: "/login",
  noIndex: true,
});

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function LoginPage() {
  return <LoginClient />;
}
