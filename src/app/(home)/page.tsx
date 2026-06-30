import Image from "next/image";
import Link from "next/link";
import NavbarHome from "./NavbarHome";
import AiSearchSection from "./AiSearchSection";
import InterestsSection from "./InterestsSection";
import CuratedForYou from "./CuratedForYou";
import UpcomingEvents from "./UpcomingEvents";
import Footer from "./Footer";

export default function Home() {
  return (
    <>
    <div className="relative bg-[#050505] text-white font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/heropage.png"
            alt="Egyptian pharaoh background"
            width={1512}
            height={847}
            quality={100}
            className="w-full h-full object-cover object-center"
            priority
          />
        </div>

        {/* Navbar Component */}
        <NavbarHome />

        {/* Main Content Area */}
        <main className="relative z-10 flex items-center min-h-screen px-6 lg:px-16 xl:px-[10%]">
          <div className="max-w-[550px] pt-10">
            <h1 className="text-[56px] lg:text-[72px] font-bold text-white mb-6 leading-[1.05] tracking-tight">
              Explore Egypt with clarity.
            </h1>
            <p className="text-[#a1a1a1] text-lg lg:text-[20px] leading-relaxed mb-12 max-w-[480px]">
              Explore Egypt through immersive storytelling and real-time AI answers — in one place.
            </p>
            <Link
              href="/places"
              className="inline-flex items-center gap-3 bg-[#DFD616] hover:bg-[#EAE121] text-[#0a0a0a] font-bold text-[16px] px-8 py-4 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(223,214,22,0.15)] hover:shadow-[0_0_20px_rgba(223,214,22,0.3)] group"
            >
              Start Exploring
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:translate-x-1 transition-transform"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </main>
      </section>

      {/* AI Search Section */}
      <AiSearchSection />

      {/* Interests Section */}
      <InterestsSection />

      {/* Curated Recommendations */}
      <CuratedForYou />

      {/* Upcoming Events */}
      <UpcomingEvents />

      {/* Footer */}
      <Footer />
    </div>
    </>
  );
}
