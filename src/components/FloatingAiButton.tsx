"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Send } from "lucide-react";

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
    if (!q) {
      router.push("/ask-waynx");
      return;
    }
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
      className="fixed bottom-8 right-4 z-50 group"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div
        className={`flex items-center h-14 rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          expanded
            ? "bg-[#111] border border-[#333] pl-5 pr-1.5 shadow-xl translate-y-0"
            : "bg-accent border border-transparent px-2 shadow-[0_4px_20px_color-mix(in srgb, var(--accent) %, transparent)] hover:shadow-[0_4px_25px_color-mix(in srgb, var(--accent) %, transparent)] hover:-translate-y-1 cursor-pointer"
        }`}
        onClick={() => {
          if (!expanded) {
            router.push("/ask-waynx");
          }
        }}
      >
        <form
          onSubmit={handleSubmit}
          className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center h-full ${
            expanded ? "w-[min(70vw,240px)] opacity-100 mr-2" : "w-0 opacity-0 mr-0 pointer-events-none"
          }`}
        >
          <input
            ref={inputRef}
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything..."
            className="w-full bg-transparent text-[15px] text-white placeholder:text-[#666] focus:outline-none"
            tabIndex={expanded ? 0 : -1}
          />
        </form>

        <button
          type="button"
          onClick={(e) => {
            if (expanded) {
              e.stopPropagation();
              if (question.trim()) submitQuestion();
              else router.push("/ask-waynx");
            }
          }}
          aria-label="Ask Waynx AI"
          className={`shrink-0 flex items-center justify-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            expanded
              ? "w-11 h-11 bg-accent text-accent-foreground hover:bg-accent-hover"
              : "w-10 h-10 bg-transparent text-accent-foreground"
          }`}
        >
          <div className="relative flex items-center justify-center w-full h-full">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className={`absolute transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                expanded && question.trim()
                  ? "opacity-0 scale-50 rotate-90"
                  : `opacity-100 scale-100 ${expanded ? "-rotate-90" : "group-hover:rotate-90"}`
              }`}
            >
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
              <path d="M20 3L20.8 5.2L23 6L20.8 6.8L20 9L19.2 6.8L17 6L19.2 5.2L20 3Z" />
            </svg>

            <Send
              size={18}
              className={`absolute transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                expanded && question.trim()
                  ? "opacity-100 scale-100 rotate-0"
                  : "opacity-0 scale-50 -rotate-90"
              }`}
            />
          </div>
        </button>
      </div>
    </div>
  );
}
