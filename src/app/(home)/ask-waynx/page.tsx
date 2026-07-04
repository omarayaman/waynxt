"use client";

import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NavbarHome from "../NavbarHome";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ChatMessage } from "@/types/chat";
import ChatSidebar from "./components/ChatSidebar";
import ChatEmptyState from "./components/ChatEmptyState";
import ChatMessageList from "./components/ChatMessageList";
import ChatInput from "./components/ChatInput";
import { AlertCircle, Loader2, PanelLeft, Sparkles } from "lucide-react";
import { useChatStore } from "@/store/chatStore";

function AskWaynxContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasAutoSentRef = useRef(false);
  const handleSendRef = useRef<(text: string) => Promise<void>>(async () => {});

  const sessionFromUrl = searchParams.get("session");
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  // Use granular selectors to prevent over-rendering!
  const messages = useChatStore((state) => state.messages);
  const sessions = useChatStore((state) => state.sessions);
  const sessionId = useChatStore((state) => state.activeSessionId);
  const activeTitle = useChatStore((state) => state.activeTitle);
  const isLoading = useChatStore((state) => state.isLoading);
  const isLoadingSession = useChatStore((state) => state.isLoadingSession);
  const isLoadingHistory = useChatStore((state) => state.isLoadingHistory);
  const error = useChatStore((state) => state.error);
  const isDeletingId = useChatStore((state) => state.isDeletingId);

  const fetchHistory = useChatStore((state) => state.fetchHistory);
  const loadSessionStore = useChatStore((state) => state.loadSession);
  const sendMessageStore = useChatStore((state) => state.sendMessage);
  const deleteSessionStore = useChatStore((state) => state.deleteSession);
  const startNewChatStore = useChatStore((state) => state.startNewChat);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Initial history load
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // URL syncing logic
  useEffect(() => {
    if (!sessionFromUrl || sessionFromUrl === sessionId) {
      return;
    }
    
    if (sessionFromUrl === "undefined" || sessionFromUrl === "null") {
      router.replace("/ask-waynx", { scroll: false });
      return;
    }

    loadSessionStore(sessionFromUrl).catch(() => {
      router.replace("/ask-waynx", { scroll: false });
    });
  }, [sessionFromUrl, sessionId, loadSessionStore, router]);

  const handleNewChat = useCallback(() => {
    router.replace("/ask-waynx", { scroll: false });
    startNewChatStore();
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  }, [router, startNewChatStore]);

  const handleSelectSession = useCallback(
    (id: string) => {
      router.replace(`/ask-waynx?session=${id}`, { scroll: false });
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
    },
    [router]
  );

  const handleDeleteSession = async (id: string) => {
    await deleteSessionStore(id);
    if (sessionId === id) {
      router.replace("/ask-waynx", { scroll: false });
    }
  };

  const handleSend = useCallback(
    async (text: string) => {
      setQuery("");
      const newSessionId = await sendMessageStore(text);
      if (newSessionId && newSessionId !== sessionFromUrl) {
        router.replace(`/ask-waynx?session=${newSessionId}`, { scroll: false });
      }
    },
    [sendMessageStore, sessionFromUrl, router]
  );

  useEffect(() => {
    handleSendRef.current = handleSend;
  }, [handleSend]);

  // Auto-send query param
  useEffect(() => {
    const q = searchParams.get("q")?.trim();
    if (!q || hasAutoSentRef.current || sessionFromUrl) return;

    hasAutoSentRef.current = true;
    router.replace("/ask-waynx", { scroll: false });
    void handleSendRef.current(q);
  }, [searchParams, sessionFromUrl, router]);

  const isLoadingUrlSession = Boolean(
    sessionFromUrl && sessionId !== sessionFromUrl
  );
  const showSessionLoading = isLoadingSession || isLoadingUrlSession;
  const showEmptyState = !showSessionLoading && messages.length === 0;

  const handleRegenerate = async (msg: ChatMessage) => {
    const msgIndex = messages.findIndex((m) => m.id === msg.id);
    if (msgIndex <= 0) return;
    
    let userMessageContent = "";
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        userMessageContent = messages[i].content;
        break;
      }
    }
    
    if (userMessageContent) {
      await handleSend(userMessageContent);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#050505] text-white">
      <NavbarHome />

      <div className="flex flex-1 overflow-hidden pt-[110px]">
        <div 
          className={`relative z-[60] hidden shrink-0 border-[#222222] transition-all duration-300 ease-in-out lg:block ${isDesktopSidebarOpen ? "w-[280px] border-r opacity-100" : "w-0 border-r-0 opacity-0 overflow-hidden"}`}
        >
          <div className="h-full w-[280px]">
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
        </div>

        {isSidebarOpen && (
          <div className="fixed inset-0 z-[70] lg:hidden">
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
          <div className="relative z-[60] flex shrink-0 items-center gap-3 border-b border-[#1A1A1A] px-4 py-3 md:px-6">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsSidebarOpen(true);
              }}
              className="relative z-[9999] rounded-lg p-2 text-[#888888] hover:bg-[#1A1A1A] hover:text-white lg:hidden cursor-pointer"
              aria-label="Open chat history"
            >
              <PanelLeft size={20} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDesktopSidebarOpen((prev) => !prev);
              }}
              className="relative z-[9999] hidden rounded-lg p-2 text-[#888888] hover:bg-[#1A1A1A] hover:text-white lg:block transition-colors cursor-pointer"
              aria-label="Toggle chat history"
              title={isDesktopSidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              <PanelLeft size={20} />
            </button>

            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Sparkles size={18} className="text-[#DFD616] shrink-0" />
              <div className="min-w-0">
                <h1 className="truncate text-sm font-medium text-white md:text-base">
                  {activeTitle || sessions.find((s) => s.id === sessionId)?.title || "New chat"}
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
              onReload={handleRegenerate}
            />
          )}

          <div className="mt-auto p-4 md:p-6">
            <div className="mx-auto max-w-3xl">
              <ChatInput
                value={query}
                onChange={setQuery}
                onSubmit={() => handleSend(query)}
                disabled={isLoading}
                isLoading={isLoading}
              />
            </div>
          </div>
        </main>
      </div>
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
