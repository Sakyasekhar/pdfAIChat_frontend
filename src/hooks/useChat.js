import { useState, useEffect, useRef } from 'react';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [streamingText, setStreamingText] = useState("");
  const [isQuerying, setIsQuerying] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const chatEndRef = useRef(null);

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
  const generateMessageId = () => {
    messageIdCounter += 1;
    return `${Date.now()}_${messageIdCounter}`;
  };

  const addMessage = (text, sender, options = {}) => {
    const newMessage = {
      id: generateMessageId(),
      text,
      sender,
      ...options
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  };

  const updateMessage = (messageId, updates) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, ...updates } : msg
    ));
  };

  const removeMessage = (messageId) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const clearMessages = () => {
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