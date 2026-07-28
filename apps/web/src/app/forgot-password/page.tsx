import ForgotPasswordClient from "./ForgotPasswordClient";
import { Metadata, Viewport } from "next";
import { generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Forgot Password",
  description: "Request a password reset link to recover your account.",
  path: "/forgot-password",
  noIndex: true,
});

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
