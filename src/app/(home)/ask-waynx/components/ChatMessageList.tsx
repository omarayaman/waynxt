"use client";

import React from "react";
import { ChatMessage } from "@/types/chat";
import { CheckCircle2, Loader2, MapPin } from "lucide-react";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500"></div>
    </div>
  );
}

function StreamedMarkdown({ content, animate = true }: { content: string, animate?: boolean }) {
  // We use the animate flag to optionally append the blur-reveal class
  const animClass = animate ? "animate-blur-reveal" : "";
  
  return (
    <div className="drop-shadow-[0_0_10px_rgba(223,214,22,0.25)] transition-all duration-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <span className={`mb-4 block last:mb-0 ${animClass}`}>{children}</span>,
          ul: ({ children }) => <ul className={`mb-4 list-disc pl-6 ${animClass}`}>{children}</ul>,
          ol: ({ children }) => <ol className={`mb-4 list-decimal pl-6 ${animClass}`}>{children}</ol>,
          li: ({ children }) => <li className={`mb-1 ${animClass}`}>{children}</li>,
          a: ({ href, children }) => (
            <a href={href} className={`text-[#DFD616] hover:underline ${animClass}`} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className={`font-semibold text-white drop-shadow-[0_0_12px_rgba(223,214,22,0.6)] ${animClass}`}>{children}</strong>,
          h1: ({ children }) => <h1 className={`mb-3 mt-4 text-xl font-bold text-white drop-shadow-[0_0_15px_rgba(223,214,22,0.5)] ${animClass}`}>{children}</h1>,
          h2: ({ children }) => <h2 className={`mb-3 mt-4 text-lg font-bold text-white drop-shadow-[0_0_15px_rgba(223,214,22,0.5)] ${animClass}`}>{children}</h2>,
          h3: ({ children }) => <h3 className={`mb-2 mt-3 text-base font-bold text-white drop-shadow-[0_0_12px_rgba(223,214,22,0.5)] ${animClass}`}>{children}</h3>,
          blockquote: ({ children }) => <blockquote className={`border-l-2 border-[#DFD616] pl-4 italic text-gray-400 ${animClass}`}>{children}</blockquote>,
          code: ({ inline, children }) =>
            inline ? (
              <code className={`rounded bg-[#222222] px-1.5 py-0.5 text-[#DFD616] ${animClass}`}>{children}</code>
            ) : (
              <pre className={`mb-4 overflow-x-auto rounded-lg bg-[#222222] p-4 text-[#DFD616] ${animClass}`}>
                <code>{children}</code>
              </pre>
            ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatMessageList({
  messages,
  isLoading,
  messagesEndRef,
}: ChatMessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6 md:px-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        {messages.map((msg) =>
          msg.role === "user" ? (
            <motion.div 
              key={msg.id} 
              className="flex justify-end"
              initial={msg.isNew ? { opacity: 0, y: 10, scale: 0.95, filter: "blur(4px)" } : false}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#DFD616] px-5 py-3.5 text-sm font-medium text-black shadow-sm">
                {msg.content}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={msg.id}
              className="flex w-full flex-col gap-4 rounded-2xl border border-[#222222] bg-[#111111] p-5 md:p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              initial={msg.isNew ? { opacity: 0, y: 20, filter: "blur(12px)" } : false}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {msg.is_verified && (
                <div className="flex items-center gap-2 text-sm font-medium text-[#00C896]">
                  <CheckCircle2 size={16} />
                  <span>Verified</span>
                </div>
              )}

              <div className="text-sm leading-relaxed text-gray-300">
                {msg.isThinking ? (
                  <TypingIndicator />
                ) : (
                  <StreamedMarkdown content={msg.content} animate={!!msg.isNew} />
                )}
              </div>

              {(msg.related_places ?? []).length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-[11px] uppercase tracking-wide text-[#666666]">
                    Related places
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(msg.related_places ?? []).map((place) => (
                      <div
                        key={place}
                        className="flex items-center gap-1.5 rounded-full border border-[#333] bg-[#1A1A1A] px-3 py-1.5 text-xs text-[#CCCCCC]"
                      >
                        <MapPin size={12} className="text-[#DFD616]" />
                        <span>{place}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )
        )}

        {isLoading && (
          <div className="flex items-center gap-2 pl-1 text-sm text-[#888888]">
            <Loader2 size={16} className="animate-spin text-[#DFD616]" />
            <span>WAYNX is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
