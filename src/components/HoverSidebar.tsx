"use client";
import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Sun, Moon, Menu, MessageSquare, Pin, PinOff, LogIn } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HoverSidebarProps {
  isAuthenticated: boolean;
  currentTheme: string;
  onLogout: () => void;
  onThemeToggle: () => void;
  onSignIn?: () => void;
  children: React.ReactNode;
  width?: number;
  onWidthChange?: (width: number) => void;
}

const HoverSidebar: React.FC<HoverSidebarProps> = ({
  isAuthenticated,
  currentTheme,
  onLogout,
  onThemeToggle,
  onSignIn,
  children,
  width = 320,
  onWidthChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const minWidth = 240;
  const maxWidth = 600;
  const collapsedWidth = 64;

  // Handle mouse enter/leave for hover expansion
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 300); // 300ms delay before collapsing
    }
  };

  // Handle pin/unpin
  const handleTogglePin = () => {
    setIsPinned(!isPinned);
    if (!isPinned) {
      setIsExpanded(true);
    }
  };

  // Handle resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !isExpanded) return;
      
      const newWidth = e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth && onWidthChange) {
        onWidthChange(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isExpanded, onWidthChange, minWidth, maxWidth]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isExpanded) return;
    e.preventDefault();
    setIsResizing(true);
  };

  return (
    <TooltipProvider>
      <div 
        ref={sidebarRef}
        className={`relative bg-gray-100 dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-700 flex flex-col transition-all duration-300 ease-in-out ${
          isExpanded || isPinned ? 'shadow-lg' : ''
        }`}
        style={{ 
          width: isExpanded || isPinned ? `${width}px` : `${collapsedWidth}px`
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Collapsed State - Always visible vertical bar */}
        <div className={`absolute inset-0 bg-gray-100 dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-700 flex flex-col transition-opacity duration-300 ${
          isExpanded || isPinned ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
          {/* Top section - Logo always visible */}
          <div className="flex flex-col items-center py-4 space-y-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            
            {/* Open sidebar button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleTogglePin}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                  aria-label="Open sidebar"
                >
                  <Menu className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Open sidebar</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Bottom section - Action buttons */}
          <div className="flex flex-col items-center mt-auto py-4 space-y-3">
            {/* Theme Toggle Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onThemeToggle}
                  className="p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                  aria-label="Toggle theme"
                >
                  {currentTheme === 'dark' ? (
                    <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Switch to {currentTheme === 'dark' ? 'light' : 'dark'} mode</p>
              </TooltipContent>
            </Tooltip>

            {/* Sign In/Out Button */}
            {isAuthenticated ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onLogout}
                    className="p-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Sign out</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onSignIn}
                    className="p-3 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    aria-label="Sign in"
                  >
                    <LogIn className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Sign in</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Expanded State - Full sidebar with content */}
        <div className={`absolute inset-0 bg-white dark:bg-zinc-900 flex flex-col transition-opacity duration-300 ${
          isExpanded || isPinned ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-medium text-gray-900 dark:text-white">Sambble AI</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Chat History</p>
              </div>
            </div>
            
            {/* Pin/Unpin button */}
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleTogglePin}
                    className={`p-2 rounded-lg transition-colors ${
                      isPinned 
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-400'
                    }`}
                    aria-label={isPinned ? "Unpin sidebar" : "Pin sidebar"}
                  >
                    {isPinned ? (
                      <PinOff className="w-4 h-4" />
                    ) : (
                      <Pin className="w-4 h-4" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{isPinned ? 'Unpin sidebar' : 'Pin sidebar'}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {children}
          </div>

          {/* Bottom action buttons - Fixed position */}
          <div className="p-3 border-t border-gray-200 dark:border-zinc-700">
            <div className="flex items-center justify-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onThemeToggle}
                    className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                    aria-label="Toggle theme"
                  >
                    {currentTheme === 'dark' ? (
                      <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Switch to {currentTheme === 'dark' ? 'light' : 'dark'} mode</p>
                </TooltipContent>
              </Tooltip>
              
              {/* Sign In/Out Button */}
              {isAuthenticated ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={onLogout}
                      className="p-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      aria-label="Sign out"
                    >
                      <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Sign out</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={onSignIn}
                      className="p-3 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      aria-label="Sign in"
                    >
                      <LogIn className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Sign in</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Resize handle - only visible when expanded */}
          {onWidthChange && (
            <div
              className="absolute top-0 right-0 w-1 h-full cursor-ew-resize hover:bg-blue-500 transition-colors group"
              onMouseDown={handleMouseDown}
            >
              <div className="w-1 h-full bg-transparent group-hover:bg-blue-500 transition-colors" />
            </div>
          )}
        </div>

        {/* Hover indicator on collapsed state */}
        <div className={`absolute top-1/2 left-0 w-1 h-12 bg-blue-500 rounded-r transform -translate-y-1/2 transition-opacity duration-300 ${
          !isExpanded && !isPinned ? 'opacity-60' : 'opacity-0'
        }`} />
      </div>
    </TooltipProvider>
  );
};

export default HoverSidebar;
