"use client";

import React from "react";
import { ChatSession } from "@/types/chat";
import { Loader2, MessageSquarePlus, Trash2, X } from "lucide-react";

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  isLoadingHistory: boolean;
  isDeletingId: string | null;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onClose?: () => void;
}

function formatSessionDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: "short" });
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function ChatSidebar({
  sessions,
  activeSessionId,
  isLoadingHistory,
  isDeletingId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onClose,
}: ChatSidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col bg-surface border-r border-border">
      <div className="flex items-center justify-between border-b border-border p-4">
        <button
          onClick={onNewChat}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          <MessageSquarePlus size={16} />
          New chat
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 rounded-lg p-2 text-muted transition-colors hover:bg-surface-elevated hover:text-foreground lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-muted">
          Recent chats
        </p>

        {isLoadingHistory ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={20} className="animate-spin text-accent" />
          </div>
        ) : sessions.length === 0 ? (
          <p className="px-2 py-6 text-center text-xs text-muted">
            No conversations yet. Start a new chat to ask about places or trips.
          </p>
        ) : (
          <ul className="space-y-1">
            {sessions.map((session) => {
              const isActive = activeSessionId === session.id;
              const isDeleting = isDeletingId === session.id;

              return (
                <li key={session.id}>
                  <div
                    className={`group flex items-center gap-1 rounded-xl cursor-pointer transition-colors ${
                      isActive
                        ? "ring-1 bg-footer ring-accent/30"
                        : "bg-surface-elevated/70"
                    }`}
                  >
                    <button
                      onClick={() => onSelectSession(session.id)}
                      className="flex min-w-0 flex-1 flex-col items-start px-3 py-2.5 text-left"
                    >
                      <span
                        className={`w-full truncate text-sm`}
                      >
                        {session.title || "Untitled chat"}
                      </span>
                      <span className="mt-0.5 text-[11px] text-muted">
                        {formatSessionDate(session.updated_at)}
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      disabled={isDeleting}
                      className="mr-2 rounded-lg p-1.5 text-muted opacity-0 transition-all hover:bg-red-500/10 hover:text-red-500 group-hover:opacity-100 disabled:opacity-50"
                      aria-label="Delete chat"
                    >
                      {isDeleting ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
