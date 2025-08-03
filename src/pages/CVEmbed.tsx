import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CVDisplay from "@/components/CVDisplay";

const CVEmbed = () => {
  const { id } = useParams();
  const [cv, setCv] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCV();
    }
  }, [id]);

  const loadCV = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from("cvs")
        .select("*")
        .eq("id", id)
        .eq("is_published", true)
        .single();

      if (!error && data) {
        setCv(data);
      }
    } catch (error) {
      console.error("Error loading CV for embed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white">
        <div className="animate-pulse text-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white">
        <p className="text-gray-500">CV non disponible</p>
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
    <div className="w-full h-full bg-white overflow-auto" style={{ minHeight: '600px' }}>
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
  );
};

export default CVEmbed;