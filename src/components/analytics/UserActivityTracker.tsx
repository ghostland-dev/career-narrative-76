import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ActivityEvent {
  type: 'cv_created' | 'cv_updated' | 'cv_exported' | 'cv_optimized' | 'cover_letter_generated' | 'login' | 'signup';
  metadata?: Record<string, any>;
}

export const useActivityTracker = () => {
  const trackActivity = async (activity: ActivityEvent) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('user_activities').insert({
        user_id: user.id,
        activity_type: activity.type,
        description: getActivityDescription(activity.type),
        metadata: activity.metadata || {}
      });
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  };

  return { trackActivity };
};

const getActivityDescription = (type: string): string => {
  const descriptions: Record<string, string> = {
    cv_created: 'CV créé',
    cv_updated: 'CV mis à jour',
    cv_exported: 'CV exporté en PDF',
    cv_optimized: 'CV optimisé avec IA',
    cover_letter_generated: 'Lettre de motivation générée',
    login: 'Connexion utilisateur',
    signup: 'Inscription utilisateur'
  };
  
  return descriptions[type] || type;
};

// Component to automatically track page views
const UserActivityTracker: React.FC = () => {
  const { trackActivity } = useActivityTracker();

  useEffect(() => {
    const handlePageView = () => {
      // Track page views if needed
    };

    window.addEventListener('focus', handlePageView);
    return () => window.removeEventListener('focus', handlePageView);
  }, [trackActivity]);

  return null;
};

export default UserActivityTracker;