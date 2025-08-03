import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Sparkles, Award, FileText } from "lucide-react";
import { createCV, getTemplates, type CVTemplate } from "@/lib/cv-service";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/AppLayout";
import LoadingScreen from "@/components/LoadingScreen";

const NewCV = () => {
  const [newCVTitle, setNewCVTitle] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [templates, setTemplates] = useState<CVTemplate[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error("Error loading templates:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les modèles.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCV = async () => {
    if (!newCVTitle.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un titre pour votre CV.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const newCV = await createCV({
        title: newCVTitle,
        template_id: selectedTemplate,
        personal_info: {
          fullName: "",
          email: "",
          phone: "",
          address: "",
          summary: ""
        },
        experience: [],
        education: [],
        skills: []
      });

      toast({
        title: "CV créé",
        description: "Votre nouveau CV a été créé avec succès.",
      });

      navigate(`/cv-builder/${newCV.id}`);
    } catch (error) {
      console.error("Error creating CV:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le CV.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Chargement des modèles..." />;
  }

  return (
    <AppLayout 
      title="Créer un nouveau CV" 
      subtitle="Démarrez votre CV professionnel en quelques clics"
    >
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-0 shadow-elegant">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Nouveau CV</CardTitle>
            <CardDescription>
              Créez un CV professionnel à partir de zéro avec nos modèles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cv-title">Titre du CV</Label>
              <Input
                id="cv-title"
                value={newCVTitle}
                onChange={(e) => setNewCVTitle(e.target.value)}
                placeholder="Ex: CV Développeur Frontend, CV Marketing Digital..."
                className="text-base"
              />
              <p className="text-sm text-muted-foreground">
                Donnez un nom descriptif à votre CV pour le retrouver facilement
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">Style de CV</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="text-base">
                  <SelectValue placeholder="Choisir un style" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center space-x-2">
                        {template.id === "modern" && <Sparkles className="h-4 w-4" />}
                        {template.id === "professional" && <Award className="h-4 w-4" />}
                        {template.id !== "modern" && template.id !== "professional" && <FileText className="h-4 w-4" />}
                        <span>{template.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Vous pourrez changer de style à tout moment dans l'éditeur
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <Button 
                onClick={handleCreateCV} 
                disabled={isCreating || !newCVTitle.trim()}
                className="w-full text-base py-6"
                size="lg"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Création en cours...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Créer mon CV
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate("/dashboard")}
                className="w-full"
                size="lg"
              >
                Retour au tableau de bord
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default NewCV;