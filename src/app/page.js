"use client";
import { useState, useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat";
import { ChatService } from "../services/chat";
import Message from "../components/Message";
import ChatInput from "../components/ChatInput";

export default function Home() {
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
    removeMessage
  } = useChat();

  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [hasUploadedPDF, setHasUploadedPDF] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const fileInputRef = useRef(null);

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

  const uploadPDF = async (file) => {
    if (!file || !sessionId) return;

    setIsUploading(true);
    try {
      const data = await ChatService.uploadPDF(file, sessionId);
      return data;
    } catch (error) {
      console.error("Error uploading PDF:", error);
      addMessage("Failed to upload PDF. Please try again.", "bot");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const sendQuery = async (query, messageId) => {
    if (!sessionId || !query) return;

    setIsQuerying(true);
    setStreamingText("");
    
    const chatHistory = messages
      .map(msg => ({
        [msg.sender === "user" ? "human" : "AI"]: msg.text
      }));

    try {
      const responseBody = await ChatService.streamQuery(query, sessionId, chatHistory);
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

  const sendMessage = async () => {
    if (!input.trim() && !file) return;
    
    if (input.trim() && !hasUploadedPDF && !file) {
      addMessage("Please upload a PDF first before sending messages.", "bot");
      return;
    }

    if (file) {
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
    
    if (input.trim()) {
      addMessage(input, "user");
      setInput("");
      
      const messageId = addMessage("", "bot", { isStreaming: true });
      
      const response = await sendQuery(input, messageId);
      
      updateMessage(messageId, { 
        text: response, 
        isStreaming: false 
      });
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Please select a PDF file only.");
      return;
    }

    setFile(selectedFile);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-3 sm:px-7">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">PDFChat AI</h2>
          </div>
        </div>
      </div>

      {!hasUploadedPDF && (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Chat with any <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-md">PDF</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Drop your PDF to get started!
          </p>
        </div>
      )}

      {/* Chat messages */}
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
  );
}