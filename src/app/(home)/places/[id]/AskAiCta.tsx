"use client";

import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AskAiCta() {
  return (
    <section className="mt-24 mb-12 flex flex-col items-center text-center animate-in fade-in duration-500">
      <div className="w-12 h-12 rounded-full bg-accent-subtle flex items-center justify-center mb-6 border border-accent/20">
        <Sparkles size={20} className="text-accent" />
      </div>
      
      <h2 className="text-2xl font-medium text-foreground mb-3">
        Ask AI about this place
      </h2>
      
      <p className="text-muted text-sm mb-8 max-w-[300px]">
        Get a tailored explanation, highlights, and insights in a glimpse.
      </p>
      
      <button className="flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-full font-medium hover:bg-[#F2EA29] transition-colors shadow-[0_0_20px_color-mix(in srgb, var(--accent) %, transparent)]">
        <Sparkles size={16} />
        Ask AI about this place
      </button>
    </section>
  );
}
