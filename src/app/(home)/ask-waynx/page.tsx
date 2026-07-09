"use client";

import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ChatMessage } from "@/types/chat";
import ChatSidebar from "./components/ChatSidebar";
import ChatEmptyState from "./components/ChatEmptyState";
import ChatMessageList from "./components/ChatMessageList";
import ChatInput from "./components/ChatInput";
import AskWaynxNavbar from "./components/AskWaynxNavbar";
import { AlertCircle, Loader2 } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import PlannerBackground from "@/app/planner/components/PlannerBackground";

function AskWaynxContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasAutoSentRef = useRef(false);
  const skipUrlSyncRef = useRef(false);
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
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    if (!isLoading && !isLoadingSession) {
      requestAnimationFrame(() => {
        inputRef.current?.focus({ preventScroll: true });
      });
    }
  }, [isLoading, isLoadingSession]);

  // Initial history load
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // URL syncing logic
  useEffect(() => {
    if (skipUrlSyncRef.current) {
      if (!sessionFromUrl) {
        skipUrlSyncRef.current = false;
      }
      return;
    }

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
    if (!sessionId && !sessionFromUrl && messages.length === 0) {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      return;
    }

    skipUrlSyncRef.current = true;
    startNewChatStore();
    router.replace("/ask-waynx", { scroll: false });
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  }, [router, startNewChatStore, sessionId, sessionFromUrl, messages.length]);

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

  const chatTitle =
    activeTitle ||
    sessions.find((s) => s.id === sessionId)?.title ||
    "New chat";

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface-elevated/30 dark:bg-background text-foreground">
      <AskWaynxNavbar
        title={chatTitle}
        isDesktopSidebarOpen={isDesktopSidebarOpen}
        onOpenMobileSidebar={() => setIsSidebarOpen(true)}
        onToggleDesktopSidebar={() =>
          setIsDesktopSidebarOpen((prev) => !prev)
        }
      />

      <div className="flex flex-1 overflow-hidden">
        <div 
          className={`relative z-[60] hidden shrink-0 border-border transition-all duration-300 ease-in-out lg:block ${isDesktopSidebarOpen ? "w-[280px] border-r opacity-100" : "w-0 border-r-0 opacity-0 overflow-hidden"}`}
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
              className="absolute inset-0 bg-[var(--overlay)]"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar overlay"
            />
            <div className="absolute bottom-0 left-0 top-0 w-[min(100%,280px)] border-r border-border">
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

        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          {error && (
            <div className="relative z-10 mx-4 mt-3 flex shrink-0 items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300 md:mx-6">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {showSessionLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <Loader2 size={28} className="animate-spin text-accent" />
            </div>
          ) : showEmptyState ? (
            <ChatEmptyState
              inputRef={inputRef}
              value={query}
              onChange={setQuery}
              onSubmit={() => handleSend(query)}
              onSelectPrompt={handleSend}
              isLoading={isLoading}
            />
          ) : (
            <>
              <div
                ref={messagesContainerRef}
                className="chat-scroll min-h-0 flex-1 overflow-y-auto"
              >
                <ChatMessageList
                  messages={messages}
                  messagesEndRef={messagesEndRef}
                  onReload={handleRegenerate}
                />
              </div>

              <ChatInput
                variant="floating"
                inputRef={inputRef}
                value={query}
                onChange={setQuery}
                onSubmit={() => handleSend(query)}
                isLoading={isLoading}
              />
            </>
          )}
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
          <div className="flex h-screen items-center justify-center bg-background">
            <Loader2 size={28} className="animate-spin text-accent" />
          </div>
        }
      >
        <AskWaynxContent />
      </Suspense>
    </ProtectedRoute>
  );
}
