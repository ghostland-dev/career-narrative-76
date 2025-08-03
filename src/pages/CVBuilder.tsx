import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-4">
            {/* Quick Navigation */}
            <Card className="border-0 shadow-card sticky top-6">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Navigation rapide</h3>
                <div className="space-y-2">
                  {[
                    { id: 'personal', icon: User, label: 'Personnel', completed: !!(cvData?.fullName && cvData?.email) },
                    { id: 'experience', icon: Briefcase, label: 'Expérience', completed: !!(cvData?.experience && cvData.experience.length > 0) },
                    { id: 'education', icon: GraduationCap, label: 'Formation', completed: !!(cvData?.education && cvData.education.length > 0) },
                    { id: 'skills', icon: Award, label: 'Compétences', completed: !!(cvData?.skills && cvData.skills.length > 0) },
                    { id: 'sections', icon: Plus, label: 'Sections', completed: !!(cvData?.cvSections && cvData.cvSections.length > 0) },
                    { id: 'review', icon: Wand2, label: 'Design', completed: false }
                  ].map((section) => (
                    <Button
                      key={section.id}
                      variant={currentTab === section.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentTab(section.id)}
                      className={`w-full justify-start text-left ${
                        currentTab === section.id ? "bg-primary text-white" : ""
                      }`}
                    >
                      <section.icon className="h-4 w-4 mr-2" />
                      <span className="flex-1">{section.label}</span>
                      {section.completed && (
                        <div className="w-2 h-2 bg-success rounded-full ml-2" />
                      )}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Design Controls */}
            <Card className="border-0 shadow-card">
              <CardContent className="p-4">
                <TemplateSelector 
                  currentTemplate={templateStyle}
                  onTemplateChange={(template) => setTemplateStyle(template as any)}
                  compact={true}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Main Editor Panel */}
          <div className="lg:col-span-2 overflow-y-auto">
            {/* CV Title */}
            <Card className="border-0 shadow-card mb-6">
              <CardContent className="p-4">
                <Input
                  value={cvTitle}
                  onChange={(e) => setCvTitle(e.target.value)}
                  placeholder="Titre de votre CV"
                  className="text-lg font-medium border-0 focus-visible:ring-1"
                />
              </CardContent>
            </Card>

            {/* Content based on current tab */}
            {currentTab === 'personal' && (
              <Card className="border-0 shadow-card">
                <CardContent className="p-6 space-y-6">
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
                  <div className="space-y-2">
                    <Label htmlFor="summary">Résumé professionnel</Label>
                    <Textarea
                      id="summary"
                      value={cvData.summary}
                      onChange={(e) => setCvData(prev => ({
                        ...prev,
                        summary: e.target.value
                      }))}
                      placeholder="Décrivez brièvement votre profil..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {currentTab === 'experience' && (
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Expérience professionnelle</h3>
                    <Button size="sm" onClick={addExperience}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {cvData.experience.map((exp, index) => (
                      <div key={exp.id} className="border rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <Input
                            value={exp.title}
                            onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                            placeholder="Poste"
                            className="text-sm"
                          />
                          <Input
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                            placeholder="Entreprise"
                            className="text-sm"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExperience(exp.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {currentTab === 'education' && (
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Formation</h3>
                    <Button size="sm" onClick={addEducation}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {cvData.education.map((edu, index) => (
                      <div key={edu.id} className="border rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                            placeholder="Diplôme"
                            className="text-sm"
                          />
                          <Input
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                            placeholder="Établissement"
                            className="text-sm"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEducation(edu.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {currentTab === 'skills' && (
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Nouvelle compétence..."
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <Button onClick={addSkill} disabled={!newSkill.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cvData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                        <span>{skill}</span>
                        <button onClick={() => removeSkill(skill)} className="ml-2 text-xs">×</button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {currentTab === 'sections' && (
              <CVSectionManager
                sections={cvData.cvSections || []}
                onSectionsChange={(sections) => setCvData(prev => ({
                  ...prev,
                  cvSections: sections
                }))}
              />
            )}

            {currentTab === 'review' && (
              <DesignCustomizer
                settings={designSettings}
                onSettingsChange={setDesignSettings}
              />
            )}
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1 sticky top-6 h-fit">
            <Card className="border-0 shadow-card">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Eye className="h-4 w-4 mr-2 text-primary" />
                  Aperçu
                </h3>
                <div className="bg-muted/30 rounded-lg p-4 aspect-[3/4]">
                  <div className="space-y-2">
                    <div className="h-3 bg-primary/20 rounded w-3/4"></div>
                    <div className="h-2 bg-muted rounded w-1/2"></div>
                    <div className="h-2 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
                <Button size="sm" className="w-full mt-3" onClick={handlePreviewPDF}>
                  <Eye className="h-3 w-3 mr-2" />
                  Aperçu complet
                </Button>
              </CardContent>
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
      </div>
    </AppLayout>
  );
};

export default CVBuilder;