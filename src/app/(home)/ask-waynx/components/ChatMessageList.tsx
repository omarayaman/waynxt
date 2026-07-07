"use client";

import React, { useState } from "react";
import { ChatMessage } from "@/types/chat";
import { Check, CheckCircle2, Copy, RefreshCw, Share2, MapPin, Sparkles } from "lucide-react";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';

function MessageActionBar({ msg, onReload }: { msg: ChatMessage, onReload?: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Waynx AI Response",
        text: msg.content,
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="mt-2 flex items-center gap-3 text-[#666666]">
      <button 
        onClick={handleCopy}
        className="group relative flex items-center gap-1.5 rounded-md p-1.5 transition-colors hover:text-white"
        aria-label="Copy response"
      >
        {copied ? <Check size={14} className="text-[#00C896]" /> : <Copy size={14} />}
        <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-[#1A1A1A] px-2 py-1 text-[10px] text-white whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
          {copied ? "Copied!" : "Copy"}
        </span>
      </button>
      <button 
        onClick={handleShare}
        className="group relative flex items-center gap-1.5 rounded-md p-1.5 transition-colors hover:text-white"
        aria-label="Share response"
      >
        <Share2 size={14} />
        <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-[#1A1A1A] px-2 py-1 text-[10px] text-white whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
          Share
        </span>
      </button>
      {onReload && (
        <button 
          onClick={onReload}
          className="group relative flex items-center gap-1.5 rounded-md p-1.5 transition-colors hover:text-white"
          aria-label="Regenerate response"
        >
          <RefreshCw size={14} />
          <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-[#1A1A1A] px-2 py-1 text-[10px] text-white whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
            Reload
          </span>
        </button>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-2 px-1">
      <div className="h-2 w-2 animate-bounce rounded-full bg-[#DFD616] [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-[#DFD616] [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-[#DFD616]"></div>
    </div>
  );
}

function StreamedMarkdown({ content }: { content: string }) {
  return (
    <div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <span className="mb-4 block last:mb-0">{children}</span>,
          ul: ({ children }) => <ul className="mb-4 list-disc pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="mb-4 list-decimal pl-6">{children}</ol>,
          li: ({ children }) => <li className="mb-1">{children}</li>,
          a: ({ href, children }) => (
            <a href={href} className="text-[#DFD616] hover:underline" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
          h1: ({ children }) => <h1 className="mb-3 mt-4 text-xl font-bold text-white">{children}</h1>,
          h2: ({ children }) => <h2 className="mb-3 mt-4 text-lg font-bold text-white">{children}</h2>,
          h3: ({ children }) => <h3 className="mb-2 mt-3 text-base font-bold text-white">{children}</h3>,
          blockquote: ({ children }) => <blockquote className="border-l-2 border-[#DFD616]/40 pl-4 italic text-[#999999]">{children}</blockquote>,
          pre: ({ children }) => (
            <pre className="mb-4 overflow-x-auto rounded-lg border border-white/6 bg-white/3 p-4 text-[#DFD616]">
              {children}
            </pre>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <code className="rounded bg-white/5 px-1.5 py-0.5 text-[#DFD616]" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

interface ChatMessageListProps {
  messages: ChatMessage[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onReload?: (msg: ChatMessage) => void;
}

export default function ChatMessageList({
  messages,
  messagesEndRef,
  onReload,
}: ChatMessageListProps) {
  return (
    <div className="px-4 py-6 pb-28 md:px-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {messages.map((msg) =>
          msg.role === "user" ? (
            <motion.div 
              key={msg.id} 
              className="flex justify-end"
              initial={msg.isNew ? { opacity: 0, y: 6 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="max-w-[85%] rounded-full rounded-br-md bg-[#DFD616] px-5 py-3 text-sm font-medium text-black">
                {msg.content}
              </div>
            </motion.div>
          ) : msg.isThinking ? (
            <div
              key={msg.id + "-thinking"}
              className="flex items-start gap-3"
            >
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#DFD616]/15 text-[#DFD616]/80">
                <Sparkles size={14} />
              </div>
              <TypingIndicator />
            </div>
          ) : (
            <motion.div
              key={msg.id}
              className="flex w-full items-start gap-3"
              initial={msg.isNew ? { opacity: 0, y: 6 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#DFD616]/15 text-[#DFD616]/80">
                <Sparkles size={14} />
              </div>

              <div className="min-w-0 flex-1">
                {msg.is_verified && (
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-[#00C896]">
                    <CheckCircle2 size={14} />
                    <span>Verified</span>
                  </div>
                )}

                <div className="text-sm leading-relaxed text-[#CCCCCC]">
                  <StreamedMarkdown content={msg.content} />
                </div>

                <div className="mt-3">
                  <MessageActionBar msg={msg} onReload={onReload ? () => onReload(msg) : undefined} />
                </div>

                {(msg.related_places ?? []).length > 0 && (
                  <div className="mt-4 flex flex-col gap-2">
                    <p className="text-[11px] uppercase tracking-wide text-[#666666]">
                      Related places
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(msg.related_places ?? []).map((place) => (
                        <div
                          key={place}
                          className="flex items-center gap-1.5 rounded-full border border-white/8 px-3 py-1.5 text-xs text-[#BBBBBB]"
                        >
                          <MapPin size={12} className="text-[#DFD616]" />
                          <span>{place}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
