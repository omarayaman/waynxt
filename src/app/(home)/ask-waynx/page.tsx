"use client";

import React, { useState } from "react";
import NavbarHome from "../NavbarHome";
import { Sparkles, Send, CheckCircle2, MapPin, Navigation, ExternalLink, Image as ImageIcon } from "lucide-react";

const SUGGESTED_PROMPTS = [
  "Explain the Pyramids like I'm visiting tomorrow",
  "Top museums for art lovers",
  "Egypt in 1 day itinerary",
  "What should I know before visiting Cairo?",
  "Best cultural experiences in Egypt",
  "Quick history of Ancient Egypt"
];

export default function AskWaynxPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages([
      { role: 'user', content: text },
      { role: 'ai', content: 'mock' } // Mock response
    ]);
    setQuery("");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col">
      <NavbarHome />

      <main className="flex-1 w-full max-w-[800px] mx-auto px-6 pt-32 pb-8 flex flex-col relative z-10">
        {/* Header */}
        <div className="text-center mb-12 shrink-0">
          <h1 className="text-[40px] md:text-[52px] font-medium text-white mb-3">
            Ask WAYNX
          </h1>
          <p className="text-[#888888] text-sm md:text-base">
            Get instant clarity about Egypt — history, museums, culture, and travel guidance.
          </p>
        </div>

        {messages.length === 0 ? (
          // Initial State
          <div className="flex flex-col items-center flex-1 w-full">
            <div className="flex-1 flex flex-col items-center justify-center -mt-10">
              <div className="w-12 h-12 rounded-full bg-[#1A1809] flex items-center justify-center text-[#DFD616] mb-4">
                <Sparkles size={20} />
              </div>
              <p className="text-[#666666] text-sm">
                Ask anything about Egypt to get started
              </p>
            </div>

            <div className="w-full shrink-0 mb-1.5">
              <p className="text-[#666666] text-xs mb-2">Suggested prompts:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="px-4 py-2 rounded-full bg-[#111111] border border-[#222222] text-[#B0B0B0] text-[13px] hover:bg-[#1A1A1A] hover:text-white transition-colors text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Chat State
          <div className="flex-1 w-full flex flex-col gap-6 mb-8 overflow-y-auto custom-scrollbar pr-2">
            {messages.map((msg, index) => (
              msg.role === 'user' ? (
                <div key={index} className="flex justify-end mt-4">
                  <div className="bg-[#DFD616] text-black px-6 py-4 rounded-2xl rounded-tr-sm font-medium shadow-sm">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div key={index} className="bg-[#111111] border border-[#222222] rounded-2xl p-6 md:p-8 flex flex-col gap-6 w-full shadow-lg">
                  <div className="flex items-center gap-2 text-[#00C896] text-sm font-medium">
                    <CheckCircle2 size={16} />
                    <span>Verified</span>
                  </div>
                  
                  <div className="text-gray-300 leading-relaxed text-sm space-y-4">
                    <p>Before visiting Cairo, keep these essentials in mind:</p>
                    <ul className="space-y-2 text-[#B0B0B0]">
                      <li>• Traffic is intense — use Uber or arrange a driver</li>
                      <li>• Dress modestly, especially when visiting religious sites</li>
                      <li>• Bargaining is expected in markets (Khan el-Khalili)</li>
                      <li>• Stay hydrated and avoid tap water</li>
                      <li>• Best time to visit: October to April (cooler weather)</li>
                      <li>• Learn a few Arabic phrases — locals appreciate it</li>
                    </ul>
                    <p>Cairo is incredibly rich in history and culture. Take your time, be patient with the pace, and embrace the experience.</p>
                  </div>

                  {/* Card Widget */}
                  <div className="bg-[#0A0A0A] border border-[#222] rounded-xl flex flex-col md:flex-row overflow-hidden max-w-full">
                    <div className="w-full md:w-[45%] h-48 md:h-auto bg-gradient-to-br from-white to-gray-200 flex flex-col items-center justify-center relative">
                       {/* Placeholder for image */}
                       <ImageIcon size={48} className="text-black" />
                       <p className="text-[10px] text-gray-500 mt-2 absolute max-w-[80%] text-center">WAYNX AI provides verified information. Always check official sources before travel.</p>
                       <div className="absolute bottom-4 flex gap-1.5">
                         <div className="w-4 h-1.5 rounded-full bg-[#DFD616]"></div>
                         <div className="w-1.5 h-1.5 rounded-full bg-black/20"></div>
                         <div className="w-1.5 h-1.5 rounded-full bg-black/20"></div>
                       </div>
                    </div>
                    <div className="p-5 md:p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-white mb-2">Khan el-Khalili</h3>
                      <div className="flex items-center gap-2 text-[#888888] text-sm mb-5">
                        <MapPin size={16} />
                        <span>Historic center of Islamic Cairo</span>
                      </div>
                      <div className="flex items-center gap-2 mb-6 flex-wrap">
                        <div className="flex items-center gap-1.5 text-[11px] text-[#CCCCCC] bg-[#1A1A1A] px-2.5 py-1 rounded-full border border-[#333]">
                          <Navigation size={12} className="text-[#DFD616]" />
                          <span>2.4 km from current location</span>
                        </div>
                        <div className="text-[11px] text-[#DFD616] bg-[#2A280D] px-2.5 py-1 rounded-full border border-[#DFD616]/20 font-medium">
                          Top Rated
                        </div>
                      </div>
                      <button className="w-full mt-auto bg-[#DFD616] hover:bg-[#EAE121] text-black font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
                        <span className="text-sm">View on Maps</span>
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className={`w-full relative shrink-0 ${messages.length > 0 ? "border-t border-[#1a1a1a] pt-6" : ""}`}>
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(query); }}
            className="relative"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about Egypt..."
              className="w-full bg-[#111111] border border-[#222222] rounded-full py-4 pl-6 pr-16 text-sm text-white placeholder:text-[#666666] focus:outline-none focus:border-[#DFD616]/50 transition-colors"
            />
            <button
              type="submit"
              disabled={!query.trim()}
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                query.trim() 
                  ? "bg-[#DFD616] text-black hover:bg-[#EAE121]" 
                  : "bg-[#2A280D] text-[#DFD616]"
              }`}
            >
              <Send size={16} className="ml-0.5" />
            </button>
          </form>
          <div className="text-center mt-4 text-[#555555] text-[10px]">
            <span className="text-[#DFD616] font-semibold">WAYNX</span> AI provides verified information. Always check official sources before travel.
          </div>
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #444444;
        }
      `,
        }}
      />
    </div>
  );
}
