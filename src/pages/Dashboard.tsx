import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Eye, Edit3, Download, LogOut, User as UserIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock CV data - later will be fetched from Supabase
  const [cvs] = useState([
    {
      id: "1",
      name: "CV Développeur Frontend",
      lastModified: "2024-01-15",
      status: "publié",
      template: "Moderne"
    },
    {
      id: "2", 
      name: "CV Marketing Digital",
      lastModified: "2024-01-10",
      status: "brouillon",
      template: "Créatif"
    }
  ]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }
      
      setUser(session.user);
      setIsLoading(false);
    };

    checkAuth();

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
  }, [navigate]);

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

  const handleCreateCV = () => {
    navigate("/cv-builder");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "publié":
        return "bg-success text-success-foreground";
      case "brouillon":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
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
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
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
          <Card className="border-0 shadow-card hover:shadow-elegant transition-smooth cursor-pointer" onClick={handleCreateCV}>
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

          <Card className="border-0 shadow-card">
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
            <h2 className="text-2xl font-semibold">Mes CV</h2>
            <Button onClick={handleCreateCV}>
              <Plus className="w-4 h-4 mr-2" />
              Créer un CV
            </Button>
          </div>

          {cvs.length === 0 ? (
            <Card className="border-0 shadow-card">
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun CV créé</h3>
                <p className="text-muted-foreground mb-4">
                  Commencez par créer votre premier CV professionnel
                </p>
                <Button onClick={handleCreateCV}>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer mon premier CV
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {cvs.map((cv) => (
                <Card key={cv.id} className="border-0 shadow-card hover:shadow-elegant transition-smooth">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{cv.name}</h3>
                          <Badge className={getStatusColor(cv.status)}>
                            {cv.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-x-4">
                          <span>Modifié le {cv.lastModified}</span>
                          <span>•</span>
                          <span>Template: {cv.template}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
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