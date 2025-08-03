import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Save, 
  Download, 
  Eye, 
  ArrowLeft, 
  User, 
  Briefcase, 
  GraduationCap, 
  Award,
  Plus,
  Trash2,
  Loader2,
  Sparkles,
  Upload,
  Mail,
  Wand2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getCV, updateCV, createCV, type CVData } from "@/lib/cv-service";
import { exportToPDF, previewPDF } from "@/lib/pdf-export";
import AppLayout from "@/components/AppLayout";
import LoadingScreen from "@/components/LoadingScreen";
import AIOptimizer from "@/components/AIOptimizer";
import CoverLetterGenerator from "@/components/CoverLetterGenerator";
import CVTextParser from "@/components/CVTextParser";
import CVDisplay from "@/components/CVDisplay";

const CVBuilder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [cvTitle, setCvTitle] = useState("");
  const [showCoverLetterDialog, setShowCoverLetterDialog] = useState(false);
  const [showTextParserDialog, setShowTextParserDialog] = useState(false);

  const [cvData, setCvData] = useState<CVData["personal_info"] & { experience: CVData["experience"], education: CVData["education"], skills: CVData["skills"] }>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    summary: "",
    experience: [],
    education: [],
    skills: []
  });

  const [newSkill, setNewSkill] = useState("");

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
    
    setIsLoading(true);
    try {
      const cv = await getCV(id);
      setCvTitle(cv.title);
      const personalInfo = cv.personal_info as any;
      const experience = cv.experience as any[];
      const education = cv.education as any[];
      const skills = cv.skills as string[];
      
      setCvData({
        fullName: personalInfo?.fullName || "",
        email: personalInfo?.email || "",
        phone: personalInfo?.phone || "",
        address: personalInfo?.address || "",
        summary: personalInfo?.summary || "",
        experience: experience || [],
        education: education || [],
        skills: skills || []
      });
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

  const handleOptimizedData = (optimizedData: any) => {
    setCvData(optimizedData);
    toast({
      title: "CV optimisé !",
      description: "Les améliorations IA ont été appliquées avec succès.",
    });
  };

  const handleParsedData = (parsedData: any) => {
    setCvData({
      fullName: parsedData.personal_info?.fullName || "",
      email: parsedData.personal_info?.email || "",
      phone: parsedData.personal_info?.phone || "",
      address: parsedData.personal_info?.address || "",
      summary: parsedData.personal_info?.summary || "",
      experience: parsedData.experience || [],
      education: parsedData.education || [],
      skills: parsedData.skills || []
    });
    toast({
      title: "Données importées !",
      description: "Votre CV a été rempli automatiquement.",
    });
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: ""
    };
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const removeExperience = (id: string) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      description: ""
    };
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const removeEducation = (id: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !cvData.skills.includes(newSkill.trim())) {
      setCvData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const cvDataToSave = {
        title: cvTitle || "Mon CV",
        template_id: "modern",
        personal_info: {
          fullName: cvData.fullName,
          email: cvData.email,
          phone: cvData.phone,
          address: cvData.address,
          summary: cvData.summary
        },
        experience: cvData.experience,
        education: cvData.education,
        skills: cvData.skills
      };

      if (id) {
        await updateCV(id, cvDataToSave);
        toast({
          title: "CV sauvegardé",
          description: "Vos modifications ont été enregistrées avec succès.",
        });
      } else {
        const newCV = await createCV(cvDataToSave);
        toast({
          title: "CV créé",
          description: "Votre CV a été créé avec succès.",
        });
        navigate(`/cv-builder/${newCV.id}`);
      }
    } catch (error) {
      console.error("Error saving CV:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le CV.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF('cv-preview', `${cvTitle || 'CV'}.pdf`);
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

  const handlePreviewPDF = async () => {
    try {
      await previewPDF('cv-preview');
    } catch (error) {
      console.error("Error previewing PDF:", error);
      toast({
        title: "Erreur d'aperçu",
        description: "Impossible d'afficher l'aperçu PDF.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Chargement du CV..." />;
  }

  const headerActions = (
    <div className="flex items-center space-x-3">
      <Button variant="outline" size="sm" onClick={() => setShowTextParserDialog(true)}>
        <Upload className="h-4 w-4 mr-2" />
        Importer texte
      </Button>
      <Button variant="outline" size="sm" onClick={() => setShowCoverLetterDialog(true)}>
        <Mail className="h-4 w-4 mr-2" />
        Lettre de motivation
      </Button>
      <Button variant="outline" size="sm" onClick={handlePreviewPDF}>
        <Eye className="h-4 w-4 mr-2" />
        Aperçu PDF
      </Button>
      <Button variant="outline" size="sm" onClick={handleExportPDF}>
        <Download className="h-4 w-4 mr-2" />
        Télécharger PDF
      </Button>
      <Button size="sm" onClick={handleSave} disabled={isSaving} className="animate-pulse-glow">
        {isSaving ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Sauvegarde...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </>
        )}
      </Button>
    </div>
  );

  return (
    <AppLayout
      title={id ? "Modifier le CV" : "Nouveau CV"}
      subtitle={cvTitle || "CV sans titre"}
      showBackButton={true}
      backTo="/dashboard"
      actions={headerActions}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Editor Panel */}
          <div className="lg:col-span-8 space-y-6">
            {/* CV Title */}
            <Card className="border-0 shadow-modern">
              <div className="p-6">
                <Label htmlFor="cv-title" className="text-base font-semibold">Titre du CV</Label>
                <Input
                  id="cv-title"
                  value={cvTitle}
                  onChange={(e) => setCvTitle(e.target.value)}
                  placeholder="Ex: CV Développeur Frontend"
                  className="mt-2 text-lg font-medium"
                />
              </div>
            </Card>

            {/* Main Content Tabs */}
            <Card className="border-0 shadow-modern">
              <div className="p-6">
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="personal" className="text-sm font-medium">
                      <User className="h-4 w-4 mr-2" />
                      Personnel
                    </TabsTrigger>
                    <TabsTrigger value="experience" className="text-sm font-medium">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Expérience
                    </TabsTrigger>
                    <TabsTrigger value="education" className="text-sm font-medium">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Formation
                    </TabsTrigger>
                    <TabsTrigger value="skills" className="text-sm font-medium">
                      <Award className="h-4 w-4 mr-2" />
                      Compétences
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nom complet</Label>
                        <Input
                          id="fullName"
                          value={cvData.fullName}
                          onChange={(e) => setCvData(prev => ({
                            ...prev,
                            fullName: e.target.value
                          }))}
                          placeholder="Jean Dupont"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={cvData.email}
                          onChange={(e) => setCvData(prev => ({
                            ...prev,
                            email: e.target.value
                          }))}
                          placeholder="jean.dupont@email.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          value={cvData.phone}
                          onChange={(e) => setCvData(prev => ({
                            ...prev,
                            phone: e.target.value
                          }))}
                          placeholder="+33 1 23 45 67 89"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Adresse</Label>
                        <Input
                          id="address"
                          value={cvData.address}
                          onChange={(e) => setCvData(prev => ({
                            ...prev,
                            address: e.target.value
                          }))}
                          placeholder="Paris, France"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="summary">Résumé professionnel</Label>
                      <Textarea
                        id="summary"
                        value={cvData.summary}
                        onChange={(e) => setCvData(prev => ({
                          ...prev,
                          summary: e.target.value
                        }))}
                        placeholder="Décrivez brièvement votre profil professionnel..."
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="experience" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Expérience professionnelle</h3>
                      <Button size="sm" onClick={addExperience} className="animate-scale-in">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter
                      </Button>
                    </div>
                    
                    <div className="space-y-6">
                      {cvData.experience.map((exp, index) => (
                        <Card key={exp.id} className="border border-border/50 p-6 hover:shadow-card transition-smooth">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-muted-foreground">
                              Expérience {index + 1}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExperience(exp.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <Label>Poste</Label>
                              <Input
                                value={exp.title}
                                onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                                placeholder="Développeur Frontend"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Entreprise</Label>
                              <Input
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                                placeholder="Tech Company"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="space-y-2">
                              <Label>Lieu</Label>
                              <Input
                                value={exp.location}
                                onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                                placeholder="Paris, France"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Date de début</Label>
                              <Input
                                type="month"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Date de fin</Label>
                              <Input
                                type="month"
                                value={exp.endDate}
                                onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                                placeholder="Présent"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              value={exp.description}
                              onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                              placeholder="Décrivez vos responsabilités et réalisations..."
                              rows={3}
                              className="resize-none"
                            />
                          </div>
                        </Card>
                      ))}
                      
                      {cvData.experience.length === 0 && (
                        <Card className="border-dashed border-2 border-border p-12 text-center">
                          <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                          <h3 className="text-lg font-medium mb-2">Aucune expérience ajoutée</h3>
                          <p className="text-muted-foreground mb-4">Cliquez sur "Ajouter" pour commencer</p>
                          <Button onClick={addExperience}>
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter une expérience
                          </Button>
                        </Card>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="education" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Formation</h3>
                      <Button size="sm" onClick={addEducation} className="animate-scale-in">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter
                      </Button>
                    </div>
                    
                    <div className="space-y-6">
                      {cvData.education.map((edu, index) => (
                        <Card key={edu.id} className="border border-border/50 p-6 hover:shadow-card transition-smooth">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-muted-foreground">
                              Formation {index + 1}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEducation(edu.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <Label>Diplôme</Label>
                              <Input
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                                placeholder="Master en Informatique"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Établissement</Label>
                              <Input
                                value={edu.institution}
                                onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                                placeholder="Université de Paris"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="space-y-2">
                              <Label>Lieu</Label>
                              <Input
                                value={edu.location}
                                onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                                placeholder="Paris, France"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Date de début</Label>
                              <Input
                                type="month"
                                value={edu.startDate}
                                onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Date de fin</Label>
                              <Input
                                type="month"
                                value={edu.endDate}
                                onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              value={edu.description}
                              onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                              placeholder="Spécialisations, mentions, projets..."
                              rows={2}
                              className="resize-none"
                            />
                          </div>
                        </Card>
                      ))}
                      
                      {cvData.education.length === 0 && (
                        <Card className="border-dashed border-2 border-border p-12 text-center">
                          <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                          <h3 className="text-lg font-medium mb-2">Aucune formation ajoutée</h3>
                          <p className="text-muted-foreground mb-4">Cliquez sur "Ajouter" pour commencer</p>
                          <Button onClick={addEducation}>
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter une formation
                          </Button>
                        </Card>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Compétences</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Ajouter une compétence..."
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                          className="flex-1"
                        />
                        <Button onClick={addSkill} disabled={!newSkill.trim()}>
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter
                        </Button>
                      </div>
                      
                      {cvData.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {cvData.skills.map((skill, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium animate-scale-in"
                              style={{ animationDelay: `${index * 0.1}s` }}
                            >
                              <span>{skill}</span>
                              <button
                                onClick={() => removeSkill(skill)}
                                className="text-primary hover:text-destructive transition-colors"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Card className="border-dashed border-2 border-border p-12 text-center">
                          <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                          <h3 className="text-lg font-medium mb-2">Aucune compétence ajoutée</h3>
                          <p className="text-muted-foreground">Ajoutez vos compétences techniques et soft skills</p>
                        </Card>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          </div>

          {/* AI Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <AIOptimizer 
                cvData={cvData} 
                onOptimizedData={handleOptimizedData} 
              />
            </div>
          </div>
        </div>

        {/* CV Preview - Optimisé pour A4 */}
        <div className="mt-12">
          <Card className="border-0 shadow-modern">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Eye className="h-5 w-5 mr-2 text-primary" />
                Aperçu du CV (Format A4)
              </h3>
              <div id="cv-preview" className="overflow-hidden rounded-lg border">
                <CVDisplay
                  personalInfo={{
                    fullName: cvData.fullName,
                    email: cvData.email,
                    phone: cvData.phone,
                    address: cvData.address,
                    summary: cvData.summary
                  }}
                  experience={cvData.experience}
                  education={cvData.education}
                  skills={cvData.skills}
                  templateStyle="modern"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <CoverLetterGenerator 
        cv={{
          personal_info: {
            fullName: cvData.fullName,
            email: cvData.email,
            phone: cvData.phone,
            address: cvData.address,
            summary: cvData.summary
          },
          experience: cvData.experience,
          education: cvData.education,
          skills: cvData.skills
        }}
        isOpen={showCoverLetterDialog}
        onClose={() => setShowCoverLetterDialog(false)}
      />

      <CVTextParser 
        isOpen={showTextParserDialog}
        onClose={() => setShowTextParserDialog(false)}
        onDataParsed={handleParsedData}
      />
    </AppLayout>
  );
};

export default CVBuilder;