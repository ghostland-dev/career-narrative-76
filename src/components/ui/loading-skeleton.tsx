import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'card' | 'text' | 'avatar' | 'button';
  lines?: number;
}

export const LoadingSkeleton = ({ 
  className, 
  variant = 'card', 
  lines = 3 
}: LoadingSkeletonProps) => {
  const baseClasses = "animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted";
  
  if (variant === 'card') {
    return (
      <div className={cn("space-y-4 p-6", className)}>
        <div className={cn(baseClasses, "h-4 w-3/4 rounded")} />
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <div 
              key={i} 
              className={cn(
                baseClasses, 
                "h-3 rounded",
                i === lines - 1 ? "w-1/2" : "w-full"
              )} 
            />
          ))}
        </div>
        <div className={cn(baseClasses, "h-32 w-full rounded-lg")} />
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i} 
            className={cn(
              baseClasses, 
              "h-4 rounded",
              i === lines - 1 ? "w-3/4" : "w-full"
            )} 
          />
        ))}
      </div>
    );
  }

  if (variant === 'avatar') {
    return (
      <div className={cn(baseClasses, "h-12 w-12 rounded-full", className)} />
    );
  }

  if (variant === 'button') {
    return (
      <div className={cn(baseClasses, "h-10 w-20 rounded-md", className)} />
    );
  }

  return <div className={cn(baseClasses, "h-4 w-full rounded", className)} />;
};