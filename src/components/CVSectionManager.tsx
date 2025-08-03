import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Eye, 
  EyeOff,
  Edit,
  Save,
  X,
  Award,
  Briefcase,
  GraduationCap,
  Globe2,
  Star,
  Trophy,
  Book,
  Heart,
  Code,
  Camera,
  Music,
  Gamepad2,
  Plane,
  Coffee
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CVSection {
  id: string;
  type: string;
  title: string;
  isVisible: boolean;
  order: number;
  icon: any;
  content: any;
  isCustom: boolean;
}

interface CVSectionManagerProps {
  sections: CVSection[];
  onSectionsChange: (sections: CVSection[]) => void;
}

const availableSections = [
  {
    type: "education",
    title: "Formation",
    icon: GraduationCap,
    description: "Diplômes et formations",
    defaultContent: []
  },
  {
    type: "experience", 
    title: "Expérience",
    icon: Briefcase,
    description: "Expériences professionnelles",
    defaultContent: []
  },
  {
    type: "skills",
    title: "Compétences",
    icon: Award,
    description: "Compétences techniques et professionnelles",
    defaultContent: []
  },
  {
    type: "languages",
    title: "Langues",
    icon: Globe2,
    description: "Langues parlées et niveau",
    defaultContent: []
  },
  {
    type: "certifications",
    title: "Certifications",
    icon: Trophy,
    description: "Certifications professionnelles",
    defaultContent: []
  },
  {
    type: "projects",
    title: "Projets",
    icon: Code,
    description: "Projets personnels ou professionnels",
    defaultContent: []
  },
  {
    type: "interests",
    title: "Centres d'intérêt",
    icon: Star,
    description: "Loisirs et passions",
    defaultContent: []
  },
  {
    type: "publications",
    title: "Publications",
    icon: Book,
    description: "Articles et publications",
    defaultContent: []
  },
  {
    type: "volunteer",
    title: "Bénévolat",
    icon: Heart,
    description: "Expériences bénévoles",
    defaultContent: []
  }
];

const interestIcons = [
  { name: "Sport", icon: Trophy },
  { name: "Lecture", icon: Book },
  { name: "Musique", icon: Music },
  { name: "Photographie", icon: Camera },
  { name: "Gaming", icon: Gamepad2 },
  { name: "Voyage", icon: Plane },
  { name: "Cuisine", icon: Coffee },
  { name: "Général", icon: Star }
];

const CVSectionManager: React.FC<CVSectionManagerProps> = ({
  sections,
  onSectionsChange
}) => {
  const { toast } = useToast();
  const [showAddSection, setShowAddSection] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [newCustomSection, setNewCustomSection] = useState({
    title: "",
    description: ""
  });

  const addSection = (sectionType: string) => {
    const template = availableSections.find(s => s.type === sectionType);
    if (!template) return;

    const newSection: CVSection = {
      id: Date.now().toString(),
      type: sectionType,
      title: template.title,
      isVisible: true,
      order: sections.length,
      icon: template.icon,
      content: template.defaultContent,
      isCustom: false
    };

    onSectionsChange([...sections, newSection]);
    setShowAddSection(false);
    
    toast({
      title: "Section ajoutée",
      description: `La section "${template.title}" a été ajoutée à votre CV.`,
      duration: 2000,
    });
  };

  const addCustomSection = () => {
    if (!newCustomSection.title.trim()) return;

    const customSection: CVSection = {
      id: Date.now().toString(),
      type: "custom",
      title: newCustomSection.title,
      isVisible: true,
      order: sections.length,
      icon: Star,
      content: {
        description: newCustomSection.description,
        items: []
      },
      isCustom: true
    };

    onSectionsChange([...sections, customSection]);
    setNewCustomSection({ title: "", description: "" });
    setShowAddSection(false);
    
    toast({
      title: "Section personnalisée créée",
      description: `La section "${newCustomSection.title}" a été ajoutée.`,
      duration: 2000,
    });
  };

  const toggleSectionVisibility = (sectionId: string) => {
    const updatedSections = sections.map(section => 
      section.id === sectionId 
        ? { ...section, isVisible: !section.isVisible }
        : section
    );
    onSectionsChange(updatedSections);
  };

  const removeSection = (sectionId: string) => {
    const updatedSections = sections.filter(section => section.id !== sectionId);
    onSectionsChange(updatedSections);
    
    toast({
      title: "Section supprimée",
      description: "La section a été retirée de votre CV.",
      duration: 2000,
    });
  };

  const updateSectionTitle = (sectionId: string, newTitle: string) => {
    const updatedSections = sections.map(section => 
      section.id === sectionId 
        ? { ...section, title: newTitle }
        : section
    );
    onSectionsChange(updatedSections);
    setEditingSection(null);
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const sectionIndex = sections.findIndex(s => s.id === sectionId);
    if (
      (direction === 'up' && sectionIndex === 0) ||
      (direction === 'down' && sectionIndex === sections.length - 1)
    ) return;

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
    
    [newSections[sectionIndex], newSections[targetIndex]] = 
    [newSections[targetIndex], newSections[sectionIndex]];
    
    // Update order
    newSections.forEach((section, index) => {
      section.order = index;
    });
    
    onSectionsChange(newSections);
  };

  const getAvailableSections = () => {
    const usedTypes = sections.map(s => s.type);
    return availableSections.filter(s => !usedTypes.includes(s.type));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Gestionnaire de sections</h3>
          <p className="text-sm text-muted-foreground">
            Ajoutez, réorganisez et personnalisez les sections de votre CV
          </p>
        </div>
        <Button 
          onClick={() => setShowAddSection(true)}
          className="bg-gradient-to-r from-primary to-primary-glow"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une section
        </Button>
      </div>

      {/* Current Sections */}
      <div className="space-y-3">
        {sections.map((section, index) => {
          const IconComponent = section.icon;
          
          return (
            <Card 
              key={section.id} 
              className={`border transition-all duration-300 hover:shadow-card ${
                !section.isVisible ? 'opacity-60 bg-muted/20' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Drag Handle */}
                    <div className="flex flex-col space-y-1 cursor-move">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveSection(section.id, 'up')}
                        disabled={index === 0}
                        className="h-6 w-6 p-0"
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveSection(section.id, 'down')}
                        disabled={index === sections.length - 1}
                        className="h-6 w-6 p-0"
                      >
                        ↓
                      </Button>
                    </div>

                    {/* Section Info */}
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        section.isVisible ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        {editingSection === section.id ? (
                          <div className="flex items-center space-x-2">
                            <Input
                              value={section.title}
                              onChange={(e) => {
                                const updatedSections = sections.map(s => 
                                  s.id === section.id ? { ...s, title: e.target.value } : s
                                );
                                onSectionsChange(updatedSections);
                              }}
                              className="h-8 w-40"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  setEditingSection(null);
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingSection(null)}
                            >
                              <Save className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{section.title}</h4>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingSection(section.id)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            Ordre: {index + 1}
                          </Badge>
                          {section.isCustom && (
                            <Badge variant="secondary" className="text-xs">
                              Personnalisé
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 mr-3">
                      <Label htmlFor={`visibility-${section.id}`} className="text-sm">
                        {section.isVisible ? 'Visible' : 'Masqué'}
                      </Label>
                      <Switch
                        id={`visibility-${section.id}`}
                        checked={section.isVisible}
                        onCheckedChange={() => toggleSectionVisibility(section.id)}
                      />
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSectionVisibility(section.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {section.isVisible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSection(section.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Section Dialog */}
      {showAddSection && (
        <Card className="border-2 border-dashed border-primary/50 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Ajouter une nouvelle section</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAddSection(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Predefined Sections */}
            <div>
              <h4 className="font-medium mb-3">Sections prédéfinies</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {getAvailableSections().map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <Button
                      key={section.type}
                      variant="outline"
                      onClick={() => addSection(section.type)}
                      className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-primary/10 hover:border-primary"
                    >
                      <IconComponent className="h-6 w-6 text-primary" />
                      <div className="text-center">
                        <div className="font-medium text-sm">{section.title}</div>
                        <div className="text-xs text-muted-foreground">{section.description}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Custom Section */}
            <div className="border-t pt-6">
              <h4 className="font-medium mb-3">Section personnalisée</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Titre de la section</Label>
                    <Input
                      value={newCustomSection.title}
                      onChange={(e) => setNewCustomSection(prev => ({
                        ...prev,
                        title: e.target.value
                      }))}
                      placeholder="Ex: Réalisations, Portfolio..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description (optionnelle)</Label>
                    <Input
                      value={newCustomSection.description}
                      onChange={(e) => setNewCustomSection(prev => ({
                        ...prev,
                        description: e.target.value
                      }))}
                      placeholder="Description de la section"
                    />
                  </div>
                </div>
                <Button 
                  onClick={addCustomSection}
                  disabled={!newCustomSection.title.trim()}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer la section personnalisée
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <Card className="bg-gradient-to-r from-muted/50 to-accent/5 border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div>
                <span className="font-medium">{sections.length}</span>
                <span className="text-muted-foreground ml-1">sections totales</span>
              </div>
              <div>
                <span className="font-medium text-success">
                  {sections.filter(s => s.isVisible).length}
                </span>
                <span className="text-muted-foreground ml-1">visibles</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  {sections.filter(s => !s.isVisible).length}
                </span>
                <span className="text-muted-foreground ml-1">masquées</span>
              </div>
            </div>
            <Badge variant="outline">
              Organisation optimisée
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CVSectionManager;