import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Camera, Trash2, Loader2, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoUpload: (photoUrl: string) => void;
  onPhotoRemove: () => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  currentPhotoUrl,
  onPhotoUpload,
  onPhotoRemove,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Format invalide",
        description: "Veuillez sélectionner une image (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "Fichier trop volumineux",
        description: "L'image ne doit pas dépasser 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('cv-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('cv-photos')
        .getPublicUrl(data.path);

      onPhotoUpload(publicUrl);
      
      toast({
        title: "Photo ajoutée",
        description: "Votre photo de profil a été uploadée avec succès",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Erreur d'upload",
        description: "Impossible d'uploader la photo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemovePhoto = async () => {
    if (!currentPhotoUrl) return;
    
    try {
      // Extract path from URL
      const url = new URL(currentPhotoUrl);
      const path = url.pathname.split('/').slice(-2).join('/');
      
      await supabase.storage
        .from('cv-photos')
        .remove([path]);
      
      onPhotoRemove();
      
      toast({
        title: "Photo supprimée",
        description: "Votre photo de profil a été supprimée",
      });
    } catch (error) {
      console.error('Error removing photo:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la photo",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-0 shadow-modern">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Photo de profil</h3>
            <p className="text-sm text-muted-foreground">
              Ajoutez une photo professionnelle pour personnaliser votre CV
            </p>
          </div>

          {/* Photo Display */}
          <div className="flex justify-center">
            <Avatar className="w-32 h-32 border-4 border-primary/20 hover:border-primary/40 transition-colors">
              <AvatarImage src={currentPhotoUrl} alt="Photo de profil" />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/10 to-primary/20">
                <Camera className="w-8 h-8 text-primary" />
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
              ${isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <div className="space-y-2">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="text-sm text-muted-foreground">Upload en cours...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    Cliquez ou glissez une image ici
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG jusqu'à 5MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Choisir une image
            </Button>
            
            {currentPhotoUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemovePhoto}
                disabled={isUploading}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotoUpload;