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
  Wand2,
  Edit3
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
import PhotoUpload from "@/components/PhotoUpload";
import SpellChecker from "@/components/SpellChecker";
import CVEnhancedBuilder from "@/components/CVEnhancedBuilder";
import CVInlineEditor from "@/components/CVInlineEditor";
import SpacingControls from "@/components/SpacingControls";
import TemplateSelector from "@/components/TemplateSelector";
import DesignSystem from "@/components/DesignSystem";
import DesignCustomizer from "@/components/DesignCustomizer";
import CVSectionManager from "@/components/CVSectionManager";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { useAutoSave } from "@/hooks/useAutoSave";
import { toastActions } from "@/components/EnhancedToast";

const CVBuilder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [cvTitle, setCvTitle] = useState("");
  const [showCoverLetterDialog, setShowCoverLetterDialog] = useState(false);
  const [showTextParserDialog, setShowTextParserDialog] = useState(false);
  const [currentTab, setCurrentTab] = useState('personal');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [templateStyle, setTemplateStyle] = useState<"modern" | "classic" | "minimal" | "print" | "creative" | "professional" | "elegant" | "tech">("modern");
  
  // Design system state
  const [currentFont, setCurrentFont] = useState("Inter");
  const [colorPalette, setColorPalette] = useState({
    primary: "#2563eb",
    secondary: "#64748b", 
    accent: "#0ea5e9",
    text: "#1e293b",
    background: "#ffffff",
    muted: "#f1f5f9"
  });
  
  // Advanced design settings
  const [designSettings, setDesignSettings] = useState({
    pageMargin: 2,
    sectionSpacing: 2,
    useCustomColors: false,
    fontFamily: "Montserrat",
    fontSize: "medium" as "small" | "medium" | "large",
    lineHeight: 1.5,
    backgroundStyle: "none" as "none" | "subtle" | "gradient",
    primaryColor: "#2563eb",
    secondaryColor: "#64748b",
    textColor: "#1e293b",
    backgroundColor: "#ffffff"
  });
  
  // Spacing settings
  const [spacingSettings, setSpacingSettings] = useState({
    pageMargin: 32,
    sectionSpacing: 24,
    itemSpacing: 16,
    lineHeight: 1.5,
    headerPadding: 16,
    contentPadding: 16,
    borderRadius: 8,
    fontSize: 14
  });

  const [cvData, setCvData] = useState<CVData["personal_info"] & { 
    experience: CVData["experience"], 
    education: CVData["education"], 
    skills: CVData["skills"],
    languages: CVData["languages"],
    interests: CVData["interests"],
    certifications: CVData["certifications"],
    projects: CVData["projects"],
    photo_url: CVData["photo_url"],
    cvSections: any[],
    birthDate: string
  }>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    summary: "",
    birthDate: "",
    experience: [],
    education: [],
    skills: [],
    languages: [],
    interests: [],
    certifications: [],
    projects: [],
    photo_url: undefined,
    cvSections: []
  });

  const [newSkill, setNewSkill] = useState("");

  // Auto-save functionality
  useAutoSave({
    data: cvData,
    onSave: async () => {
      if (id && cvData) {
        const cvDataToSave = {
          title: cvTitle || "Mon CV",
          template_id: templateStyle,
        personal_info: {
          fullName: cvData.fullName,
          email: cvData.email,
          phone: cvData.phone,
          address: cvData.address,
          summary: cvData.summary,
          birthDate: cvData.birthDate
        },
          experience: cvData.experience,
          education: cvData.education,
          skills: cvData.skills,
          languages: cvData.languages,
          interests: cvData.interests,
          certifications: cvData.certifications,
          projects: cvData.projects,
          photo_url: cvData.photo_url,
          cv_sections: cvData.cvSections
        };
        await updateCV(id, cvDataToSave);
        toastActions.autoSave();
      }
    },
    enabled: autoSaveEnabled && !isSaving && !!id,
    delay: 2000
  });

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
      setTemplateStyle(cv.template_id as any || "modern");
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
        birthDate: personalInfo?.birthDate || "",
        experience: experience || [],
        education: education || [],
        skills: skills || [],
        languages: (cv.languages as any[]) || [],
        interests: (cv.interests as string[]) || [],
        certifications: (cv.certifications as any[]) || [],
        projects: (cv.projects as any[]) || [],
        photo_url: cv.photo_url || undefined,
        cvSections: (cv as any).cv_sections || []
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
    toastActions.optimizationComplete("CV");
  };

  const handleParsedData = (parsedData: any) => {
    setCvData({
      fullName: parsedData.personal_info?.fullName || "",
      email: parsedData.personal_info?.email || "",
      phone: parsedData.personal_info?.phone || "",
      address: parsedData.personal_info?.address || "",
      summary: parsedData.personal_info?.summary || "",
      birthDate: parsedData.personal_info?.birthDate || "",
      experience: parsedData.experience || [],
      education: parsedData.education || [],
      skills: parsedData.skills || [],
      languages: [],
        interests: [],
        certifications: [],
        projects: [],
        photo_url: undefined,
        cvSections: []
    });
    toastActions.importSuccess();
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
    setAutoSaveEnabled(false);
    
    try {
      const cvDataToSave = {
        title: cvTitle || "Mon CV",
        template_id: templateStyle,
        personal_info: {
          fullName: cvData.fullName,
          email: cvData.email,
          phone: cvData.phone,
          address: cvData.address,
          summary: cvData.summary,
          birthDate: cvData.birthDate
        },
        experience: cvData.experience,
        education: cvData.education,
        skills: cvData.skills,
        languages: cvData.languages,
        interests: cvData.interests,
        certifications: cvData.certifications,
        projects: cvData.projects,
        photo_url: cvData.photo_url,
        cv_sections: cvData.cvSections
      };

      if (id) {
        await updateCV(id, cvDataToSave);
        toastActions.manualSave();
      } else {
        const newCV = await createCV(cvDataToSave);
        toastActions.manualSave();
        navigate(`/cv-builder/${newCV.id}`);
      }
    } catch (error) {
      toastActions.saveError();
      console.error("Error saving CV:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le CV.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setAutoSaveEnabled(true), 1000);
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF('cv-preview', `${cvTitle || 'CV'}.pdf`);
      toastActions.exportSuccess();
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
          {/* Progress Indicator */}
          <div className="lg:col-span-3">
            <ProgressIndicator
              sections={[
                {
                  id: 'personal',
                  name: 'Informations personnelles',
                  required: true,
                  completed: !!(cvData?.fullName && cvData?.email)
                },
                {
                  id: 'experience',
                  name: 'Expérience professionnelle',
                  required: true,
                  completed: !!(cvData?.experience && cvData.experience.length > 0)
                },
                {
                  id: 'education',
                  name: 'Formation',
                  required: true,
                  completed: !!(cvData?.education && cvData.education.length > 0)
                },
                {
                  id: 'skills',
                  name: 'Compétences',
                  required: false,
                  completed: !!(cvData?.skills && cvData.skills.length > 0)
                },
                {
                  id: 'additional',
                  name: 'Informations supplémentaires',
                  required: false,
                  completed: !!(cvData?.languages?.length || cvData?.interests?.length || cvData?.certifications?.length || cvData?.projects?.length)
                },
                {
                  id: 'review',
                  name: 'Révision et optimisation',
                  required: false,
                  completed: false
                }
              ]}
              currentSection={currentTab}
              onSectionClick={setCurrentTab}
            />
          </div>
          
          {/* Main Editor Panel */}
          <div className="lg:col-span-9 space-y-6">
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
                <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-6 mb-6">
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
                    <TabsTrigger value="sections" className="text-sm font-medium">
                      <Plus className="h-4 w-4 mr-2" />
                      Sections
                    </TabsTrigger>
                    <TabsTrigger value="review" className="text-sm font-medium">
                      <Wand2 className="h-4 w-4 mr-2" />
                      Révision
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
                    <div className="grid grid-cols-3 gap-6">
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
                      <div className="space-y-2">
                        <Label htmlFor="birthDate">Date de naissance</Label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={cvData.birthDate}
                          onChange={(e) => setCvData(prev => ({
                            ...prev,
                            birthDate: e.target.value
                          }))}
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

                  <TabsContent value="sections" className="space-y-6">
                    <CVSectionManager
                      sections={cvData.cvSections || []}
                      onSectionsChange={(sections) => setCvData(prev => ({
                        ...prev,
                        cvSections: sections
                      }))}
                    />
                  </TabsContent>

                  <TabsContent value="additional" className="space-y-6">
                    <CVEnhancedBuilder cvData={cvData} setCvData={setCvData} />
                  </TabsContent>

                  <TabsContent value="review" className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold mb-2">Design et personnalisation</h3>
                      <p className="text-muted-foreground">
                        Personnalisez l'apparence et le style de votre CV
                      </p>
                    </div>
                    
                    {/* New Advanced Design Customizer */}
                    <DesignCustomizer
                      settings={designSettings}
                      onSettingsChange={setDesignSettings}
                    />
                    
                    <Separator className="my-6" />
                    
                    {/* Quick Template Selector */}
                    <TemplateSelector 
                      currentTemplate={templateStyle}
                      onTemplateChange={(template) => setTemplateStyle(template as any)}
                    />
                    
                    <Separator className="my-6" />
                    
                    {/* Spell Checker */}
                    <div className="space-y-4">
                      <h4 className="text-md font-semibold flex items-center">
                        <Edit3 className="h-5 w-5 mr-2 text-primary" />
                        Vérification orthographique
                      </h4>
                      <SpellChecker 
                        text={`${cvData.fullName} ${cvData.summary} ${cvData.experience.map(exp => `${exp.title} ${exp.description}`).join(' ')} ${cvData.education.map(edu => `${edu.degree} ${edu.description}`).join(' ')}`}
                        onCorrectedText={(correctedText) => {
                          toast({
                            title: "Corrections appliquées",
                            description: "Consultez les modifications dans les sections correspondantes.",
                          });
                        }}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>

            <PhotoUpload
              currentPhotoUrl={cvData.photo_url}
              onPhotoUpload={(photoUrl) => {
                setCvData(prev => ({ ...prev, photo_url: photoUrl }));
              }}
              onPhotoRemove={() => {
                setCvData(prev => ({ ...prev, photo_url: undefined }));
              }}
            />
          </div>
        </div>

        {/* AI Optimizer */}
        <div className="mt-8">
          <AIOptimizer 
            cvData={cvData} 
            onOptimizedData={handleOptimizedData} 
          />
        </div>

        {/* CV Preview */}
        <div className="mt-12">
          <Card className="border-0 shadow-modern">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-primary" />
                  Aperçu du CV (Format A4)
                </h3>
                
                {/* Barre d'outils flottante pour changement rapide */}
                <div className="flex items-center space-x-3">
                  <div className="bg-card/90 backdrop-blur-sm border border-border/50 rounded-xl p-3 shadow-elegant">
                    <TemplateSelector 
                      currentTemplate={templateStyle}
                      onTemplateChange={(template) => setTemplateStyle(template as any)}
                      compact={true}
                    />
                  </div>
                </div>
              </div>
              <div id="cv-preview" className="overflow-hidden rounded-lg border">
                <CVDisplay
                  personalInfo={{
                    fullName: cvData.fullName,
                    email: cvData.email,
                    phone: cvData.phone,
                    address: cvData.address,
                    summary: cvData.summary,
                    photo_url: cvData.photo_url,
                    birthDate: cvData.birthDate
                  }}
                  experience={cvData.experience}
                  education={cvData.education}
                  skills={cvData.skills}
                  languages={cvData.languages}
                  interests={cvData.interests}
                  certifications={cvData.certifications}
                  projects={cvData.projects}
                  templateStyle={templateStyle}
                  spacingSettings={spacingSettings}
                  designSystem={{ font: currentFont, colors: colorPalette }}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Floating Save Status */}
        {autoSaveEnabled && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-card border rounded-lg px-3 py-2 shadow-lg">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-muted-foreground">Sauvegarde automatique activée</span>
              </div>
            </div>
          </div>
        )}
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
