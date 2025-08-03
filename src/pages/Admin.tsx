import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminDashboard from '@/components/admin/AdminDashboard';
import LoadingScreen from '@/components/LoadingScreen';
import { useToast } from '@/hooks/use-toast';

const Admin: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        throw error;
      }

      if (profile?.role === 'admin') {
        setIsAdmin(true);
      } else {
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les permissions administrateur.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      toast({
        title: "Erreur d'authentification",
        description: "Impossible de vérifier vos permissions.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Vérification des permissions..." />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AdminDashboard />;
};

export default Admin;