-- Ajouter le support des photos de profil et sections supplémentaires
-- Créer un bucket pour les photos de profil
INSERT INTO storage.buckets (id, name, public)
VALUES ('cv-photos', 'cv-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Politiques pour les photos de CV
CREATE POLICY "Users can view CV photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'cv-photos');

CREATE POLICY "Users can upload their own CV photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'cv-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own CV photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'cv-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own CV photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'cv-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Étendre la table CVs pour supporter plus de données
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS languages jsonb DEFAULT '[]'::jsonb;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS interests jsonb DEFAULT '[]'::jsonb;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS certifications jsonb DEFAULT '[]'::jsonb;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS projects jsonb DEFAULT '[]'::jsonb;
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS photo_url text;