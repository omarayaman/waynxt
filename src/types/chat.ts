export interface ChatMessage {
  id: string;
  session_id?: string;
  role: 'user' | 'assistant';
  content: string;
  is_verified: boolean;
  related_places: string[] | null;
  created_at?: string;
  isThinking?: boolean;
  isNew?: boolean;
}

export function normalizeChatMessage(message: ChatMessage): ChatMessage {
  return {
    ...message,
    related_places: message.related_places ?? [],
  };
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
}

export interface SendMessageResponse {
  session_id: string;
  user_message: ChatMessage;
  ai_response: ChatMessage;
}

export interface ChatHistoryParams {
  page?: number;
  per_page?: number;
}

export interface RenameSessionParams {
  id: string;
  title: string;
}
