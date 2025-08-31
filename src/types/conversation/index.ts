// Conversation types
export interface Conversation {
  conversation_id: string;
  title: string;
  is_pinned: boolean;
  updated_at: string;
}

export interface ConversationMessage {
  message: string;
  role: 'user' | 'ai' | 'system';
  timestamp: string;
}

export interface ConversationHistory {
  messages: ConversationMessage[];
}

export interface ConversationsResponse {
  conversations: Conversation[];
}

export interface AddMessageRequest {
  message: string;
  sender: 'user' | 'ai' | 'system';
}

export interface NewConversationRequest {
  title: string;
  model_used?: string;
}

export interface NewConversationResponse {
  conversation_id: string;
  title: string;
  model_used?: string;
  created_at: string;
  is_pinned: boolean;
}

// Sidebar types
export interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  width: number;
  onWidthChange: (width: number) => void;
  children: React.ReactNode;
}

export interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onConversationSelect: (conversationId: string) => void;
  onNewChat: () => void;
  onDeleteConversation?: (conversationId: string) => void;
  onTogglePin?: (conversationId: string, isPinned: boolean) => void;
  isLoading: boolean;
}
