import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, FileText, Download, LogOut, UserIcon, Search, Settings, HelpCircle, TrendingUp, Users, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getUserCVs, deleteCV, createCV, getTemplates, type CVTemplate } from "@/lib/cv-service";
import type { User } from "@supabase/supabase-js";
import AppLayout from "@/components/AppLayout";
import LoadingScreen from "@/components/LoadingScreen";
import CVCard from "@/components/CVCard";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cvs, setCvs] = useState<any[]>([]);
  const [templates, setTemplates] = useState<CVTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCVTitle, setNewCVTitle] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    loadTemplates();
  }, []);

  useEffect(() => {
    if (user) {
      loadCVs();
    }
  }, [user]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }
    
    setUser(session.user);
    setIsLoading(false);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate("/auth");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  };

  const loadCVs = async () => {
    try {
      const data = await getUserCVs();
      setCvs(data);
    } catch (error) {
      console.error("Error loading CVs:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos CV.",
        variant: "destructive",
      });
    }
  };

  const loadTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error("Error loading templates:", error);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter.",
        variant: "destructive",
      });
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

      setShowCreateDialog(false);
      setNewCVTitle("");
      setSelectedTemplate("modern");
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

  const handleDeleteCV = useCallback(async (id: string, title: string) => {
    try {
      await deleteCV(id);
      toast({
        title: "CV supprimé",
        description: "Le CV a été supprimé avec succès.",
      });
      await loadCVs();
    } catch (error) {
      console.error("Error deleting CV:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le CV.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleDuplicateCV = useCallback(async (id: string) => {
    try {
      // Implementation for duplicating a CV would go here
      toast({
        title: "Fonctionnalité à venir",
        description: "La duplication de CV sera bientôt disponible.",
      });
    } catch (error) {
      console.error("Error duplicating CV:", error);
      toast({
        title: "Erreur",
        description: "Impossible de dupliquer le CV.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const filteredCVs = cvs.filter(cv =>
    cv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTemplateDisplay = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    return template?.name || templateId;
  };

  const getDashboardStats = () => {
    const totalCVs = cvs.length;
    const publishedCVs = cvs.filter(cv => cv.is_published).length;
    const lastModified = cvs.length > 0 ? 
      Math.max(...cvs.map(cv => new Date(cv.updated_at).getTime())) : 0;
    
    return { totalCVs, publishedCVs, lastModified };
  };

  if (isLoading) {
    return <LoadingScreen message="Chargement de votre dashboard..." />;
  }

  const stats = getDashboardStats();

  const headerActions = (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <UserIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{user?.email}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/profile">
            <Settings className="h-4 w-4 mr-2" />
            Profil
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/support">
            <HelpCircle className="h-4 w-4 mr-2" />
            Aide
          </Link>
        </Button>
      </div>
    </div>
  );

  return (
    <AppLayout
      title="Dashboard"
      subtitle="Gérez vos CV et créez de nouveaux designs professionnels"
      actions={headerActions}
    >
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total CV</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCVs}</div>
              <p className="text-xs text-muted-foreground">
                CV créés au total
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CV Publiés</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.publishedCVs}</div>
              <p className="text-xs text-muted-foreground">
                Prêts à être partagés
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dernière activité</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.lastModified ? 
                  new Date(stats.lastModified).toLocaleDateString('fr-FR', { 
                    day: '2-digit', 
                    month: 'short' 
                  }) : 
                  'Aucune'
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Dernière modification
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Card className="border-0 shadow-card hover:shadow-elegant transition-smooth cursor-pointer animate-scale-in">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Nouveau CV</CardTitle>
                  <CardDescription>
                    Créez un CV professionnel à partir de zéro
                  </CardDescription>
                </CardHeader>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un nouveau CV</DialogTitle>
                <DialogDescription>
                  Choisissez un titre et un template pour votre nouveau CV
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
                <div className="space-y-2">
                  <Label htmlFor="template">Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

          <Card 
            className="border-0 shadow-card hover:shadow-elegant transition-smooth cursor-pointer animate-scale-in" 
            onClick={() => navigate("/templates")}
            style={{ animationDelay: '0.1s' }}
          >
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <CardTitle className="text-lg">Templates</CardTitle>
              <CardDescription>
                Parcourez nos modèles professionnels
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="border-0 shadow-card hover:shadow-elegant transition-smooth cursor-pointer animate-scale-in"
            style={{ animationDelay: '0.2s' }}
          >
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary-glow/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-primary-glow" />
              </div>
              <CardTitle className="text-lg">Exports</CardTitle>
              <CardDescription>
                Téléchargez vos CV en PDF ou autres formats
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CV List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Mes CV ({cvs.length})</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un CV..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="animate-pulse-glow">
                    <Plus className="w-4 h-4 mr-2" />
                    Créer un CV
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </div>

          {filteredCVs.length === 0 ? (
            <Card className="border-0 shadow-card animate-fade-in">
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchQuery ? "Aucun CV trouvé" : "Aucun CV créé"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? "Aucun CV ne correspond à votre recherche"
                    : "Commencez par créer votre premier CV professionnel"
                  }
                </p>
                {!searchQuery && (
                  <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Créer mon premier CV
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredCVs.map((cv, index) => (
                <div 
                  key={cv.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CVCard
                    cv={cv}
                    onDelete={handleDeleteCV}
                    onDuplicate={handleDuplicateCV}
                    templateName={getTemplateDisplay(cv.template_id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;