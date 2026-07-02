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
