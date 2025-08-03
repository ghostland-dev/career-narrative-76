import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit3, Save, X, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({ 
  value, 
  onSave, 
  multiline = false, 
  placeholder = "", 
  className = "" 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-start gap-2 group">
        {multiline ? (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1 min-h-[60px]"
            autoFocus
          />
        ) : (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1"
            autoFocus
          />
        )}
        <div className="flex gap-1">
          <Button size="sm" onClick={handleSave} className="h-8 w-8 p-0">
            <Save className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} className="h-8 w-8 p-0">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`group cursor-pointer hover:bg-muted/50 p-1 rounded relative ${className}`}
      onClick={() => setIsEditing(true)}
    >
      <span className={value ? "" : "text-muted-foreground italic"}>
        {value || placeholder}
      </span>
      <Edit3 className="h-3 w-3 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

interface EditableListProps {
  items: string[];
  onUpdate: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}

const EditableList: React.FC<EditableListProps> = ({ 
  items, 
  onUpdate, 
  placeholder = "Nouvel élément",
  addLabel = "Ajouter"
}) => {
  const [newItem, setNewItem] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (newItem.trim()) {
      onUpdate([...items, newItem.trim()]);
      setNewItem("");
      setIsAdding(false);
    }
  };

  const handleRemove = (index: number) => {
    onUpdate(items.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    onUpdate(updated);
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <EditableField
            value={item}
            onSave={(value) => handleUpdate(index, value)}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => handleRemove(index)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
      
      {isAdding ? (
        <div className="flex items-center gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={placeholder}
            className="flex-1"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button size="sm" onClick={handleAdd} className="h-8 w-8 p-0">
            <Save className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => {
              setIsAdding(false);
              setNewItem("");
            }}
            className="h-8 w-8 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setIsAdding(true)}
          className="h-8"
        >
          <Plus className="h-3 w-3 mr-1" />
          {addLabel}
        </Button>
      )}
    </div>
  );
};

interface CVInlineEditorProps {
  cv: any;
  onUpdate: (updatedCV: any) => void;
  onSave: () => void;
  isSaving?: boolean;
}

const CVInlineEditor: React.FC<CVInlineEditorProps> = ({ 
  cv, 
  onUpdate, 
  onSave, 
  isSaving = false 
}) => {
  const { toast } = useToast();

  const updatePersonalInfo = useCallback((field: string, value: string) => {
    onUpdate({
      ...cv,
      personal_info: {
        ...cv.personal_info,
        [field]: value
      }
    });
  }, [cv, onUpdate]);

  const updateExperience = useCallback((index: number, field: string, value: string) => {
    const updated = [...cv.experience];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate({ ...cv, experience: updated });
  }, [cv, onUpdate]);

  const addExperience = useCallback(() => {
    const newExp = {
      id: Date.now().toString(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: ""
    };
    onUpdate({ ...cv, experience: [...cv.experience, newExp] });
  }, [cv, onUpdate]);

  const removeExperience = useCallback((index: number) => {
    onUpdate({ ...cv, experience: cv.experience.filter((_: any, i: number) => i !== index) });
  }, [cv, onUpdate]);

  const updateEducation = useCallback((index: number, field: string, value: string) => {
    const updated = [...cv.education];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate({ ...cv, education: updated });
  }, [cv, onUpdate]);

  const addEducation = useCallback(() => {
    const newEdu = {
      id: Date.now().toString(),
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      description: ""
    };
    onUpdate({ ...cv, education: [...cv.education, newEdu] });
  }, [cv, onUpdate]);

  const removeEducation = useCallback((index: number) => {
    onUpdate({ ...cv, education: cv.education.filter((_: any, i: number) => i !== index) });
  }, [cv, onUpdate]);

  const updateSkills = useCallback((skills: string[]) => {
    onUpdate({ ...cv, skills });
  }, [cv, onUpdate]);

  const updateLanguages = useCallback((languages: any[]) => {
    onUpdate({ ...cv, languages });
  }, [cv, onUpdate]);

  const updateInterests = useCallback((interests: string[]) => {
    onUpdate({ ...cv, interests });
  }, [cv, onUpdate]);

  return (
    <div className="space-y-6">
      {/* Header avec bouton de sauvegarde */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Mode Édition</h3>
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </div>

      {/* Informations personnelles */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Informations personnelles</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
              <EditableField
                value={cv.personal_info?.fullName || ""}
                onSave={(value) => updatePersonalInfo('fullName', value)}
                placeholder="Votre nom complet"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <EditableField
                value={cv.personal_info?.email || ""}
                onSave={(value) => updatePersonalInfo('email', value)}
                placeholder="votre@email.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
              <EditableField
                value={cv.personal_info?.phone || ""}
                onSave={(value) => updatePersonalInfo('phone', value)}
                placeholder="Votre numéro de téléphone"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Adresse</label>
              <EditableField
                value={cv.personal_info?.address || ""}
                onSave={(value) => updatePersonalInfo('address', value)}
                placeholder="Votre adresse"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Résumé professionnel</label>
              <EditableField
                value={cv.personal_info?.summary || ""}
                onSave={(value) => updatePersonalInfo('summary', value)}
                multiline={true}
                placeholder="Décrivez votre profil professionnel..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expérience professionnelle */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Expérience professionnelle</h4>
            <Button size="sm" onClick={addExperience}>
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>
          <div className="space-y-4">
            {cv.experience?.map((exp: any, index: number) => (
              <Card key={exp.id} className="border-l-4 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Poste</label>
                        <EditableField
                          value={exp.title}
                          onSave={(value) => updateExperience(index, 'title', value)}
                          placeholder="Titre du poste"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Entreprise</label>
                        <EditableField
                          value={exp.company}
                          onSave={(value) => updateExperience(index, 'company', value)}
                          placeholder="Nom de l'entreprise"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Lieu</label>
                        <EditableField
                          value={exp.location}
                          onSave={(value) => updateExperience(index, 'location', value)}
                          placeholder="Ville, Pays"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Début</label>
                          <EditableField
                            value={exp.startDate}
                            onSave={(value) => updateExperience(index, 'startDate', value)}
                            placeholder="MM/AAAA"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Fin</label>
                          <EditableField
                            value={exp.endDate}
                            onSave={(value) => updateExperience(index, 'endDate', value)}
                            placeholder="MM/AAAA"
                          />
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => removeExperience(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <EditableField
                      value={exp.description}
                      onSave={(value) => updateExperience(index, 'description', value)}
                      multiline={true}
                      placeholder="Décrivez vos responsabilités et réalisations..."
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Formation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Formation</h4>
            <Button size="sm" onClick={addEducation}>
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>
          <div className="space-y-4">
            {cv.education?.map((edu: any, index: number) => (
              <Card key={edu.id} className="border-l-4 border-secondary/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Diplôme</label>
                        <EditableField
                          value={edu.degree}
                          onSave={(value) => updateEducation(index, 'degree', value)}
                          placeholder="Nom du diplôme"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Institution</label>
                        <EditableField
                          value={edu.institution}
                          onSave={(value) => updateEducation(index, 'institution', value)}
                          placeholder="Nom de l'établissement"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Lieu</label>
                        <EditableField
                          value={edu.location}
                          onSave={(value) => updateEducation(index, 'location', value)}
                          placeholder="Ville, Pays"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Début</label>
                          <EditableField
                            value={edu.startDate}
                            onSave={(value) => updateEducation(index, 'startDate', value)}
                            placeholder="MM/AAAA"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Fin</label>
                          <EditableField
                            value={edu.endDate}
                            onSave={(value) => updateEducation(index, 'endDate', value)}
                            placeholder="MM/AAAA"
                          />
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => removeEducation(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <EditableField
                      value={edu.description}
                      onSave={(value) => updateEducation(index, 'description', value)}
                      multiline={true}
                      placeholder="Détails sur la formation..."
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compétences */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Compétences</h4>
          <EditableList
            items={cv.skills || []}
            onUpdate={updateSkills}
            placeholder="Nouvelle compétence"
            addLabel="Ajouter une compétence"
          />
        </CardContent>
      </Card>

      {/* Centres d'intérêt */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Centres d'intérêt</h4>
          <EditableList
            items={cv.interests || []}
            onUpdate={updateInterests}
            placeholder="Nouveau centre d'intérêt"
            addLabel="Ajouter un intérêt"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CVInlineEditor;