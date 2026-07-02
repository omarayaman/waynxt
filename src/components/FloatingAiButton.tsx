"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles, Send } from "lucide-react";

const HIDDEN_PATHS = ["/planner", "/ask-waynx"];

export default function FloatingAiButton() {
  const pathname = usePathname();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [expanded, setExpanded] = useState(false);
  const [question, setQuestion] = useState("");

  useEffect(() => {
    if (!expanded) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expanded]);

  useEffect(() => {
    if (expanded) {
      inputRef.current?.focus();
    }
  }, [expanded]);

  if (HIDDEN_PATHS.some((path) => pathname.startsWith(path))) {
    return null;
  }

  const submitQuestion = () => {
    const q = question.trim();
    if (!q) return;
    setQuestion("");
    setExpanded(false);
    router.push(`/ask-waynx?q=${encodeURIComponent(q)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuestion();
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-50"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div
        className={`flex items-center gap-2 rounded-full border transition-all duration-200 ${
          expanded
            ? "border-[#333] bg-[#111] pl-4 pr-1.5 py-1.5 shadow-lg"
            : "border-transparent bg-transparent p-0"
        }`}
      >
        <form
          onSubmit={handleSubmit}
          className={`overflow-hidden transition-all duration-200 ${
            expanded ? "w-[min(72vw,260px)] opacity-100" : "w-0 opacity-0 pointer-events-none"
          }`}
        >
          <input
            ref={inputRef}
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything..."
            className="w-full bg-transparent text-sm text-white placeholder:text-[#555] focus:outline-none"
            tabIndex={expanded ? 0 : -1}
          />
        </form>

        {expanded && question.trim() && (
          <button
            type="button"
            onClick={submitQuestion}
            className="shrink-0 w-8 h-8 rounded-full bg-[#DFD616] text-[#0a0a0a] flex items-center justify-center hover:bg-[#EAE121] transition-colors"
            aria-label="Send question"
          >
            <Send size={14} />
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            if (!expanded) {
              setExpanded(true);
              return;
            }
            if (!question.trim()) {
              router.push("/ask-waynx");
            }
          }}
          aria-label="Ask Waynx AI"
          className="shrink-0 w-11 h-11 rounded-full bg-[#DFD616] text-[#0a0a0a] flex items-center justify-center shadow-md hover:bg-[#EAE121] transition-colors"
        >
          <Sparkles size={18} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
