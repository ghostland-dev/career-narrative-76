import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Eye, 
  Edit3,
  FileText,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Globe,
  Printer,
  Link as LinkIcon,
  Copy,
  ExternalLink
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getCV } from "@/lib/cv-service";
import { exportToPDF } from "@/lib/pdf-export";
import CVDisplay from "@/components/CVDisplay";

const CVPreview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [cv, setCv] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    checkAuth();
    if (id) {
      loadCV();
    }
  }, [id]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const loadCV = async () => {
    if (!id) return;
    
    try {
      const cvData = await getCV(id);
      setCv(cvData);
      setShareUrl(`${window.location.origin}/cv-public/${id}`);
    } catch (error) {
      console.error("Error loading CV:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le CV.",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!cv) return;
    
    try {
      await exportToPDF('cv-preview-content', `${cv.title}.pdf`);
      toast({
        title: "Export réussi",
        description: "Votre CV a été exporté en PDF.",
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter le CV en PDF.",
        variant: "destructive",
      });
    }
  };

  const handleCopyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Lien copié",
        description: "Le lien de partage a été copié dans le presse-papiers.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Présent";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-8 w-8 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Chargement du CV...</p>
        </div>
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-card text-center">
          <CardContent className="pt-6">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">CV introuvable</h3>
            <p className="text-muted-foreground mb-4">
              Le CV demandé n'existe pas ou vous n'avez pas l'autorisation de le voir.
            </p>
            <Button onClick={() => navigate("/dashboard")}>
              Retour au Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const personalInfo = cv.personal_info as any || {};
  const experience = cv.experience as any[] || [];
  const education = cv.education as any[] || [];
  const skills = cv.skills as string[] || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="font-semibold">{cv.title}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={handleCopyShareUrl}>
              <Share2 className="h-4 w-4 mr-2" />
              Partager
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate(`/cv-builder/${id}`)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{cv.title}</h1>
              <p className="text-muted-foreground">
                Dernière modification : {new Date(cv.updated_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={cv.is_published ? "default" : "secondary"}>
                {cv.is_published ? "Publié" : "Brouillon"}
              </Badge>
            </div>
          </div>

          {/* CV Content - Optimisé pour A4 */}
          <Card className="border-0 shadow-elegant print:shadow-none">
            <CardContent id="cv-preview-content" className="p-0 print:p-0">
              <CVDisplay
                personalInfo={personalInfo}
                experience={experience}
                education={education}
                skills={skills}
                templateStyle="modern"
              />
            </CardContent>
          </Card>

          {/* Share Section */}
          <Card className="mt-6 border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Share2 className="h-5 w-5 mr-2" />
                Partager votre CV
              </CardTitle>
              <CardDescription>
                Partagez votre CV avec un lien public ou téléchargez-le en PDF
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm">
                  {shareUrl}
                </div>
                <Button size="sm" variant="outline" onClick={handleCopyShareUrl}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => window.open(shareUrl, '_blank')}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={handleExportPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger PDF
                </Button>
                <Button size="sm" variant="outline" onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CVPreview;