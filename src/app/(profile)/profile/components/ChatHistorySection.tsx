"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { chatService } from "@/services/chat.service";
import type { ChatSession } from "@/types/chat";
import { Loader2, MessageSquare, Trash2, Plus, ExternalLink } from "lucide-react";
import { Pagination } from "@/components/Pagination";
import { isAxiosError } from "axios";

const SESSIONS_PER_PAGE = 10;

function formatSessionDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: "long" });
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

interface ChatHistorySectionProps {
  totalCount?: number;
}

export function ChatHistorySection({ totalCount }: ChatHistorySectionProps) {
  const router = useRouter();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(totalCount ?? 0);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchSessions = useCallback(async (currentPage: number) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await chatService.getHistory({
        page: currentPage,
        per_page: SESSIONS_PER_PAGE,
      });
      if (response.success && response.data) {
        setSessions(response.data);
        setTotal(response.meta?.total ?? response.data.length);
      }
    } catch {
      setError("Could not load chat history.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions(page);
  }, [page, fetchSessions]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError("");
    try {
      const response = await chatService.deleteSession(id);
      if (!response.success) {
        throw new Error(response.error?.message ?? "Failed to delete");
      }
      setSessions((prev) => prev.filter((s) => s.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      if (sessions.length === 1 && page > 1) {
        setPage(page - 1);
      } else if (sessions.length === 1) {
        fetchSessions(page);
      }
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.error?.message ?? "Failed to delete chat.");
      } else {
        setError("Failed to delete chat.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / SESSIONS_PER_PAGE));

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-base font-medium text-foreground">Chat history</h2>
          <p className="text-sm text-muted mt-1">
            {total > 0
              ? `${total} conversation${total === 1 ? "" : "s"} with Waynx AI`
              : "Your AI travel conversations"}
          </p>
        </div>
        <Link
          href="/ask-waynx"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-accent text-accent-foreground hover:bg-accent-hover rounded-lg transition-colors"
        >
          <Plus size={13} />
          New chat
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 size={24} className="animate-spin text-muted" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface py-16 text-center">
          <MessageSquare size={24} className="text-muted mx-auto mb-3" />
          <p className="text-sm text-muted">No conversations yet</p>
          <p className="text-xs text-muted mt-1 mb-5">Ask Waynx about places, trips, and travel tips.</p>
          <Link
            href="/ask-waynx"
            className="inline-flex px-4 py-2 text-sm bg-accent text-accent-foreground hover:bg-accent-hover rounded-lg transition-colors"
          >
            Start a chat
          </Link>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
            {sessions.map((session) => {
              const messageCount = session.messages?.length ?? 0;
              const isDeleting = deletingId === session.id;

              return (
                <div
                  key={session.id}
                  className="group flex items-center gap-3 px-4 py-3.5 hover:bg-surface-elevated/50 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => router.push(`/ask-waynx?session=${session.id}`)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center shrink-0">
                      <MessageSquare size={14} className="text-muted" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground truncate group-hover:text-foreground transition-colors">
                        {session.title || "Untitled chat"}
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        {formatSessionDate(session.updated_at)}
                        {messageCount > 0 && ` · ${messageCount} message${messageCount === 1 ? "" : "s"}`}
                      </p>
                    </div>
                    <ExternalLink
                      size={14}
                      className="text-muted group-hover:text-foreground shrink-0 transition-colors"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(session.id)}
                    disabled={isDeleting}
                    className="p-2 rounded-lg text-muted hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
                    aria-label="Delete chat"
                  >
                    {isDeleting ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            disabled={isLoading}
          />
        </>
      )}
    </div>
  );
}
