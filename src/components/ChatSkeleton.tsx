"use client";
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ChatSkeletonProps {
  isMobile?: boolean;
}

const ChatSkeleton: React.FC<ChatSkeletonProps> = ({ isMobile = false }) => {
  return (
    <div className={`flex-1 py-4 overflow-y-auto space-y-4 ${isMobile ? "px-2" : "px-4 sm:px-40"}`}>
      {/* User message bubble */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-48 rounded-lg" />
      </div>

      {/* Bot message bubble */}
      <div className="flex justify-start">
        <Skeleton className="h-16 w-64 rounded-lg" />
      </div>

      {/* User message bubble */}
      <div className="flex justify-end">
        <Skeleton className="h-8 w-32 rounded-lg" />
      </div>

      {/* Bot message bubble */}
      <div className="flex justify-start">
        <Skeleton className="h-20 w-72 rounded-lg" />
      </div>
    </div>
  );
};

export default ChatSkeleton;
