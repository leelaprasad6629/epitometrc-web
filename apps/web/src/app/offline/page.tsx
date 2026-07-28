import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import { Metadata, Viewport } from "next";
import { generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Offline Status",
  description: "You are currently offline. Please check your network connection.",
  path: "/offline",
  noIndex: true,
});

export const viewport: Viewport = {
  themeColor: "#0b172a",
  width: "device-width",
  initialScale: 1,
};

export default function OfflinePage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex items-center justify-center pt-28 pb-16 min-h-[60vh] bg-[#0b172a] text-white relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
        <Container className="text-center space-y-6 relative z-10 max-w-xl">
          <div className="text-8xl font-black text-slate-500 tracking-widest">OFFLINE</div>
          <h1 className="text-3xl font-bold font-display">Connection Lock Detected</h1>
          <p className="text-slate-350 text-sm max-w-md mx-auto leading-relaxed">
            Your client is currently disconnected from our database registries. Please verify your internet settings and retry.
          </p>
          <div className="flex justify-center pt-4">
            <Button href="/" variant="primary" className="h-11 rounded-xl px-6 font-bold shadow-md">
              Retry Connection
            </Button>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
