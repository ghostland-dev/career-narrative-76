import React from 'react';
import { toast } from '@/hooks/use-toast';
import { CheckCircle2, AlertCircle, Info, XCircle, Save, Download, Eye, Upload } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';
type ToastAction = 'save' | 'export' | 'preview' | 'import' | 'optimize';

interface EnhancedToastOptions {
  title: string;
  description?: string;
  type: ToastType;
  action?: ToastAction;
  duration?: number;
}

const getToastIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="h-4 w-4 text-success" />;
    case 'error':
      return <XCircle className="h-4 w-4 text-destructive" />;
    case 'warning':
      return <AlertCircle className="h-4 w-4 text-warning" />;
    case 'info':
      return <Info className="h-4 w-4 text-info" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

const getActionIcon = (action?: ToastAction) => {
  if (!action) return null;
  
  switch (action) {
    case 'save':
      return <Save className="h-4 w-4" />;
    case 'export':
      return <Download className="h-4 w-4" />;
    case 'preview':
      return <Eye className="h-4 w-4" />;
    case 'import':
      return <Upload className="h-4 w-4" />;
    case 'optimize':
      return <CheckCircle2 className="h-4 w-4" />;
    default:
      return null;
  }
};

export const showEnhancedToast = ({
  title,
  description,
  type,
  action,
  duration = 4000
}: EnhancedToastOptions) => {
  toast({
    title: title,
    description,
    variant: type === 'error' ? 'destructive' : 'default',
    duration,
  });
};

// Toasts pré-configurés pour les actions courantes
export const toastActions = {
  autoSave: () => showEnhancedToast({
    title: 'Sauvegarde automatique',
    description: 'Vos modifications ont été sauvegardées',
    type: 'success',
    action: 'save',
    duration: 2000
  }),

  manualSave: () => showEnhancedToast({
    title: 'CV sauvegardé',
    description: 'Toutes vos modifications ont été enregistrées',
    type: 'success',
    action: 'save'
  }),

  exportSuccess: () => showEnhancedToast({
    title: 'PDF généré avec succès',
    description: 'Votre CV a été exporté en PDF',
    type: 'success',
    action: 'export'
  }),

  optimizationComplete: (taskName: string) => showEnhancedToast({
    title: 'Optimisation terminée',
    description: `${taskName} a été optimisé avec succès`,
    type: 'success',
    action: 'optimize'
  }),

  importSuccess: () => showEnhancedToast({
    title: 'Import réussi',
    description: 'Le contenu a été importé dans votre CV',
    type: 'success',
    action: 'import'
  }),

  saveError: () => showEnhancedToast({
    title: 'Erreur de sauvegarde',
    description: 'Impossible de sauvegarder vos modifications',
    type: 'error',
    action: 'save'
  }),

  networkError: () => showEnhancedToast({
    title: 'Problème de connexion',
    description: 'Vérifiez votre connexion internet et réessayez',
    type: 'warning'
  }),

  validationError: (field: string) => showEnhancedToast({
    title: 'Champ requis',
    description: `Le champ "${field}" doit être rempli`,
    type: 'warning'
  })
};