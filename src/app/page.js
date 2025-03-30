"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [hasUploadedPDF, setHasUploadedPDF] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const chatEndRef = useRef(null);
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const uploadPDF = async (file) => {
    if (!file || !sessionId) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `api/upload-pdf/?session_id=${sessionId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload PDF");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error uploading PDF:", error);
      setMessages(prev => [...prev, { 
        text: "Failed to upload PDF. Please try again.", 
        sender: "bot" 
      }]);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const sendQuery = async (query) => {
    if (!sessionId || !query) return;

    setIsQuerying(true);
    
    // Convert messages to the required chat_history format
    const chatHistory = messages
      .map(msg => ({
        [msg.sender === "user" ? "human" : "AI"]: msg.text
      }));

    try {
      
      const response = await fetch(
        `api/query/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: sessionId,
            query: query,
            chat_history: chatHistory
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get response from server");
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error querying:", error);
      return "Sorry, I encountered an error processing your request.";
    } finally {
      setIsQuerying(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() && !file) return;
    
    // Check if PDF has been uploaded at least once
    if (input.trim() && !hasUploadedPDF && !file) {
      setMessages([{ text: "Please upload a PDF first before sending messages.", sender: "bot" }]);
      return;
    }

    const newMessages = [...messages];
    
    
    if (file) {
      // Show uploading message
      newMessages.push({ 
        text: `Uploading PDF: ${file.name}...`, 
        sender: "user",
        isUploading: true
      });
      setMessages(newMessages);
      
      // Upload the PDF
      const uploadResult = await uploadPDF(file);
      
      if (uploadResult) {
        // Replace uploading message with success message
        setMessages(prev => [
          ...prev.filter(msg => !msg.isUploading),
          { 
            text: `Uploaded PDF: ${file.name}`, 
            sender: "user",
            isFile: true,
            fileUrl: URL.createObjectURL(file)
          },
          { 
            text: "PDF uploaded successfully! You can now ask questions about the document.", 
            sender: "bot" 
          }
        ]);
        setHasUploadedPDF(true);
        setFile(null);
      }
      return;
    }
    
    if (input.trim()) {
      // Add user message
      const userMessage = { text: input, sender: "user" };
      setMessages(prev => [...prev, userMessage]);
      setInput("");
      
      // Show typing indicator
      setMessages(prev => [...prev, { text: "Typing...", sender: "bot", isTyping: true }]);
      
      // Send query to backend and get response
      const botResponse = await sendQuery(input);
      
      // Remove typing indicator and add actual response
      setMessages(prev => [
        ...prev.filter(msg => !msg.isTyping),
        { text: botResponse, sender: "bot" }
      ]);
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
      {
        !hasUploadedPDF && (
  <div className="flex flex-col items-center justify-center h-full">
    <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
      Chat with any <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-md">PDF</span>
    </h1>
    <p className="text-xl text-gray-600 dark:text-gray-400">
      Drop your PDF to get started!
    </p>
  </div>
)
      }
      {/* Chat messages */}
      <div className={`flex-1 py-4 overflow-y-auto space-y-4 ${isMobile ? "px-2" : "px-4 sm:px-40"}`} id="chatDisplay">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`text-justify px-3 py-2 sm:px-4 sm:py-3 rounded-2xl ${
                isMobile ? "max-w-[80%]" : "max-w-xs lg:max-w-2xl"
              } ${
                msg.sender === "user" 
                  ? "bg-gray-200 dark:bg-zinc-700 text-gray-900 dark:text-white rounded-br-none" 
                  : msg.text.includes("Please upload") 
                    ? "bg-yellow-100 dark:bg-yellow-900 text-gray-900 dark:text-white rounded-bl-none" 
                    : "bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 rounded-bl-none shadow-sm border border-gray-100 dark:border-zinc-700"
              }`}
            >
              {msg.isFile ? (
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <a 
                    href={msg.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {msg.text}
                  </a>
                </div>
              ) : msg.isUploading || msg.isTyping ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-xs sm:text-sm">{msg.text}</p>
                </div>
              ) : (
                <p className="text-xs sm:text-sm">{msg.text}</p>
              )}
              
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      
      {/* Input area */}
      <div className="px-2 sm:px-4 py-3 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700">
        <div className={`flex gap-2 items-center mx-auto ${isMobile ? "w-full" : "w-[80%]"}`}>
          <div className="flex-1 relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,application/pdf"
              className="hidden"
            />
            <input
              placeholder={hasUploadedPDF ? "Type your message..." : "Please upload a PDF first"}
              className="w-full p-2 sm:p-3 pr-10 sm:pr-12 rounded-xl bg-gray-100 dark:bg-zinc-800 dark:text-white border-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-zinc-600 focus:outline-none text-xs sm:text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={!hasUploadedPDF || isUploading || isQuerying}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              <button 
                className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={handleFileButtonClick}
                disabled={isUploading || isQuerying}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              {file && (
                <div className="flex items-center gap-1 bg-gray-200 dark:bg-zinc-700 px-1 sm:px-2 py-0.5 sm:py-1 rounded-md">
                  <span className="text-[10px] sm:text-xs truncate max-w-[50px] sm:max-w-xs">{file.name}</span>
                  <button 
                    onClick={() => setFile(null)}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    disabled={isUploading || isQuerying}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
          <button
            className={`p-2 sm:p-3 rounded-xl transition duration-200 ease-in-out ${
              isUploading || isQuerying
                ? "bg-gray-400 dark:bg-zinc-500 cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-700 dark:bg-zinc-700 dark:hover:bg-zinc-600"
            }`}
            onClick={sendMessage}
            disabled={(!input.trim() && !file) || isUploading || isQuerying}
          >
            {isUploading || isQuerying ? (
              <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}