"use client";

import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NavbarHome from "../NavbarHome";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { chatService } from "@/services/chat.service";
import { ChatMessage, ChatSession } from "@/types/chat";
import ChatSidebar from "./components/ChatSidebar";
import ChatEmptyState from "./components/ChatEmptyState";
import ChatMessageList from "./components/ChatMessageList";
import ChatInput from "./components/ChatInput";
import { AlertCircle, Loader2, PanelLeft, Sparkles } from "lucide-react";
import { isAxiosError } from "axios";

function AskWaynxContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasAutoSentRef = useRef(false);
  const handleSendRef = useRef<(text: string) => Promise<void>>(async () => {});

  const sessionFromUrl = searchParams.get("session");
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loadedSessionId, setLoadedSessionId] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const response = await chatService.getHistory({ page: 1, per_page: 30 });
        if (!cancelled && response.success && response.data) {
          setSessions(response.data);
        }
      } catch {
        // History failure shouldn't block chatting
      } finally {
        if (!cancelled) {
          setIsLoadingHistory(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const refreshHistory = useCallback(async () => {
    try {
      const response = await chatService.getHistory({ page: 1, per_page: 30 });
      if (response.success && response.data) {
        setSessions(response.data);
      }
    } catch {
      // Silent refresh failure is acceptable
    }
  }, []);

  const loadSession = useCallback(async (id: string) => {
    if (loadedSessionId === id) return;

    setIsLoadingSession(true);
    setError(null);

    try {
      const response = await chatService.getSession(id);
      if (!response.success || !response.data) {
        throw new Error("Failed to load chat session");
      }

      setLoadedSessionId(response.data.id);
      setSessionId(response.data.id);
      setActiveTitle(response.data.title);
      setMessages(response.data.messages ?? []);
      router.replace(`/ask-waynx?session=${response.data.id}`, { scroll: false });
    } catch (err) {
      setLoadedSessionId(null);
      router.replace("/ask-waynx", { scroll: false });
      if (isAxiosError(err)) {
        const message =
          err.response?.data?.error?.message ?? "Could not load this chat session.";
        setError(message);
      } else {
        setError("Could not load this chat session.");
      }
    } finally {
      setIsLoadingSession(false);
    }
  }, [loadedSessionId, router]);

  useEffect(() => {
    if (!sessionFromUrl || sessionFromUrl === loadedSessionId) return;

    let cancelled = false;

    void (async () => {
      try {
        const response = await chatService.getSession(sessionFromUrl);
        if (cancelled) return;

        if (!response.success || !response.data) {
          throw new Error("Failed to load chat session");
        }

        setLoadedSessionId(response.data.id);
        setSessionId(response.data.id);
        setActiveTitle(response.data.title);
        setMessages(response.data.messages ?? []);
      } catch (err) {
        if (cancelled) return;

        setLoadedSessionId(null);
        router.replace("/ask-waynx", { scroll: false });
        if (isAxiosError(err)) {
          const message =
            err.response?.data?.error?.message ?? "Could not load this chat session.";
          setError(message);
        } else {
          setError("Could not load this chat session.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionFromUrl, loadedSessionId, router]);

  const handleNewChat = () => {
    setLoadedSessionId(null);
    setMessages([]);
    setSessionId(null);
    setActiveTitle(null);
    setError(null);
    setQuery("");
    setIsSidebarOpen(false);
    router.replace("/ask-waynx", { scroll: false });
  };

  const handleSelectSession = (id: string) => {
    if (id === sessionId) {
      setIsSidebarOpen(false);
      return;
    }
    loadSession(id);
    setIsSidebarOpen(false);
  };

  const handleDeleteSession = async (id: string) => {
    setIsDeletingId(id);
    setError(null);

    try {
      const response = await chatService.deleteSession(id);
      if (!response.success) {
        throw new Error(response.error?.message ?? "Failed to delete chat");
      }

      setSessions((prev) => prev.filter((s) => s.id !== id));

      if (sessionId === id) {
        handleNewChat();
      }
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.error?.message ?? "Failed to delete chat.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to delete chat.");
      }
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    setQuery("");

    const optimisticUserMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: trimmed,
      is_verified: false,
      related_places: [],
    };

    setMessages((prev) => [...prev, optimisticUserMessage]);
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage({
        sessionId,
        message: trimmed,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error?.message ?? "Failed to send message");
      }

      const { session_id, user_message, ai_response } = response.data;
      const isNewSession = !sessionId;

      setLoadedSessionId(session_id);
      setSessionId(session_id);
      setMessages((prev) => [...prev.slice(0, -1), user_message, ai_response]);

      if (isNewSession) {
        const title = trimmed.length > 80 ? `${trimmed.slice(0, 77)}...` : trimmed;
        setActiveTitle(title);
        setSessions((prev) => [
          {
            id: session_id,
            user_id: "",
            title,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            messages: [],
          },
          ...prev,
        ]);
        router.replace(`/ask-waynx?session=${session_id}`, { scroll: false });
      } else {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === session_id
              ? { ...s, updated_at: new Date().toISOString() }
              : s
          )
        );
      }

      await refreshHistory();
    } catch (err) {
      setMessages((prev) => prev.slice(0, -1));

      if (isAxiosError(err)) {
        const message =
          err.response?.data?.error?.message ??
          "Something went wrong. Please try again.";
        setError(message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  handleSendRef.current = handleSend;

  useEffect(() => {
    const q = searchParams.get("q")?.trim();
    if (!q || hasAutoSentRef.current || sessionFromUrl) return;

    hasAutoSentRef.current = true;
    router.replace("/ask-waynx", { scroll: false });
    void handleSendRef.current(q);
  }, [searchParams, sessionFromUrl, router]);

  const isLoadingUrlSession = Boolean(
    sessionFromUrl && loadedSessionId !== sessionFromUrl
  );
  const showSessionLoading = isLoadingSession || isLoadingUrlSession;
  const showEmptyState = !showSessionLoading && messages.length === 0;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#050505] text-white">
      <NavbarHome />

      <div className="flex flex-1 overflow-hidden pt-[110px]">
        <div className="hidden w-[280px] shrink-0 border-r border-[#222222] lg:block">
          <ChatSidebar
            sessions={sessions}
            activeSessionId={sessionId}
            isLoadingHistory={isLoadingHistory}
            isDeletingId={isDeletingId}
            onNewChat={handleNewChat}
            onSelectSession={handleSelectSession}
            onDeleteSession={handleDeleteSession}
          />
        </div>

        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              className="absolute inset-0 bg-black/60"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar overlay"
            />
            <div className="absolute bottom-0 left-0 top-[110px] w-[min(100%,280px)] border-r border-[#222222]">
              <ChatSidebar
                sessions={sessions}
                activeSessionId={sessionId}
                isLoadingHistory={isLoadingHistory}
                isDeletingId={isDeletingId}
                onNewChat={handleNewChat}
                onSelectSession={handleSelectSession}
                onDeleteSession={handleDeleteSession}
                onClose={() => setIsSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center gap-3 border-b border-[#1A1A1A] px-4 py-3 md:px-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-lg p-2 text-[#888888] hover:bg-[#1A1A1A] hover:text-white lg:hidden"
              aria-label="Open chat history"
            >
              <PanelLeft size={20} />
            </button>

            <div className="flex min-w-0 flex-1 items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1A1809] text-[#DFD616]">
                <Sparkles size={14} />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-sm font-medium text-white md:text-base">
                  {activeTitle ?? "New chat"}
                </h1>
                <p className="truncate text-[11px] text-[#666666]">
                  Ask about places, trips, and travel in Egypt
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mx-4 mt-3 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 md:mx-6">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {showSessionLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <Loader2 size={28} className="animate-spin text-[#DFD616]" />
            </div>
          ) : showEmptyState ? (
            <ChatEmptyState
              onSelectPrompt={handleSend}
              disabled={isLoading}
            />
          ) : (
            <ChatMessageList
              messages={messages}
              isLoading={isLoading}
              messagesEndRef={messagesEndRef}
            />
          )}

          <ChatInput
            value={query}
            onChange={setQuery}
            onSubmit={() => handleSend(query)}
            disabled={showSessionLoading}
            isLoading={isLoading}
          />
        </main>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444444; }
      `,
        }}
      />
    </div>
  );
}

export default function AskWaynxPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center bg-[#050505]">
            <Loader2 size={28} className="animate-spin text-[#DFD616]" />
          </div>
        }
      >
        <AskWaynxContent />
      </Suspense>
    </ProtectedRoute>
  );
}
