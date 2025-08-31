// Message types
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  isStreaming?: boolean;
  isFile?: boolean;
  isUploading?: boolean;
  fileUrl?: string;
}

// Chat history format for API
export interface ChatHistoryItem {
  human?: string;
  AI?: string;
}

// Chat service response types
export interface UploadPDFResponse {
  message: string;
  session_id: string;
}

// Chat hook return type
export interface UseChatReturn {
  messages: Message[];
  streamingText: string;
  setStreamingText: (text: string) => void;
  isQuerying: boolean;
  setIsQuerying: (querying: boolean) => void;
  sessionId: string;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  addMessage: (text: string, sender: 'user' | 'bot', options?: Partial<Message>) => string;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  removeMessage: (messageId: string) => void;
  clearMessages: () => void;
}

// Component prop types
export interface MessageProps {
  message: Message;
  streamingText: string;
  isMobile: boolean;
}

export interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  hasUploadedPDF: boolean;
  isUploading: boolean;
  isQuerying: boolean;
  onSendMessage: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileButtonClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isMobile: boolean;
}
