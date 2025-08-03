import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Calendar,
  Award,
  Globe2,
  Briefcase,
  Star,
  Book,
  Trophy
} from "lucide-react";

interface CVEnhancedBuilderProps {
  cvData: any;
  setCvData: (data: any) => void;
}

const CVEnhancedBuilder: React.FC<CVEnhancedBuilderProps> = ({
  cvData,
  setCvData
}) => {
  const [newLanguage, setNewLanguage] = useState({ name: "", level: "" });
  const [newInterest, setNewInterest] = useState("");
  const [newCertification, setNewCertification] = useState({
    name: "",
    issuer: "",
    date: "",
    url: ""
  });
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    technologies: "",
    url: "",
    date: ""
  });

  // Langues
  const addLanguage = () => {
    if (newLanguage.name.trim() && newLanguage.level.trim()) {
      setCvData(prev => ({
        ...prev,
        languages: [...(prev.languages || []), { ...newLanguage, id: Date.now().toString() }]
      }));
      setNewLanguage({ name: "", level: "" });
    }
  };

  const removeLanguage = (id: string) => {
    setCvData(prev => ({
      ...prev,
      languages: (prev.languages || []).filter((lang: any) => lang.id !== id)
    }));
  };

  // Centres d'intérêt
  const addInterest = () => {
    if (newInterest.trim()) {
      setCvData(prev => ({
        ...prev,
        interests: [...(prev.interests || []), newInterest.trim()]
      }));
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setCvData(prev => ({
      ...prev,
      interests: (prev.interests || []).filter((int: string) => int !== interest)
    }));
  };

  // Certifications
  const addCertification = () => {
    if (newCertification.name.trim()) {
      setCvData(prev => ({
        ...prev,
        certifications: [...(prev.certifications || []), { ...newCertification, id: Date.now().toString() }]
      }));
      setNewCertification({ name: "", issuer: "", date: "", url: "" });
    }
  };

  const removeCertification = (id: string) => {
    setCvData(prev => ({
      ...prev,
      certifications: (prev.certifications || []).filter((cert: any) => cert.id !== id)
    }));
  };

  // Projets
  const addProject = () => {
    if (newProject.name.trim()) {
      setCvData(prev => ({
        ...prev,
        projects: [...(prev.projects || []), { ...newProject, id: Date.now().toString() }]
      }));
      setNewProject({ name: "", description: "", technologies: "", url: "", date: "" });
    }
  };

  const removeProject = (id: string) => {
    setCvData(prev => ({
      ...prev,
      projects: (prev.projects || []).filter((proj: any) => proj.id !== id)
    }));
  };

  const updateProject = (id: string, field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      projects: (prev.projects || []).map((proj: any) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const updateCertification = (id: string, field: string, value: string) => {
    setCvData(prev => ({
      ...prev,
      certifications: (prev.certifications || []).map((cert: any) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
  };

  return (
    <div className="space-y-6">
      {/* Langues */}
      <Card className="border-0 shadow-modern animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe2 className="w-5 h-5 mr-2 text-primary" />
            Langues
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Langue</Label>
              <Input
                value={newLanguage.name}
                onChange={(e) => setNewLanguage(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Français, Anglais..."
              />
            </div>
            <div className="space-y-2">
              <Label>Niveau</Label>
              <Input
                value={newLanguage.level}
                onChange={(e) => setNewLanguage(prev => ({ ...prev, level: e.target.value }))}
                placeholder="Natif, Courant, Intermédiaire..."
              />
            </div>
          </div>
          <Button
            onClick={addLanguage}
            size="sm"
            disabled={!newLanguage.name.trim() || !newLanguage.level.trim()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une langue
          </Button>
          
          {cvData.languages && cvData.languages.length > 0 && (
            <div className="space-y-2">
              {cvData.languages.map((language: any) => (
                <div
                  key={language.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <span className="font-medium">{language.name}</span>
                    <Badge variant="outline" className="ml-2">{language.level}</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLanguage(language.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Centres d'intérêt */}
      <Card className="border-0 shadow-modern animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="w-5 h-5 mr-2 text-primary" />
            Centres d'intérêt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Sport, Lecture, Voyages..."
              onKeyPress={(e) => e.key === 'Enter' && addInterest()}
              className="flex-1"
            />
            <Button onClick={addInterest} disabled={!newInterest.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
          
          {cvData.interests && cvData.interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {cvData.interests.map((interest: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                >
                  <span>{interest}</span>
                  <button
                    onClick={() => removeInterest(interest)}
                    className="text-primary hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card className="border-0 shadow-modern animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-primary" />
            Certifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nom de la certification</Label>
              <Input
                value={newCertification.name}
                onChange={(e) => setNewCertification(prev => ({ ...prev, name: e.target.value }))}
                placeholder="AWS Cloud Practitioner..."
              />
            </div>
            <div className="space-y-2">
              <Label>Organisme</Label>
              <Input
                value={newCertification.issuer}
                onChange={(e) => setNewCertification(prev => ({ ...prev, issuer: e.target.value }))}
                placeholder="AWS, Google, Microsoft..."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date d'obtention</Label>
              <Input
                type="month"
                value={newCertification.date}
                onChange={(e) => setNewCertification(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>URL (optionnel)</Label>
              <Input
                value={newCertification.url}
                onChange={(e) => setNewCertification(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </div>
          <Button
            onClick={addCertification}
            size="sm"
            disabled={!newCertification.name.trim()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une certification
          </Button>
          
          {cvData.certifications && cvData.certifications.length > 0 && (
            <div className="space-y-3">
              {cvData.certifications.map((cert: any) => (
                <Card key={cert.id} className="border border-border/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{cert.name}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCertification(cert.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>Organisme: {cert.issuer}</div>
                    <div>Date: {cert.date}</div>
                  </div>
                  {cert.url && (
                    <div className="text-sm text-blue-600 mt-1">
                      <a href={cert.url} target="_blank" rel="noopener noreferrer">
                        Voir la certification
                      </a>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projets */}
      <Card className="border-0 shadow-modern animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-primary" />
            Projets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom du projet</Label>
                <Input
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Application e-commerce..."
                />
              </div>
              <div className="space-y-2">
                <Label>Technologies</Label>
                <Input
                  value={newProject.technologies}
                  onChange={(e) => setNewProject(prev => ({ ...prev, technologies: e.target.value }))}
                  placeholder="React, Node.js, MongoDB..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez votre projet..."
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="month"
                  value={newProject.date}
                  onChange={(e) => setNewProject(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>URL (optionnel)</Label>
                <Input
                  value={newProject.url}
                  onChange={(e) => setNewProject(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
          </div>
          <Button
            onClick={addProject}
            size="sm"
            disabled={!newProject.name.trim()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un projet
          </Button>
          
          {cvData.projects && cvData.projects.length > 0 && (
            <div className="space-y-3">
              {cvData.projects.map((project: any) => (
                <Card key={project.id} className="border border-border/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{project.name}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProject(project.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.technologies.split(',').map((tech: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tech.trim()}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{project.date}</span>
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                        Voir le projet
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CVEnhancedBuilder;