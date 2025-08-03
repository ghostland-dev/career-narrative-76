import { useEffect, useRef } from 'react';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface UseAutoSaveProps {
  data: any;
  onSave: () => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

export const useAutoSave = ({ 
  data, 
  onSave, 
  delay = 3000, 
  enabled = true 
}: UseAutoSaveProps) => {
  const { handleError, handleSuccess } = useErrorHandler();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>('');
  const isSavingRef = useRef(false);

  useEffect(() => {
    if (!enabled || isSavingRef.current) return;

    const currentData = JSON.stringify(data);
    
    // Ne sauvegarder que si les données ont changé
    if (currentData === lastSavedRef.current) return;

    // Annuler la sauvegarde précédente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Programmer une nouvelle sauvegarde
    timeoutRef.current = setTimeout(async () => {
      try {
        isSavingRef.current = true;
        await onSave();
        lastSavedRef.current = currentData;
        handleSuccess('Sauvegarde automatique effectuée');
      } catch (error) {
        handleError(error as Error, 'sauvegarde automatique');
      } finally {
        isSavingRef.current = false;
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, onSave, delay, enabled, handleError, handleSuccess]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
};