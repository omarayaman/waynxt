import React from "react";
import NavbarHome from "../NavbarHome";
import Footer from "../Footer";
import { ShieldCheck, CheckCircle, MessageCircle, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-poppins flex flex-col">
      <NavbarHome />
      
      <main className="flex-1 flex flex-col items-center w-full px-4 pt-20 pb-0 relative z-10">
        
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto mb-16 md:mb-20 mt-10 md:mt-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6 tracking-tight text-foreground">
            About WAYNX
          </h1>
          <p className="text-lg text-muted mb-8">
            Your journey. your way.
          </p>
          <p className="text-xs md:text-sm text-muted max-w-2xl mx-auto leading-relaxed">
            WAYNX is an AI-powered exploration experience built to help travelers understand 
            Egypt through history, culture, and verified insights — all in one calm, premium place.
          </p>
        </div>

        {/* Mission Card */}
        <div className="bg-surface border border-border rounded-[2rem] p-10 md:p-12 max-w-3xl w-full text-center shadow-2xl mb-32 dark:bg-[#111111] dark:border-gray-800/60">
          <h2 className="text-xl md:text-2xl font-medium text-foreground mb-6">
            Our mission
          </h2>
          <p className="text-sm md:text-base text-muted max-w-xl mx-auto leading-relaxed">
            To make exploring Egypt feel effortless, intelligent, and trustworthy — 
            like having a local expert in your pocket.
          </p>
        </div>

        {/* What makes WAYNX different */}
        <div className="w-full max-w-5xl mx-auto mb-32">
          <h2 className="text-xl md:text-2xl font-medium text-foreground mb-10 text-center">
            What makes WAYNX different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group bg-surface border border-border rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:border-accent/30 hover:shadow-[0_10px_30px_color-mix(in srgb, var(--accent) %, transparent)] cursor-default dark:bg-[#111111] dark:border-gray-800/50">
              <div className="w-12 h-12 rounded-full border border-accent/30 flex items-center justify-center text-accent mb-6">
                <ShieldCheck size={20} strokeWidth={1.5} />
              </div>
              <h3 className="text-sm text-foreground font-medium mb-3">Verified cultural information</h3>
              <p className="text-xs text-muted leading-relaxed">
                Every detail is fact-checked and culturally verified.
              </p>
            </div>
            
            <div className="group bg-surface border border-border rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:border-accent/30 hover:shadow-[0_10px_30px_color-mix(in srgb, var(--accent) %, transparent)] cursor-default dark:bg-[#111111] dark:border-gray-800/50">
              <div className="w-12 h-12 rounded-full border border-accent/30 flex items-center justify-center text-accent mb-6">
                <CheckCircle size={20} strokeWidth={1.5} />
              </div>
              <h3 className="text-sm text-foreground font-medium mb-3">No ads. No fake reviews</h3>
              <p className="text-xs text-muted leading-relaxed">
                Clean, honest, ad-free experience focused on knowledge.
              </p>
            </div>

            <div className="group bg-surface border border-border rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:border-accent/30 hover:shadow-[0_10px_30px_color-mix(in srgb, var(--accent) %, transparent)] cursor-default dark:bg-[#111111] dark:border-gray-800/50">
              <div className="w-12 h-12 rounded-full border border-accent/30 flex items-center justify-center text-accent mb-6">
                <MessageCircle size={20} strokeWidth={1.5} />
              </div>
              <h3 className="text-sm text-foreground font-medium mb-3 flex flex-col gap-1">
                <span>Built to help you understand,</span>
                <span>not just visit</span>
              </h3>
              <p className="text-xs text-muted leading-relaxed mt-2">
                AI guidance that tells you the story, not just the facts.
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div id="how-it-works" className="w-full max-w-5xl mx-auto mb-32 scroll-mt-24">
          <h2 className="text-xl md:text-2xl font-medium text-foreground mb-10 text-center">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/ask-waynx" className="group bg-surface border border-border rounded-2xl p-8 flex flex-col items-start transition-all duration-300 hover:-translate-y-2 hover:border-accent/30 hover:shadow-[0_10px_30px_color-mix(in srgb, var(--accent) %, transparent)] cursor-pointer dark:bg-[#111111] dark:border-gray-800/50">
              <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground font-bold flex items-center justify-center mb-6 text-sm">
                1
              </div>
              <h3 className="text-sm text-foreground font-medium mb-3">Ask WAYNX</h3>
              <p className="text-xs text-muted leading-relaxed">
                Get clear answers in plain language.
              </p>
            </Link>
            
            <Link href="/places" className="group bg-surface border border-border rounded-2xl p-8 flex flex-col items-start transition-all duration-300 hover:-translate-y-2 hover:border-accent/30 hover:shadow-[0_10px_30px_color-mix(in srgb, var(--accent) %, transparent)] cursor-pointer dark:bg-[#111111] dark:border-gray-800/50">
              <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground font-bold flex items-center justify-center mb-6 text-sm">
                2
              </div>
              <h3 className="text-sm text-foreground font-medium mb-3">Explore places</h3>
              <p className="text-xs text-muted leading-relaxed">
                Story-driven pages with highlights and practical info.
              </p>
            </Link>

            <Link href="/search" className="group bg-surface border border-border rounded-2xl p-8 flex flex-col items-start transition-all duration-300 hover:-translate-y-2 hover:border-accent/30 hover:shadow-[0_10px_30px_color-mix(in srgb, var(--accent) %, transparent)] cursor-pointer dark:bg-[#111111] dark:border-gray-800/50">
              <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground font-bold flex items-center justify-center mb-6 text-sm">
                3
              </div>
              <h3 className="text-sm text-foreground font-medium mb-3">Search smarter</h3>
              <p className="text-xs text-muted leading-relaxed">
                Find museums, landmarks, and topics easily.
              </p>
            </Link>
          </div>
        </div>

        {/* Ready to explore */}
        <div className="bg-surface border border-border rounded-[2rem] p-12 md:p-16 w-full max-w-3xl mx-auto text-center mb-32 shadow-2xl dark:bg-[#111111] dark:border-gray-800/50">
          <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-8">
            Ready to explore?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/planner"
              className="bg-accent hover:bg-accent-hover text-accent-foreground font-bold text-sm px-8 py-3 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_color-mix(in srgb, var(--accent) %, transparent)] hover:shadow-[0_0_20px_color-mix(in srgb, var(--accent) %, transparent)]"
            >
              <MapPin size={16} strokeWidth={2} />
              Start exploring
            </Link>
            <Link 
              href="/ask-waynx"
              className="text-muted text-sm flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Sparkles size={16} strokeWidth={1.5} />
              Ask WAYNX a question
            </Link>
          </div>
        </div>

      </main>
      
      <Footer />
    </div>
  );
}
