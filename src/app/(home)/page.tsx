import Link from "next/link";
import NavbarHome from "./NavbarHome";
import HeroBackgroundSlider from "./HeroBackgroundSlider";
import AiSearchSection from "./AiSearchSection";
import InterestsSection from "./InterestsSection";
import EgyptTourismSection from "./EgyptTourismSection";
import InteractiveMapSection from "./InteractiveMapSection";
import FeaturedPlacesSection from "./FeaturedPlacesSection";
import UpcomingEvents from "./UpcomingEvents";
import Footer from "./Footer";

export default function Home() {
  return (
    <>
    <div className="relative bg-[#050505] text-white font-sans overflow-x-hidden">
      <NavbarHome />

      {/* Hero Section */}
      <section className="relative min-h-screen">
        <HeroBackgroundSlider />

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

      {/* Featured Places */}
      <FeaturedPlacesSection />

      {/* Why Egypt — Tourism Excellence */}
      <EgyptTourismSection />

      {/* Interactive Map */}
      <InteractiveMapSection />


      {/* Upcoming Events */}
      <UpcomingEvents />

      {/* Footer */}
      <Footer />
    </div>
    </>
  );
}
