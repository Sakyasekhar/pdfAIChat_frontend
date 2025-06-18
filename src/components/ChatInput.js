const ChatInput = ({ 
    input, 
    setInput, 
    file, 
    setFile, 
    hasUploadedPDF, 
    isUploading, 
    isQuerying, 
    onSendMessage, 
    onFileChange, 
    onFileButtonClick,
    fileInputRef,
    isMobile 
  }) => {
    return (
      <div className="px-2 sm:px-4 py-3 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700">
        <div className={`flex gap-2 items-center mx-auto ${isMobile ? "w-full" : "w-[80%]"}`}>
          <div className="flex-1 relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              accept=".pdf,application/pdf"
              className="hidden"
            />
            <input
              placeholder={hasUploadedPDF ? "Type your message..." : "Please upload a PDF first"}
              className="w-full p-2 sm:p-3 pr-10 sm:pr-12 rounded-xl bg-gray-100 dark:bg-zinc-800 dark:text-white border-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-zinc-600 focus:outline-none text-xs sm:text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
              disabled={!hasUploadedPDF || isUploading || isQuerying}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              <button 
                className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={onFileButtonClick}
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
            onClick={onSendMessage}
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
    );
  };
  
  export default ChatInput;