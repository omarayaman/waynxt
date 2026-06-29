"use client";

import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AskAiCta() {
  return (
    <section className="mt-24 mb-12 flex flex-col items-center text-center animate-in fade-in duration-500">
      <div className="w-12 h-12 rounded-full bg-[#1A1808] flex items-center justify-center mb-6 border border-[#2A280D]">
        <Sparkles size={20} className="text-[#DFD616]" />
      </div>
      
      <h2 className="text-2xl font-medium text-white mb-3">
        Ask AI about this place
      </h2>
      
      <p className="text-[#999999] text-sm mb-8 max-w-[300px]">
        Get a tailored explanation, highlights, and insights in a glimpse.
      </p>
      
      <button className="flex items-center gap-2 bg-[#DFD616] text-black px-6 py-3 rounded-full font-medium hover:bg-[#F2EA29] transition-colors shadow-[0_0_20px_rgba(223,214,22,0.15)]">
        <Sparkles size={16} />
        Ask AI about this place
      </button>
    </section>
  );
}
