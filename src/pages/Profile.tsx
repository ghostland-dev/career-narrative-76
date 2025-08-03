import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  User, 
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import EnhancedProfile from "@/components/EnhancedProfile";
import AppLayout from "@/components/AppLayout";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    company: "",
    avatar_url: "",
    job_title: "",
    location: "",
    bio: "",
    linkedin: "",
    github: "",
    website: ""
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadProfile();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUser(session.user);
  };

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          email: data.email || user.email || "",
          phone: data.phone || "",
          company: data.company || "",
          avatar_url: data.avatar_url || "",
          job_title: (data as any).job_title || "",
          location: (data as any).location || "",
          bio: (data as any).bio || "",
          linkedin: (data as any).linkedin || "",
          github: (data as any).github || "",
          website: (data as any).website || ""
        });
      } else {
        // Create profile if it doesn't exist
        setProfile({
          full_name: "",
          email: user.email || "",
          phone: "",
          company: "",
          avatar_url: "",
          job_title: "",
          location: "",
          bio: "",
          linkedin: "",
          github: "",
          website: ""
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le profil.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (updatedProfile: typeof profile) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          user_id: user.id,
          full_name: updatedProfile.full_name,
          email: updatedProfile.email,
          phone: updatedProfile.phone,
          company: updatedProfile.company,
          avatar_url: updatedProfile.avatar_url,
          job_title: updatedProfile.job_title,
          location: updatedProfile.location,
          bio: updatedProfile.bio,
          linkedin: updatedProfile.linkedin,
          github: updatedProfile.github,
          website: updatedProfile.website,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setProfile(updatedProfile);
      toast({
        title: "Profil sauvegardé",
        description: "Vos informations ont été mises à jour avec succès.",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le profil.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl mx-auto mb-6 flex items-center justify-center animate-pulse shadow-glow">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Chargement du profil</h2>
          <p className="text-muted-foreground">Récupération de vos informations...</p>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppLayout
      title="Mon Profil"
      subtitle="Gérez vos informations personnelles et paramètres"
      showBackButton={true}
      backTo="/dashboard"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <EnhancedProfile
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
            user={user}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;