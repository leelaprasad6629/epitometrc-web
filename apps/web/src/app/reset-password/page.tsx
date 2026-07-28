import ResetPasswordClient from "./ResetPasswordClient";
import { Metadata, Viewport } from "next";
import { generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Reset Password",
  description: "Set a new secure password for your EpitomeTRC account.",
  path: "/reset-password",
  noIndex: true,
});

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function ResetPasswordPage() {
  return <ResetPasswordClient />;
}
