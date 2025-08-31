"use client";
import React, { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useChat } from "../hooks/useChat";
import { ChatService } from "../services/chat";
import { ConversationService } from "../services/conversation";
import Message from "../components/Message";
import ChatInput from "../components/ChatInput";
import ConversationList from "../components/ConversationList";
import HoverSidebar from "../components/HoverSidebar";
import ChatSkeleton from "../components/ChatSkeleton";
import { useAuthContext } from "../contexts/auth/AuthContext";
import { useThemeContext } from "../contexts/theme/ThemeContext";
import { ChatHistoryItem } from "@/types/chat";
import { Conversation } from "@/types/conversation";
import Link from "next/link";

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, user, logout } = useAuthContext();
  const { currentTheme, switchTheme } = useThemeContext();
  const {
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
  } = useChat();

  const [input, setInput] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [hasUploadedPDF, setHasUploadedPDF] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState<boolean>(true);
  const [isLoadingChatHistory, setIsLoadingChatHistory] = useState<boolean>(false);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [sidebarWidth, setSidebarWidth] = useState<number>(320);
  const fileInputRef = useRef<HTMLInputElement>(null!);

  // Initialize chatId from URL or sessionId (only for non-authenticated users)
  useEffect(() => {
    // Wait for auth to be resolved before initializing
    if (isLoading) return;

    const chatIdFromUrl = searchParams.get('chatId');
    if (chatIdFromUrl) {
      // For authenticated users, don't accept session-based URLs
      if (isAuthenticated && chatIdFromUrl.startsWith('session_')) {
        setCurrentChatId("");
        setActiveConversationId(undefined);
      } else {
        setCurrentChatId(chatIdFromUrl);
        setActiveConversationId(chatIdFromUrl);
      }
    } else if (!isAuthenticated && sessionId) {
      // Only use sessionId for non-authenticated users
      setCurrentChatId(sessionId);
      setActiveConversationId(sessionId);
    }
  }, [searchParams, sessionId, isAuthenticated, isLoading]);

  // Load conversation history when activeConversationId changes (including on page load)
  useEffect(() => {
    const loadConversationHistory = async () => {
      if (!activeConversationId || activeConversationId.startsWith('session_')) {
        return;
      }

      setIsLoadingChatHistory(true);
      clearMessages(); // Clear existing messages before loading new ones
      
      try {
        const history = await ConversationService.getConversationHistory(activeConversationId);
        
        // Add messages to the chat display with null safety
        if (history && history.messages && Array.isArray(history.messages)) {
          history.messages.forEach((msg, index) => {
            addMessage(msg.message, msg.role === 'user' ? 'user' : 'bot');
          });
        }
      } catch (error) {
        console.error('Error loading conversation history:', error);
        addMessage("Sorry, I couldn't load the conversation history.", "bot");
      } finally {
        setIsLoadingChatHistory(false);
      }
    };

    // Only load if we have an authenticated conversation ID
    if (activeConversationId && !activeConversationId.startsWith('session_') && isAuthenticated) {
      loadConversationHistory();
    }
  }, [activeConversationId, isAuthenticated, addMessage, clearMessages]);

  // Update URL when chatId changes
  useEffect(() => {
    if (currentChatId && currentChatId !== searchParams.get('chatId')) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('chatId', currentChatId);
      router.replace(newUrl.pathname + newUrl.search);
    } else if (!currentChatId && searchParams.get('chatId')) {
      // Clear URL if no active chat
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('chatId');
      router.replace(newUrl.pathname + newUrl.search);
    }
  }, [currentChatId, router, searchParams]);

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const loadConversations = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoadingConversations(true);
      const userConversations = await ConversationService.getUserConversations(user.user_id);
      setConversations(userConversations || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoadingConversations(false);
    }
  }, [user]);

  // Load conversations when user is authenticated, or skip if not authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadConversations();
    } else {
      // For non-authenticated users, just stop loading
      setIsLoadingConversations(false);
    }
  }, [isAuthenticated, user, loadConversations]);

  const uploadPDF = async (file: File) => {
    if (!file || !currentChatId) return;

    setIsUploading(true);
    try {
      const data = await ChatService.uploadPDF(file, currentChatId);
      return data;
    } catch (error) {
      console.error("Error uploading PDF:", error);
      addMessage("Failed to upload PDF. Please try again.", "bot");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const sendQuery = async (query: string, messageId: string): Promise<string> => {
    if (!currentChatId || !query) return "";

    setIsQuerying(true);
    setStreamingText("");
    
    const chatHistory: ChatHistoryItem[] = messages
      .map(msg => ({
        [msg.sender === "user" ? "human" : "AI"]: msg.text
      }));

    try {
      const responseBody = await ChatService.streamQuery(query, currentChatId, chatHistory);
      if (!responseBody) {
        throw new Error("No response body received");
      }
      
      const reader = responseBody.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const lines = decoder.decode(value).split('\n');
        
        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);
              if (data.chunk) {
                accumulatedText += data.chunk;
                updateMessage(messageId, { text: accumulatedText });
                setStreamingText(accumulatedText);
              }
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
        }
      }

      return accumulatedText;
    } catch (error) {
      console.error("Error querying:", error);
      return "Sorry, I encountered an error processing your request.";
    } finally {
      setIsQuerying(false);
    }
  };

  const sendMessage = async (): Promise<void> => {
    if (!input.trim() && !file) return;
    
    // Handle file upload if file is present
    if (file) {
      // For authenticated users, create conversation if needed
      if (isAuthenticated && !activeConversationId) {
        try {
          const newConversation = await ConversationService.createConversation({
            title: `PDF Chat: ${file.name}`,
            model_used: "gpt-4"
          });
          
          // Add to conversations list
          setConversations(prev => [
            {
              conversation_id: newConversation.conversation_id,
              title: newConversation.title,
              is_pinned: newConversation.is_pinned,
              updated_at: newConversation.created_at
            },
            ...prev
          ]);
          
          // Set as active conversation and update chat ID
          setActiveConversationId(newConversation.conversation_id);
          setCurrentChatId(newConversation.conversation_id);
        } catch (error) {
          console.error('Error creating conversation for PDF:', error);
          addMessage("Sorry, I couldn't create a conversation for your PDF. Please try again.", "bot");
          return;
        }
      } else if (!isAuthenticated && !currentChatId) {
        // For non-authenticated users, use sessionId
        setCurrentChatId(sessionId);
      }

      const messageId = addMessage(`Uploading PDF: ${file.name}...`, "user", { isUploading: true });
      
      const uploadResult = await uploadPDF(file);
      
      if (uploadResult) {
        removeMessage(messageId);
        addMessage(`Uploaded PDF: ${file.name}`, "user", { 
          isFile: true, 
          fileUrl: URL.createObjectURL(file) 
        });
        addMessage("PDF uploaded successfully! You can now ask questions about the document.", "bot");
        setHasUploadedPDF(true);
        setFile(null);
      }
      return;
    }
    
    // Handle text message
    if (input.trim()) {
      // For authenticated users, create conversation if needed
      if (isAuthenticated && !activeConversationId) {
        try {
          const newConversation = await ConversationService.createConversation({
            title: input.length > 50 ? input.substring(0, 50) + "..." : input,
            model_used: "gpt-4"
          });
          
          // Add to conversations list
          setConversations(prev => [
            {
              conversation_id: newConversation.conversation_id,
              title: newConversation.title,
              is_pinned: newConversation.is_pinned,
              updated_at: newConversation.created_at
            },
            ...prev
          ]);
          
          // Set as active conversation and update chat ID
          setActiveConversationId(newConversation.conversation_id);
          setCurrentChatId(newConversation.conversation_id);
        } catch (error) {
          console.error('Error creating conversation:', error);
          addMessage("Sorry, I couldn't create a new conversation. Please try again.", "bot");
          return;
        }
      } else if (!isAuthenticated && !currentChatId) {
        // For non-authenticated users, use sessionId
        setCurrentChatId(sessionId);
      }

      addMessage(input, "user");
      const userMessage = input;
      setInput("");
      
      const messageId = addMessage("", "bot", { isStreaming: true });
      
      const response = await sendQuery(userMessage, messageId);
      
      updateMessage(messageId, { 
        text: response, 
        isStreaming: false 
      });

      // Save messages to backend only for authenticated users
      if (isAuthenticated && activeConversationId && response) {
        try {
          // Save user message
          await ConversationService.addMessage(activeConversationId, {
            message: userMessage,
            sender: "user"
          });
          
          // Save AI response
          await ConversationService.addMessage(activeConversationId, {
            message: response,
            sender: "ai"
          });
        } catch (error) {
          console.error('Error saving messages to backend:', error);
          // Messages are still shown in UI, just not saved to backend
        }
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Please select a PDF file only.");
      return;
    }

    setFile(selectedFile);
  };

  const handleFileButtonClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleLogout = () => {
    logout();
  };

  const handleSignIn = () => {
    router.push('/login');
  };

  const handleConversationSelect = async (conversationId: string) => {
    setActiveConversationId(conversationId);
    setCurrentChatId(conversationId);
    
    // The useEffect above will handle loading the conversation history
    // when activeConversationId changes
  };

  const handleNewChat = async () => {
    if (!isAuthenticated) {
      // For non-authenticated users, just clear messages and reset chat
      clearMessages();
      const newChatId = `session_${Date.now()}`;
      setCurrentChatId(newChatId);
      setActiveConversationId(newChatId);
      return;
    }

    try {
      const newConversation = await ConversationService.createConversation({
        title: "New Chat",
        model_used: "gpt-4"
      });
      
      // Add to conversations list
      setConversations(prev => [
        {
          conversation_id: newConversation.conversation_id,
          title: newConversation.title,
          is_pinned: newConversation.is_pinned,
          updated_at: newConversation.created_at
        },
        ...prev
      ]);
      
      // Set as active conversation and update chat ID
      setActiveConversationId(newConversation.conversation_id);
      setCurrentChatId(newConversation.conversation_id);
      
      // Clear current messages to start fresh
      clearMessages();
      
    } catch (error) {
      console.error('Error creating new conversation:', error);
      // You might want to show an error message to the user
    }
  };

  const handleSidebarWidthChange = useCallback((width: number) => {
    setSidebarWidth(width);
  }, []);

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await ConversationService.deleteConversation(conversationId);
      
      // Remove from conversations list
      setConversations(prev => prev.filter(conv => conv.conversation_id !== conversationId));
      
      // If this was the active conversation, clear it
      if (activeConversationId === conversationId) {
        setActiveConversationId(undefined);
        setCurrentChatId("");
        clearMessages();
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      alert('Failed to delete conversation. Please try again.');
    }
  };

  const handleTogglePin = async (conversationId: string, isPinned: boolean) => {
    try {
      const result = await ConversationService.togglePinConversation(conversationId, isPinned);
      
      // Update the conversation in the list
      setConversations(prev => 
        prev.map(conv => 
          conv.conversation_id === conversationId 
            ? { ...conv, is_pinned: result.is_pinned }
            : conv
        )
      );
    } catch (error) {
      console.error('Error toggling pin status:', error);
      alert('Failed to update pin status. Please try again.');
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-zinc-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-900">
      {/* Hover Sidebar - Combines navbar and chat history */}
      <HoverSidebar
        isAuthenticated={isAuthenticated}
        currentTheme={currentTheme}
        onLogout={handleLogout}
        onSignIn={handleSignIn}
        onThemeToggle={() => switchTheme(currentTheme === 'dark' ? 'blue' : 'dark')}
        width={sidebarWidth}
        onWidthChange={handleSidebarWidthChange}
      >
        {isAuthenticated ? (
          <div className="flex flex-col h-full">
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversationId}
              onConversationSelect={handleConversationSelect}
              onNewChat={handleNewChat}
              onDeleteConversation={handleDeleteConversation}
              onTogglePin={handleTogglePin}
              isLoading={isLoadingConversations}
            />

          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Guest sidebar content */}
            <div className="p-4 border-b border-gray-200 dark:border-zinc-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Sambble AI</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Chat with AI or upload PDFs
              </p>
            </div>
            
            <div className="flex-1 p-4">
              <button
                onClick={handleNewChat}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Chat
              </button>
              
              {currentChatId && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Current Chat</p>
                  <p className="text-xs text-blue-500 dark:text-blue-300 mt-1 font-mono break-all">
                    {currentChatId}
                  </p>
                </div>
              )}
            </div>
            

          </div>
        )}
      </HoverSidebar>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">

      {/* Show loading skeleton when loading chat history */}
      {isLoadingChatHistory && (
        <ChatSkeleton isMobile={isMobile} />
      )}

      {/* Show welcome page when no messages and not loading */}
      {!isLoadingChatHistory && messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Welcome to <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-md">Sambble AI</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 text-center max-w-2xl">
            {isAuthenticated 
              ? "Start a conversation or upload a PDF to get started! Your chat history will be saved."
              : "Start chatting immediately! Upload a PDF or ask any question to begin."
            }
          </p>
          {!isAuthenticated && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Chat ID: {currentChatId || sessionId} • Your chat URL will be preserved for this session
            </p>
          )}
        </div>
      )}

      {/* Chat messages */}
      {!isLoadingChatHistory && messages.length > 0 && (
        <div className={`flex-1 py-4 overflow-y-auto space-y-4 ${isMobile ? "px-2" : "px-4 sm:px-40"}`} id="chatDisplay">
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              streamingText={streamingText}
              isMobile={isMobile}
            />
          ))}
          

          
          <div ref={chatEndRef} />
        </div>
      )}
      
      {/* Input area */}
      <ChatInput
        input={input}
        setInput={setInput}
        file={file}
        setFile={setFile}
        hasUploadedPDF={hasUploadedPDF}
        isUploading={isUploading}
        isQuerying={isQuerying}
        onSendMessage={sendMessage}
        onFileChange={handleFileChange}
        onFileButtonClick={handleFileButtonClick}
        fileInputRef={fileInputRef}
        isMobile={isMobile}
      />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-zinc-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
