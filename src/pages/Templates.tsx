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
import { FloatingShapes, GradientBlur } from "@/components/ui/floating-elements";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

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
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl mx-auto mb-6 flex items-center justify-center animate-pulse shadow-glow">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Chargement des templates</h2>
          <p className="text-muted-foreground">Préparation de la galerie de designs...</p>
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <GradientBlur />
      <FloatingShapes />
      
      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen bg-gradient-to-br from-background/80 via-accent/5 to-primary/5">
        {/* Modern Header with Glass Effect */}
        <header className="sticky top-0 z-50 border-b border-border/50 glass-morphism">
          <div className="container mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/dashboard")}
                className="hover:bg-white/10 transition-smooth hover-lift"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <div className="flex items-center space-x-3 animate-slide-up-fade">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center shadow-glow animate-glow-pulse">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-gradient">
                    CVCraft Templates
                  </span>
                  <p className="text-xs text-muted-foreground">Design professionnel</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => navigate("/cv-builder")}
              className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300 hover-lift animate-bounce-gentle"
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer sans template
            </Button>
          </div>
        </header>

        {/* Enhanced Hero Section */}
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-6xl font-bold mb-8 text-gradient animate-slide-up-fade">
                Templates Professionnels
              </h1>
              <p className="text-xl text-muted-foreground mb-12 animate-slide-up-fade max-w-2xl mx-auto leading-relaxed" style={{animationDelay: '0.2s'}}>
                Choisissez parmi notre collection de designs soigneusement créés pour 
                <span className="text-primary font-semibold"> maximiser vos chances de succès</span>. 
                Chaque template est optimisé pour passer les filtres ATS et impressionner les recruteurs.
              </p>
              
              {/* Enhanced Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-slide-up-fade" style={{animationDelay: '0.4s'}}>
                <div className="glass-morphism rounded-2xl p-8 hover-lift hover-glow group">
                  <div className="text-4xl font-bold text-primary mb-3 group-hover:animate-bounce-gentle">50+</div>
                  <div className="text-sm text-muted-foreground font-medium">Templates disponibles</div>
                  <div className="w-12 h-1 bg-gradient-to-r from-primary to-primary-glow rounded-full mx-auto mt-3"></div>
                </div>
                <div className="glass-morphism rounded-2xl p-8 hover-lift hover-glow group">
                  <div className="text-4xl font-bold text-success mb-3 group-hover:animate-bounce-gentle">98%</div>
                  <div className="text-sm text-muted-foreground font-medium">Taux de satisfaction</div>
                  <div className="w-12 h-1 bg-gradient-to-r from-success to-accent rounded-full mx-auto mt-3"></div>
                </div>
                <div className="glass-morphism rounded-2xl p-8 hover-lift hover-glow group">
                  <div className="text-4xl font-bold text-accent mb-3 group-hover:animate-bounce-gentle">24h</div>
                  <div className="text-sm text-muted-foreground font-medium">Support disponible</div>
                  <div className="w-12 h-1 bg-gradient-to-r from-accent to-primary rounded-full mx-auto mt-3"></div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-16 animate-slide-up-fade" style={{animationDelay: '0.6s'}}>
                <p className="text-lg text-muted-foreground mb-6">
                  Prêt à créer un CV qui fait la différence ?
                </p>
                <div className="flex justify-center space-x-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300 hover-lift px-8"
                    onClick={() => document.getElementById('templates-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Découvrir les templates
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-primary/30 hover:bg-primary/5 hover-lift px-8"
                    onClick={() => navigate("/cv-builder")}
                  >
                    Créer depuis zéro
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main id="templates-section" className="container mx-auto px-4 py-20 relative z-10">
          <TemplateGallery 
            templates={templates}
            onSelectTemplate={handleSelectTemplate}
            selectedTemplate={selectedTemplate}
          />

          {/* Enhanced Create CV Dialog */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogContent className="sm:max-w-[500px] border-0 shadow-elegant bg-card/95 backdrop-blur-xl">
              <DialogHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-glow">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <DialogTitle className="text-2xl font-bold">Créer votre CV</DialogTitle>
                <DialogDescription className="text-base">
                  Template sélectionné: <span className="font-semibold text-primary">
                    {templates.find(t => t.id === selectedTemplate)?.name || selectedTemplate}
                  </span>
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="cv-title" className="text-base font-semibold">Titre de votre CV</Label>
                  <Input
                    id="cv-title"
                    value={newCVTitle}
                    onChange={(e) => setNewCVTitle(e.target.value)}
                    placeholder="Ex: CV Développeur Frontend Senior"
                    className="h-12 text-lg border-border/50 focus:border-primary/50 focus:ring-primary/20"
                  />
                  <p className="text-sm text-muted-foreground">
                    Ce titre vous aidera à identifier facilement votre CV dans votre dashboard
                  </p>
                </div>
              </div>
              
              <DialogFooter className="pt-6 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateDialog(false)}
                  className="flex-1 h-12 border-border/50 hover:bg-accent/10"
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleCreateCV} 
                  disabled={isCreating || !newCVTitle.trim()}
                  className="flex-1 h-12 bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-shadow disabled:opacity-50"
                >
                  {isCreating ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Création...</span>
                    </div>
                  ) : (
                    "Créer mon CV"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>

        {/* Floating Status Card */}
        <div className="fixed bottom-8 right-8 z-40 animate-slide-up-fade">
          <div className="glass-morphism rounded-xl p-4 shadow-elegant animate-shimmer">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground font-medium">
                {templates.length} templates disponibles
              </span>
            </div>
          </div>
        </div>
        
        {/* Back to Top Button */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 left-8 z-40 w-12 h-12 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center shadow-glow hover-lift animate-bounce-gentle"
        >
          <ArrowLeft className="h-5 w-5 text-white rotate-90" />
        </button>
      </div>
    </div>
  );
};

export default Templates;