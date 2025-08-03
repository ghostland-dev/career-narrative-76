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

          {/* CV Content */}
          <Card className="border-0 shadow-elegant">
            <CardContent id="cv-preview-content" className="p-12 bg-white text-black min-h-[842px]">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {personalInfo.fullName || "Nom non renseigné"}
                </h1>
                <div className="flex flex-wrap justify-center items-center gap-4 text-gray-600">
                  {personalInfo.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{personalInfo.email}</span>
                    </div>
                  )}
                  {personalInfo.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{personalInfo.phone}</span>
                    </div>
                  )}
                  {personalInfo.address && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{personalInfo.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              {personalInfo.summary && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-primary mb-4 border-b-2 border-primary pb-2">
                    Résumé Professionnel
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {personalInfo.summary}
                  </p>
                </div>
              )}

              {/* Experience */}
              {experience.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-primary mb-4 border-b-2 border-primary pb-2">
                    Expérience Professionnelle
                  </h2>
                  <div className="space-y-6">
                    {experience.map((exp, index) => (
                      <div key={index} className="relative pl-6 border-l-2 border-gray-200">
                        <div className="absolute w-4 h-4 bg-primary rounded-full -left-2 top-1"></div>
                        <div className="mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {exp.title}
                          </h3>
                          <div className="text-lg text-primary font-medium">
                            {exp.company} • {exp.location}
                          </div>
                          <div className="text-gray-600 flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                          </div>
                        </div>
                        {exp.description && (
                          <p className="text-gray-700 leading-relaxed">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-primary mb-4 border-b-2 border-primary pb-2">
                    Formation
                  </h2>
                  <div className="space-y-6">
                    {education.map((edu, index) => (
                      <div key={index} className="relative pl-6 border-l-2 border-gray-200">
                        <div className="absolute w-4 h-4 bg-primary rounded-full -left-2 top-1"></div>
                        <div className="mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {edu.degree}
                          </h3>
                          <div className="text-lg text-primary font-medium">
                            {edu.institution} • {edu.location}
                          </div>
                          <div className="text-gray-600 flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                          </div>
                        </div>
                        {edu.description && (
                          <p className="text-gray-700 leading-relaxed">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-primary mb-4 border-b-2 border-primary pb-2">
                    Compétences
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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