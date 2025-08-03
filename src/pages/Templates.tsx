import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FileText, ArrowLeft, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { createCV, getTemplates } from "@/lib/cv-service";
import TemplateGallery from "@/components/TemplateGallery";
import { useEffect } from "react";

const Templates = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [newCVTitle, setNewCVTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    checkAuth();
    loadTemplates();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const loadTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error("Error loading templates:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les templates.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowCreateDialog(true);
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

      setShowCreateDialog(false);
      setNewCVTitle("");
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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-8 w-8 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Chargement des templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Templates CVCraft</span>
            </div>
          </div>
          <Button onClick={() => navigate("/cv-builder")}>
            <Plus className="h-4 w-4 mr-2" />
            Créer sans template
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Choisissez votre template</h1>
          <p className="text-muted-foreground">
            Sélectionnez le design qui correspond le mieux à votre profil professionnel
          </p>
        </div>

        <TemplateGallery 
          templates={templates}
          onSelectTemplate={handleSelectTemplate}
          selectedTemplate={selectedTemplate}
        />

        {/* Create CV Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un CV avec ce template</DialogTitle>
              <DialogDescription>
                Template sélectionné: {templates.find(t => t.id === selectedTemplate)?.name || selectedTemplate}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cv-title">Titre du CV</Label>
                <Input
                  id="cv-title"
                  value={newCVTitle}
                  onChange={(e) => setNewCVTitle(e.target.value)}
                  placeholder="Ex: CV Développeur Frontend"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateCV} disabled={isCreating}>
                {isCreating ? "Création..." : "Créer le CV"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Templates;