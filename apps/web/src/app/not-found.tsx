import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";

export const metadata = {
  title: "Page Not Found | EpitomeTRC",
  description: "The page you are looking for does not exist or has been moved.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex items-center justify-center pt-28 pb-16 min-h-[60vh] bg-[#0b172a] text-white relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
        <Container className="text-center space-y-6 relative z-10 max-w-xl">
          <div className="text-8xl font-black text-orange-500 tracking-widest animate-pulse">404</div>
          <h1 className="text-3xl font-bold font-display">Strategic Deviation Detected</h1>
          <p className="text-slate-350 text-sm max-w-md mx-auto leading-relaxed">
            The resource you are attempting to access has either migrated or does not exist in our enterprise routing registry.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button href="/" variant="primary" className="h-11 rounded-xl px-6 font-bold shadow-md">
              Return to Core Node
            </Button>
            <Button href="/contact" variant="outline" className="h-11 rounded-xl px-6 font-bold bg-transparent text-white border-white/20 hover:bg-white/10 hover:border-white">
              Contact Support
            </Button>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
