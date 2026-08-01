import Link from "next/link";
import HeroBackgroundSlider from "./HeroBackgroundSlider";
import AiSearchSection from "./AiSearchSection";
import InterestsSection from "./InterestsSection";
import EgyptTourismSection from "./EgyptTourismSection";
import InteractiveMapSection from "./InteractiveMapSection";
import FeaturedPlacesSection from "./FeaturedPlacesSection";
import UpcomingEvents from "./UpcomingEvents";
import Footer from "./Footer";
import HeroText from "./HeroText";

export default function Home() {
  return (
    <>
    <div className="relative bg-background text-foreground font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen">
        <HeroBackgroundSlider />

        {/* Main Content Area */}
        <main className="relative z-10 flex items-center min-h-screen px-6 lg:px-16 xl:px-[10%]">
          <HeroText />
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
