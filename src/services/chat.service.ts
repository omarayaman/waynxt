import { api } from '@/lib/api';
import { ApiResponse } from '@/types/places';
import {
  ChatHistoryParams,
  ChatSession,
  normalizeChatMessage,
  RenameSessionParams,
  SendMessageResponse,
} from '@/types/chat';

function normalizeSession(session: ChatSession): ChatSession {
  return {
    ...session,
    messages: (session.messages ?? []).map(normalizeChatMessage),
  };
}

function normalizeSendMessageResponse(data: SendMessageResponse): SendMessageResponse {
  return {
    ...data,
    user_message: normalizeChatMessage(data.user_message),
    ai_response: normalizeChatMessage(data.ai_response),
  };
}

export const chatService = {
  async sendMessage({
    sessionId,
    message,
  }: {
    sessionId?: string | null;
    message: string;
  }): Promise<ApiResponse<SendMessageResponse>> {
    const body: { message: string; session_id?: string } = { message };
    if (sessionId) {
      body.session_id = sessionId;
    }

    const { data } = await api.post<ApiResponse<SendMessageResponse>>('/chat', body);
    if (data.success && data.data) {
      return { ...data, data: normalizeSendMessageResponse(data.data) };
    }
    return data;
  },

  async streamMessage({
    sessionId,
    message,
    onChunk,
    onDone,
    onError,
    signal,
  }: {
    sessionId?: string | null;
    message: string;
    onChunk: (text: string) => void;
    onDone: (data: { session_id?: string; message_id?: string }) => void;
    onError: (err: { message: string }) => void;
    signal?: AbortSignal;
  }): Promise<void> {
    const { default: Cookies } = await import('js-cookie');
    const token = Cookies.get('accessToken');
    const body: { message: string; session_id?: string } = { message };
    if (sessionId) {
      body.session_id = sessionId;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
        signal,
      });

      if (!response.ok) {
        let errorMsg = 'Failed to send message';
        try {
          const errData = await response.json();
          errorMsg = errData?.error?.message || errorMsg;
        } catch {}
        onError({ message: errorMsg });
        return;
      }

      if (!response.body) {
        onError({ message: 'No response body' });
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (!dataStr) continue;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.error || parsed.event === 'error') {
                onError(parsed);
              } else if (parsed.event === 'done' || parsed.session_id) {
                onDone(parsed);
              } else if (parsed.event === 'chunk' || typeof parsed.text === 'string') {
                onChunk(parsed.text || '');
              }
            } catch (e) {
              // ignore parse error
            }
          }
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === 'AbortError') return;
      onError({ message: error.message || 'Stream failed' });
    }
  },

  async getHistory({
    page = 1,
    per_page = 20,
  }: ChatHistoryParams = {}): Promise<ApiResponse<ChatSession[]>> {
    const { data } = await api.get<ApiResponse<ChatSession[]>>('/chat/history', {
      params: { page, per_page },
    });
    if (data.success && data.data) {
      return { ...data, data: data.data.map(normalizeSession) };
    }
    return data;
  },

  async getSession(id: string): Promise<ApiResponse<ChatSession>> {
    const { data } = await api.get<ApiResponse<ChatSession>>(`/chat/${id}`);
    if (data.success && data.data) {
      return { ...data, data: normalizeSession(data.data) };
    }
    return data;
  },

  async renameSession({ id, title }: RenameSessionParams): Promise<ApiResponse<{ message: string }>> {
    const { data } = await api.put<ApiResponse<{ message: string }>>(`/chat/${id}`, { title });
    return data;
  },

  async deleteSession(id: string): Promise<ApiResponse<{ message: string }>> {
    const { data } = await api.delete<ApiResponse<{ message: string }>>(`/chat/${id}`);
    return data;
  },
};
