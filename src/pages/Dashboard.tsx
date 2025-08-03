import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, FileText, Eye, Edit3, Download, LogOut, UserIcon, Trash2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getUserCVs, deleteCV, createCV, getTemplates, type CVTemplate } from "@/lib/cv-service";
import type { User } from "@supabase/supabase-js";

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

  const handleDeleteCV = async (id: string, title: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le CV "${title}" ?`)) {
      return;
    }

    try {
      await deleteCV(id);
      toast({
        title: "CV supprimé",
        description: "Le CV a été supprimé avec succès.",
      });
      loadCVs();
    } catch (error) {
      console.error("Error deleting CV:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le CV.",
        variant: "destructive",
      });
    }
  };

  const filteredCVs = cvs.filter(cv =>
    cv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (isPublished: boolean) => {
    return isPublished
      ? "bg-success text-success-foreground"
      : "bg-muted text-muted-foreground";
  };

  const getTemplateDisplay = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    return template?.name || templateId;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-8 w-8 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">CVCraft</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/profile")}>
                <Settings className="h-4 w-4 mr-2" />
                Profil
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/support")}>
                <HelpCircle className="h-4 w-4 mr-2" />
                Aide
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Gérez vos CV et créez de nouveaux designs professionnels
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Card className="border-0 shadow-card hover:shadow-elegant transition-smooth cursor-pointer">
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

          <Card className="border-0 shadow-card" onClick={() => navigate("/templates")}>
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

          <Card className="border-0 shadow-card">
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
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Créer un CV
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </div>

          {filteredCVs.length === 0 ? (
            <Card className="border-0 shadow-card">
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
              {filteredCVs.map((cv) => (
                <Card key={cv.id} className="border-0 shadow-card hover:shadow-elegant transition-smooth">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{cv.title}</h3>
                          <Badge className={getStatusColor(cv.is_published)}>
                            {cv.is_published ? "Publié" : "Brouillon"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-x-4">
                          <span>Modifié le {new Date(cv.updated_at).toLocaleDateString('fr-FR')}</span>
                          <span>•</span>
                          <span>Template: {getTemplateDisplay(cv.template_id)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/cv-preview/${cv.id}`)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Aperçu
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/cv-builder/${cv.id}`)}>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Modifier
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Exporter
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCV(cv.id, cv.title)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;