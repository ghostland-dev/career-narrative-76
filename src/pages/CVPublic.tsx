import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CVDisplay from "@/components/CVDisplay";

const CVPublic = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [cv, setCv] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) {
      loadPublicCV();
    }
  }, [id]);

  const loadPublicCV = async () => {
    if (!id) return;
    
    try {
      // Récupérer le CV sans authentification pour les CVs publiés
      const { data, error } = await supabase
        .from("cvs")
        .select("*")
        .eq("id", id)
        .eq("is_published", true)
        .single();

      if (error) {
        setNotFound(true);
      } else {
        setCv(data);
      }
    } catch (error) {
      console.error("Error loading public CV:", error);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-8 w-8 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Chargement du CV...</p>
        </div>
      </div>
    );
  }

  if (notFound || !cv) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-card text-center">
          <CardContent className="pt-6">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">CV non disponible</h3>
            <p className="text-muted-foreground mb-4">
              Ce CV n'est pas publié ou n'existe pas.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const personalInfo = cv.personal_info as any || {};
  const experience = cv.experience as any[] || [];
  const education = cv.education as any[] || [];
  const skills = cv.skills as string[] || [];
  const languages = cv.languages as any[] || [];
  const interests = cv.interests as string[] || [];
  const certifications = cv.certifications as any[] || [];
  const projects = cv.projects as any[] || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header simple */}
      <header className="bg-white border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <FileText className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-xl font-semibold">{cv.title}</h1>
          </div>
        </div>
      </header>

      {/* CV Content */}
      <main className="py-8">
        <div className="container mx-auto px-4">
          <CVDisplay
            personalInfo={{
              ...personalInfo,
              photo_url: cv.photo_url
            }}
            experience={experience}
            education={education}
            skills={skills}
            languages={languages}
            interests={interests}
            certifications={certifications}
            projects={projects}
            templateStyle="modern"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            CV généré avec notre plateforme - {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CVPublic;