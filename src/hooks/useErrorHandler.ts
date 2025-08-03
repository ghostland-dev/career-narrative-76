import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((error: Error | string, context?: string) => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const title = context ? `Erreur ${context}` : 'Erreur';
    
    console.error('Error handled:', { error, context });
    
    toast({
      title,
      description: errorMessage,
      variant: "destructive",
    });
  }, [toast]);

  const handleSuccess = useCallback((message: string, description?: string) => {
    toast({
      title: message,
      description,
    });
  }, [toast]);

  return { handleError, handleSuccess };
};