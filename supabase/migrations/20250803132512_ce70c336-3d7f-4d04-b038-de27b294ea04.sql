-- Create table for storing CV data
CREATE TABLE public.cvs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  template_id TEXT DEFAULT 'modern',
  personal_info JSONB NOT NULL DEFAULT '{}',
  experience JSONB NOT NULL DEFAULT '[]',
  education JSONB NOT NULL DEFAULT '[]',
  skills JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_published BOOLEAN DEFAULT false,
  last_exported_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;

-- Create policies for CV access
CREATE POLICY "Users can view their own CVs" 
ON public.cvs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own CVs" 
ON public.cvs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CVs" 
ON public.cvs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CVs" 
ON public.cvs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_cvs_updated_at
BEFORE UPDATE ON public.cvs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for CV templates
CREATE TABLE public.cv_templates (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  preview_image_url TEXT,
  styles JSONB NOT NULL DEFAULT '{}',
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for templates (read-only for users)
ALTER TABLE public.cv_templates ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read templates
CREATE POLICY "Anyone can view templates" 
ON public.cv_templates 
FOR SELECT 
TO authenticated
USING (true);

-- Insert default templates
INSERT INTO public.cv_templates (id, name, description, styles) VALUES
('modern', 'Moderne', 'Un design épuré et contemporain parfait pour les métiers du numérique', '{"primaryColor": "#2563eb", "fontFamily": "Inter", "layout": "single-column"}'),
('creative', 'Créatif', 'Un template coloré et original pour les profils créatifs', '{"primaryColor": "#7c3aed", "fontFamily": "Poppins", "layout": "two-column"}'),
('professional', 'Professionnel', 'Un style classique et élégant pour tous secteurs', '{"primaryColor": "#059669", "fontFamily": "Open Sans", "layout": "traditional"}'),
('minimal', 'Minimaliste', 'Un design sobre et efficace qui met en valeur le contenu', '{"primaryColor": "#374151", "fontFamily": "Source Sans Pro", "layout": "clean"}')