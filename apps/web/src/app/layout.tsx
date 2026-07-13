import type { Metadata } from "next";
import "./globals.css";
import FloatingAIButton from "@/components/ai/FloatingAIButton";

export const metadata: Metadata = {
  title: "EpitomeTRC Platform",
  description: "Enterprise strategy, recruitment, and corporate trainings portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased font-sans"
    >
      <body className="min-h-full flex flex-col">
        {children}
        <FloatingAIButton />
      </body>
    </html>
  );
}
