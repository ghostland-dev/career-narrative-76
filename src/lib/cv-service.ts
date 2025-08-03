import { supabase } from "@/integrations/supabase/client";
import { useActivityTracker } from "@/components/analytics/UserActivityTracker";

export interface CVData {
  id?: string;
  title: string;
  template_id: string;
  personal_info: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string[];
  languages?: Array<{
    id: string;
    name: string;
    level: string;
  }>;
  interests?: string[];
  certifications?: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
  projects?: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string;
    url?: string;
    date: string;
  }>;
  photo_url?: string;
}

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  preview_image_url?: string;
  styles: any; // Using any for JSON flexibility
  is_premium: boolean;
}

// CV Management Functions
export const createCV = async (cvData: Omit<CVData, "id">) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("cvs")
    .insert({
      user_id: user.id,
      title: cvData.title,
      template_id: cvData.template_id,
      personal_info: cvData.personal_info,
      experience: cvData.experience,
      education: cvData.education,
      skills: cvData.skills,
      languages: cvData.languages || [],
      interests: cvData.interests || [],
      certifications: cvData.certifications || [],
      projects: cvData.projects || [],
      photo_url: cvData.photo_url || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCV = async (id: string, cvData: Partial<CVData>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (cvData.title) updateData.title = cvData.title;
  if (cvData.template_id) updateData.template_id = cvData.template_id;
  if (cvData.personal_info) updateData.personal_info = cvData.personal_info;
  if (cvData.experience) updateData.experience = cvData.experience;
  if (cvData.education) updateData.education = cvData.education;
  if (cvData.skills) updateData.skills = cvData.skills;
  if (cvData.languages) updateData.languages = cvData.languages;
  if (cvData.interests) updateData.interests = cvData.interests;
  if (cvData.certifications) updateData.certifications = cvData.certifications;
  if (cvData.projects) updateData.projects = cvData.projects;
  if (cvData.photo_url !== undefined) updateData.photo_url = cvData.photo_url;

  const { data, error } = await supabase
    .from("cvs")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCV = async (id: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("cvs")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
};

export const getUserCVs = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("cvs")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getCV = async (id: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("cvs")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) throw error;
  return data;
};

// Template Functions
export const getTemplates = async () => {
  const { data, error } = await supabase
    .from("cv_templates")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as any[];
};

export const getTemplate = async (id: string) => {
  const { data, error } = await supabase
    .from("cv_templates")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as any;
};