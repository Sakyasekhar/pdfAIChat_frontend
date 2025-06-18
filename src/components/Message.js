import ReactMarkdown from 'react-markdown';

const Message = ({ message, streamingText, isMobile }) => {
  const isUser = message.sender === "user";
  const isStreaming = message.isStreaming;
  const isFile = message.isFile;
  const isUploading = message.isUploading;
  const hasStartedStreaming = isStreaming && streamingText.length > 0;

  const getMessageClasses = () => {
    const baseClasses = "text-justify px-3 py-2 sm:px-4 sm:py-3 rounded-2xl";
    const sizeClasses = isMobile ? "max-w-[80%]" : "max-w-xs lg:max-w-2xl";
    
    if (isUser) {
      return `${baseClasses} ${sizeClasses} bg-gray-200 dark:bg-zinc-700 text-gray-900 dark:text-white rounded-br-none`;
    }
    
    if (message.text.includes("Please upload")) {
      return `${baseClasses} ${sizeClasses} bg-yellow-100 dark:bg-yellow-900 text-gray-900 dark:text-white rounded-bl-none`;
    }
    
    return `${baseClasses} ${sizeClasses} bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 rounded-bl-none shadow-sm border border-gray-100 dark:border-zinc-700`;
  };

  const renderContent = () => {
    if (isFile) {
      return (
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <a 
            href={message.fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {message.text}
          </a>
        </div>
      );
    }

    if (isUploading) {
      return (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xs sm:text-sm">{message.text}</p>
        </div>
      );
    }

    if (isStreaming && !hasStartedStreaming) {
      return (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Thinking...</span>
        </div>
      );
    }

    return (
      <div className="text-xs sm:text-sm prose dark:prose-invert prose-sm max-w-none">
        <ReactMarkdown
          components={{
            h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-base font-bold mb-2" {...props} />,
            p: ({node, ...props}) => <p className="mb-2" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
            li: ({node, ...props}) => <li className="mb-1" {...props} />,
            a: ({node, ...props}) => <a className="text-blue-600 dark:text-blue-400 hover:underline" {...props} />,
            code: ({node, inline, ...props}) => 
              inline ? 
                <code className="bg-gray-100 dark:bg-zinc-800 rounded px-1 py-0.5" {...props} /> :
                <code className="block bg-gray-100 dark:bg-zinc-800 rounded p-2 my-2 overflow-x-auto" {...props} />,
            pre: ({node, ...props}) => <pre className="bg-gray-100 dark:bg-zinc-800 rounded p-2 my-2 overflow-x-auto" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 dark:border-zinc-600 pl-4 italic my-2" {...props} />,
            table: ({node, ...props}) => <div className="overflow-x-auto my-2"><table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700" {...props} /></div>,
            th: ({node, ...props}) => <th className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-left" {...props} />,
            td: ({node, ...props}) => <td className="px-4 py-2 border-t border-gray-200 dark:border-zinc-700" {...props} />,
          }}
        >
          {isStreaming ? streamingText : message.text}
        </ReactMarkdown>
        {isStreaming && hasStartedStreaming && (
          <span className="inline-block w-2 h-4 ml-1 bg-gray-400 dark:bg-gray-600 animate-pulse"></span>
        )}
      </div>
    );
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={getMessageClasses()}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Message;