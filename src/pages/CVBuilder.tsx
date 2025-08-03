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
  Trash2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string[];
}

const CVBuilder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
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

  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkAuth();
  }, [navigate]);

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
    setIsLoading(true);
    try {
      // TODO: Implement save to Supabase
      toast({
        title: "CV sauvegardé",
        description: "Vos modifications ont été enregistrées avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le CV.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              <span className="font-semibold">
                {id ? "Modifier le CV" : "Nouveau CV"}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Aperçu
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6">
            <Card className="p-6 border-0 shadow-card">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal" className="text-xs">
                    <User className="h-4 w-4 mr-1" />
                    Personnel
                  </TabsTrigger>
                  <TabsTrigger value="experience" className="text-xs">
                    <Briefcase className="h-4 w-4 mr-1" />
                    Expérience
                  </TabsTrigger>
                  <TabsTrigger value="education" className="text-xs">
                    <GraduationCap className="h-4 w-4 mr-1" />
                    Formation
                  </TabsTrigger>
                  <TabsTrigger value="skills" className="text-xs">
                    <Award className="h-4 w-4 mr-1" />
                    Compétences
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nom complet</Label>
                      <Input
                        id="fullName"
                        value={cvData.personalInfo.fullName}
                        onChange={(e) => setCvData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                        }))}
                        placeholder="Jean Dupont"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={cvData.personalInfo.email}
                        onChange={(e) => setCvData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, email: e.target.value }
                        }))}
                        placeholder="jean.dupont@email.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={cvData.personalInfo.phone}
                        onChange={(e) => setCvData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, phone: e.target.value }
                        }))}
                        placeholder="+33 1 23 45 67 89"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse</Label>
                      <Input
                        id="address"
                        value={cvData.personalInfo.address}
                        onChange={(e) => setCvData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, address: e.target.value }
                        }))}
                        placeholder="Paris, France"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="summary">Résumé professionnel</Label>
                    <Textarea
                      id="summary"
                      value={cvData.personalInfo.summary}
                      onChange={(e) => setCvData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, summary: e.target.value }
                      }))}
                      placeholder="Décrivez brièvement votre profil professionnel..."
                      rows={4}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="experience" className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Expérience professionnelle</h3>
                    <Button size="sm" onClick={addExperience}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    {cvData.experience.map((exp, index) => (
                      <div key={exp.id} className="space-y-4 p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            Expérience {index + 1}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExperience(exp.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
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
                        
                        <div className="grid grid-cols-3 gap-4">
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
                          />
                        </div>
                      </div>
                    ))}
                    
                    {cvData.experience.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Aucune expérience ajoutée</p>
                        <p className="text-sm">Cliquez sur "Ajouter" pour commencer</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="education" className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Formation</h3>
                    <Button size="sm" onClick={addEducation}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    {cvData.education.map((edu, index) => (
                      <div key={edu.id} className="space-y-4 p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            Formation {index + 1}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEducation(edu.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
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
                        
                        <div className="grid grid-cols-3 gap-4">
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
                            placeholder="Spécialisations, projets, mentions..."
                            rows={3}
                          />
                        </div>
                      </div>
                    ))}
                    
                    {cvData.education.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <GraduationCap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Aucune formation ajoutée</p>
                        <p className="text-sm">Cliquez sur "Ajouter" pour commencer</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="skills" className="space-y-4 mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Compétences</h3>
                    
                    <div className="flex space-x-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Ajouter une compétence..."
                        onKeyPress={(e) => e.key === "Enter" && addSkill()}
                      />
                      <Button onClick={addSkill}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {cvData.skills.map((skill) => (
                        <div
                          key={skill}
                          className="flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                        >
                          <span>{skill}</span>
                          <button
                            onClick={() => removeSkill(skill)}
                            className="text-primary/70 hover:text-primary"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {cvData.skills.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Aucune compétence ajoutée</p>
                        <p className="text-sm">Ajoutez vos compétences techniques et soft skills</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-24">
            <Card className="p-6 border-0 shadow-card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Aperçu du CV
              </h3>
              <Separator className="mb-6" />
              
              {/* CV Preview */}
              <div className="bg-background border border-border rounded-lg p-6 space-y-6 min-h-[600px]">
                {/* Personal Info */}
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-foreground">
                    {cvData.personalInfo.fullName || "Votre Nom"}
                  </h1>
                  <div className="text-sm text-muted-foreground mt-2 space-x-2">
                    {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
                    {cvData.personalInfo.phone && (
                      <>
                        <span>•</span>
                        <span>{cvData.personalInfo.phone}</span>
                      </>
                    )}
                    {cvData.personalInfo.address && (
                      <>
                        <span>•</span>
                        <span>{cvData.personalInfo.address}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Summary */}
                {cvData.personalInfo.summary && (
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-2">Résumé</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {cvData.personalInfo.summary}
                    </p>
                  </div>
                )}

                {/* Experience */}
                {cvData.experience.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-3">Expérience</h2>
                    <div className="space-y-4">
                      {cvData.experience.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold text-sm">{exp.title}</h3>
                            <span className="text-xs text-muted-foreground">
                              {exp.startDate} - {exp.endDate || "Présent"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{exp.company} • {exp.location}</p>
                          {exp.description && (
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {cvData.education.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-3">Formation</h2>
                    <div className="space-y-4">
                      {cvData.education.map((edu) => (
                        <div key={edu.id}>
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold text-sm">{edu.degree}</h3>
                            <span className="text-xs text-muted-foreground">
                              {edu.startDate} - {edu.endDate}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{edu.institution} • {edu.location}</p>
                          {edu.description && (
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              {edu.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {cvData.skills.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-3">Compétences</h2>
                    <div className="flex flex-wrap gap-2">
                      {cvData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;