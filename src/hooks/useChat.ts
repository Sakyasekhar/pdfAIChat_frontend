import { useState, useEffect, useRef } from 'react';
import { Message, UseChatReturn } from '@/types/chat';

export const useChat = (): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingText, setStreamingText] = useState<string>("");
  const [isQuerying, setIsQuerying] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize session ID on first load
  useEffect(() => {
    const storedSessionId = localStorage.getItem("chat_session_id");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = `session_${Date.now()}`;
      localStorage.setItem("chat_session_id", newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  let messageIdCounter = 0;
  const generateMessageId = (): string => {
    messageIdCounter += 1;
    return `${Date.now()}_${messageIdCounter}`;
  };

  const addMessage = (text: string, sender: 'user' | 'bot', options: Partial<Message> = {}): string => {
    const newMessage: Message = {
      id: generateMessageId(),
      text,
      sender,
      ...options
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  };

  const updateMessage = (messageId: string, updates: Partial<Message>): void => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, ...updates } : msg
    ));
  };

  const removeMessage = (messageId: string): void => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const clearMessages = (): void => {
    setMessages([]);
  };

  return {
    messages,
    streamingText,
    setStreamingText,
    isQuerying,
    setIsQuerying,
    sessionId,
    chatEndRef,
    addMessage,
    updateMessage,
    removeMessage,
    clearMessages
  };
};
