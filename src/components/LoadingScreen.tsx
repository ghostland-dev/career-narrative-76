import React from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  message?: string;
  className?: string;
  variant?: 'full' | 'inline' | 'minimal';
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Chargement...", 
  className,
  variant = 'full' 
}) => {
  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="text-center space-y-4">
          <div className="relative">
            <FileText className="h-8 w-8 text-primary mx-auto animate-pulse" />
            <Loader2 className="h-4 w-4 animate-spin text-primary-glow absolute -top-1 -right-1" />
          </div>
          <p className="text-muted-foreground">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-background flex items-center justify-center", className)}>
      <div className="text-center space-y-6 animate-fade-in">
        <div className="relative">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-primary-glow absolute -top-2 -right-2" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">CVCraft</h3>
          <p className="text-muted-foreground">{message}</p>
        </div>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;