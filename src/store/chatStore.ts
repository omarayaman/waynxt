import { create } from 'zustand';
import { ChatSession, ChatMessage } from '@/types/chat';
import { chatService } from '@/services/chat.service';
import { isAxiosError } from 'axios';

interface ChatState {
  sessions: ChatSession[];
  messages: ChatMessage[];
  activeSessionId: string | null;
  activeTitle: string | null;
  isLoading: boolean;
  isLoadingSession: boolean;
  isLoadingHistory: boolean;
  error: string | null;
  isDeletingId: string | null;

  // Actions
  fetchHistory: () => Promise<void>;
  loadSession: (id: string) => Promise<void>;
  sendMessage: (text: string) => Promise<string | void>;
  deleteSession: (id: string) => Promise<void>;
  startNewChat: () => void;
  setError: (error: string | null) => void;
  setActiveSessionId: (id: string | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  messages: [],
  activeSessionId: null,
  activeTitle: null,
  isLoading: false,
  isLoadingSession: false,
  isLoadingHistory: true,
  error: null,
  isDeletingId: null,

  setError: (error) => set({ error }),
  
  setActiveSessionId: (id) => set({ activeSessionId: id }),

  startNewChat: () => set({
    activeSessionId: null,
    activeTitle: null,
    messages: [],
    error: null,
  }),

  fetchHistory: async () => {
    try {
      const response = await chatService.getHistory({ page: 1, per_page: 30 });
      if (response.success && response.data) {
        set({ sessions: response.data });
      }
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      set({ isLoadingHistory: false });
    }
  },

  loadSession: async (id: string) => {
    const { activeSessionId } = get();
    if (activeSessionId === id) return;

    set({ isLoadingSession: true, error: null });

    try {
      const response = await chatService.getSession(id);
      if (!response.success || !response.data) {
        throw new Error("Failed to load chat session");
      }

      set({
        activeSessionId: response.data.id || id,
        activeTitle: response.data.title,
        messages: response.data.messages ?? [],
      });
    } catch (err) {
      set({ activeSessionId: null });
      if (isAxiosError(err)) {
        const message = err.response?.data?.error?.message ?? "Could not load this chat session.";
        set({ error: message });
      } else {
        set({ error: "Could not load this chat session." });
      }
      throw err; // Re-throw so caller can redirect
    } finally {
      set({ isLoadingSession: false });
    }
  },

  deleteSession: async (id: string) => {
    set({ isDeletingId: id, error: null });

    try {
      const response = await chatService.deleteSession(id);
      if (!response.success) {
        throw new Error(response.error?.message ?? "Failed to delete chat");
      }

      set((state) => {
        const newSessions = state.sessions.filter((s) => s.id !== id);
        return { sessions: newSessions };
      });

      const { activeSessionId, startNewChat } = get();
      if (activeSessionId === id) {
        startNewChat();
      }
    } catch (err) {
      if (isAxiosError(err)) {
        set({ error: err.response?.data?.error?.message ?? "Failed to delete chat." });
      } else if (err instanceof Error) {
        set({ error: err.message });
      } else {
        set({ error: "Failed to delete chat." });
      }
    } finally {
      set({ isDeletingId: null });
    }
  },

  sendMessage: async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const { activeSessionId, isLoading } = get();
    if (isLoading) return;

    set({ error: null });

    const optimisticUserMessage: ChatMessage = {
      id: `temp-user-${Date.now()}`,
      role: "user",
      content: trimmed,
      is_verified: false,
      related_places: [],
      isNew: true,
    };
    
    const optimisticAiMessageId = `temp-ai-${Date.now()}`;
    const optimisticAiMessage: ChatMessage = {
      id: optimisticAiMessageId,
      role: "assistant",
      content: "",
      is_verified: false,
      related_places: [],
      isThinking: true,
      isNew: true,
    };

    set((state) => ({
      messages: [...state.messages, optimisticUserMessage, optimisticAiMessage],
      isLoading: true,
    }));

    return new Promise<string | void>((resolve) => {
      let isDone = false;
      const chunkQueue: string[] = [];
      let flushInterval: NodeJS.Timeout | null = null;
      let hasStartedTyping = false;

      flushInterval = setInterval(() => {
        if (chunkQueue.length > 0) {
          if (!hasStartedTyping) {
            hasStartedTyping = true;
            set((state) => ({
              messages: state.messages.map((m) =>
                m.id === optimisticAiMessageId ? { ...m, isThinking: false } : m
              )
            }));
          }

          // Dynamic speed: if queue is large, type faster. Minimum 2 chars per tick.
          const flushCount = Math.max(2, Math.floor(chunkQueue.length / 8));
          let combined = "";
          for (let i = 0; i < flushCount && chunkQueue.length > 0; i++) {
            combined += chunkQueue.shift();
          }

          set((state) => ({
            messages: state.messages.map((m) => 
              m.id === optimisticAiMessageId 
                ? { ...m, content: m.content + combined } 
                : m
            )
          }));
        } else if (isDone && chunkQueue.length === 0) {
          if (flushInterval) clearInterval(flushInterval);
        }
      }, 15); // 15ms for a very fast and smooth typography effect

      chatService.streamMessage({
        sessionId: activeSessionId,
        message: trimmed,
        onChunk: (chunkText) => {
          // Push character by character
          for (const char of chunkText) {
            chunkQueue.push(char);
          }
        },
        onDone: async (data) => {
          isDone = true;
          const responseData = data as { session_id?: string; message_id?: string; data?: { session_id?: string; message_id?: string } };
          let finalSessionId = responseData.session_id || responseData.data?.session_id || activeSessionId;
          const isNewSession = !activeSessionId;

          if (isNewSession && !finalSessionId) {
            try {
              const historyRes = await chatService.getHistory({ page: 1, per_page: 5 });
              if (historyRes.success && historyRes.data && historyRes.data.length > 0) {
                finalSessionId = historyRes.data[0].id;
                set({ sessions: historyRes.data });
              }
            } catch (e) {
              console.error("Failed to fetch new session ID from history", e);
            }
          }

          if (!finalSessionId) {
            finalSessionId = responseData.message_id || responseData.data?.message_id || null;
          }

          if (!finalSessionId) {
             set({ isLoading: false });
             resolve();
             return;
          }

          set({ activeSessionId: finalSessionId });

          if (isNewSession && finalSessionId) {
            const title = trimmed.length > 80 ? `${trimmed.slice(0, 77)}...` : trimmed;
            set({ activeTitle: title });
            
            set((state) => {
              if (state.sessions.some((s) => s.id === finalSessionId)) {
                return {
                  sessions: state.sessions.map((s) =>
                    s.id === finalSessionId ? { ...s, title, updated_at: new Date().toISOString() } : s
                  )
                };
              }
              return {
                sessions: [
                  {
                    id: finalSessionId!,
                    user_id: "",
                    title,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    messages: [],
                  },
                  ...state.sessions,
                ]
              };
            });
          }

          set({ isLoading: false });
          resolve(finalSessionId);
        },
        onError: (err) => {
          isDone = true;
          console.error("Streaming error:", err);
          let errorMessage = "An error occurred while generating the response.";
          
          if (typeof err === "object" && err !== null) {
             const recordErr = err as Record<string, unknown>;
             if ("message" in recordErr && typeof recordErr.message === "string") {
                 errorMessage = recordErr.message;
             } else if ("error" in recordErr) {
                 const errObj = recordErr.error;
                 if (errObj && typeof errObj === "object" && "message" in errObj) {
                     errorMessage = (errObj as Record<string, unknown>).message as string;
                 } else if (typeof errObj === "string") {
                     errorMessage = errObj;
                 }
             }
          }
          
          set((state) => ({
            error: errorMessage,
            isLoading: false,
            messages: state.messages.map((m) =>
              m.id === optimisticAiMessageId
                ? { ...m, content: `Error: ${errorMessage}`, isThinking: false }
                : m
            ),
          }));
          resolve();
        },
      }).catch((err) => {
        set((state) => ({
          messages: state.messages.slice(0, -2),
          isLoading: false,
        }));

        if (isAxiosError(err)) {
          set({ error: err.response?.data?.error?.message ?? "Something went wrong. Please try again." });
        } else if (err instanceof Error) {
          set({ error: err.message });
        } else {
          set({ error: "Something went wrong. Please try again." });
        }
        resolve();
      });
    });
  },
}));
