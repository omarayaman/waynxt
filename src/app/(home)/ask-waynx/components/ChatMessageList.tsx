"use client";

import React from "react";
import { ChatMessage } from "@/types/chat";
import { CheckCircle2, Loader2, MapPin } from "lucide-react";

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
            <div key={msg.id} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#DFD616] px-5 py-3.5 text-sm font-medium text-black shadow-sm">
                {msg.content}
              </div>
            </div>
          ) : (
            <div
              key={msg.id}
              className="flex w-full flex-col gap-4 rounded-2xl border border-[#222222] bg-[#111111] p-5 md:p-6"
            >
              {msg.is_verified && (
                <div className="flex items-center gap-2 text-sm font-medium text-[#00C896]">
                  <CheckCircle2 size={16} />
                  <span>Verified</span>
                </div>
              )}

              <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">
                {msg.content}
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
            </div>
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
