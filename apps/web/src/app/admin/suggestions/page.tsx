import AdminSuggestionsClient from "@/components/admin/AdminSuggestionsClient";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Admin Ideas & Suggestions Management | EpitomeTRC",
  description: "Review ideas, execute status workflows, add internal notes, manage Letter of Appreciation (LOA) awards, and export CSVs.",
};

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function AdminSuggestionsPage() {
  return <AdminSuggestionsClient />;
}
