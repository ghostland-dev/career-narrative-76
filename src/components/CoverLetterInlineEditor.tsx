import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Edit3, Save, X, Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
}

const EditableText: React.FC<EditableTextProps> = ({ 
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
            className="flex-1 min-h-[120px]"
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
      className={`group cursor-pointer hover:bg-muted/50 p-2 rounded relative min-h-[40px] ${className}`}
      onClick={() => setIsEditing(true)}
    >
      <span className={value ? "" : "text-muted-foreground italic"}>
        {value || placeholder}
      </span>
      <Edit3 className="h-3 w-3 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

interface CoverLetterInlineEditorProps {
  cv: any;
  letterType: 'spontaneous' | 'targeted';
  jobTitle?: string;
  company?: string;
  generatedContent: string;
  onUpdateContent: (content: string) => void;
  onUpdateJobDetails: (jobTitle: string, company: string) => void;
  onSave: () => void;
  isSaving?: boolean;
}

const CoverLetterInlineEditor: React.FC<CoverLetterInlineEditorProps> = ({ 
  cv,
  letterType,
  jobTitle = "",
  company = "",
  generatedContent,
  onUpdateContent,
  onUpdateJobDetails,
  onSave,
  isSaving = false 
}) => {
  const { toast } = useToast();
  const [localJobTitle, setLocalJobTitle] = useState(jobTitle);
  const [localCompany, setLocalCompany] = useState(company);

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleJobDetailsUpdate = useCallback(() => {
    onUpdateJobDetails(localJobTitle, localCompany);
    toast({
      title: "Informations mises à jour",
      description: "Les détails du poste ont été mis à jour.",
    });
  }, [localJobTitle, localCompany, onUpdateJobDetails, toast]);

  return (
    <div className="space-y-6">
      {/* Header avec bouton de sauvegarde */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Édition de la lettre de motivation</h3>
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </div>

      {/* Informations du poste (pour lettres ciblées) */}
      {letterType === 'targeted' && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Informations du poste</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Titre du poste</label>
                <Input
                  value={localJobTitle}
                  onChange={(e) => setLocalJobTitle(e.target.value)}
                  placeholder="Ex: Développeur Frontend"
                  onBlur={handleJobDetailsUpdate}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Entreprise</label>
                <Input
                  value={localCompany}
                  onChange={(e) => setLocalCompany(e.target.value)}
                  placeholder="Ex: TechCorp"
                  onBlur={handleJobDetailsUpdate}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prévisualisation de la lettre avec édition inline */}
      <Card className="w-full bg-white" id="cover-letter-content">
        <CardContent className="p-6">
          {/* En-tête avec le même style que le CV */}
          <header className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 mb-6 rounded-lg">
            <div className="flex items-start gap-6 mb-4">
              {/* Photo de profil */}
              {cv.photo_url && (
                <div className="flex-shrink-0">
                  <img
                    src={cv.photo_url}
                    alt="Photo de profil"
                    className="w-16 h-16 rounded-full object-cover border-4 border-primary/20"
                  />
                </div>
              )}
              
              {/* Informations principales */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">
                  {cv.personal_info?.fullName || "Nom non renseigné"}
                  {cv.personal_info?.birthDate && (
                    <span className="text-base font-normal text-gray-600 ml-2">
                      ({calculateAge(cv.personal_info.birthDate)} ans)
                    </span>
                  )}
                </h1>
                
                {/* Informations de contact */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mt-2">
                  {cv.personal_info?.email && (
                    <div className="flex items-center">
                      <Mail className="h-3 w-3 mr-1 text-primary" />
                      <span>{cv.personal_info.email}</span>
                    </div>
                  )}
                  {cv.personal_info?.phone && (
                    <div className="flex items-center">
                      <Phone className="h-3 w-3 mr-1 text-primary" />
                      <span>{cv.personal_info.phone}</span>
                    </div>
                  )}
                  {cv.personal_info?.address && (
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-primary" />
                      <span>{cv.personal_info.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Date et lieu - éditable */}
          <div className="text-right text-sm text-gray-600 mb-6">
            {cv.personal_info?.address && cv.personal_info.address.split(',')[0]}, le {new Date().toLocaleDateString('fr-FR')}
          </div>

          {/* Informations destinataire (si lettre ciblée) - éditable */}
          {letterType === 'targeted' && (
            <div className="mb-6 text-sm text-gray-700">
              <EditableText
                value={localCompany}
                onSave={(value) => {
                  setLocalCompany(value);
                  onUpdateJobDetails(localJobTitle, value);
                }}
                placeholder="Nom de l'entreprise"
                className="font-medium"
              />
              <div>Service Ressources Humaines</div>
            </div>
          )}

          {/* Objet - éditable */}
          <div className="mb-6">
            <span className="font-medium text-sm text-gray-700">
              Objet : {letterType === 'targeted' && localJobTitle ? (
                <EditableText
                  value={`Candidature pour le poste de ${localJobTitle}`}
                  onSave={(value) => {
                    const match = value.match(/Candidature pour le poste de (.+)/);
                    if (match) {
                      setLocalJobTitle(match[1]);
                      onUpdateJobDetails(match[1], localCompany);
                    }
                  }}
                  placeholder="Candidature pour le poste de..."
                  className="inline"
                />
              ) : 'Candidature spontanée'}
            </span>
          </div>

          {/* Formule d'appel */}
          <div className="mb-4 text-sm text-gray-800">
            <EditableText
              value={letterType === 'targeted' ? 'Madame, Monsieur,' : 'Madame, Monsieur,'}
              onSave={() => {}} // Non éditable pour l'instant
              className="pointer-events-none"
            />
          </div>
          
          {/* Contenu de la lettre - éditable */}
          <div className="text-sm leading-relaxed text-gray-800 mb-6">
            <EditableText
              value={generatedContent}
              onSave={onUpdateContent}
              multiline={true}
              placeholder="Contenu de la lettre de motivation..."
              className="min-h-[200px] whitespace-pre-wrap"
            />
          </div>

          {/* Formule de politesse */}
          <div className="mb-4 text-sm text-gray-800">
            <EditableText
              value="Dans l'attente de votre retour, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées."
              onSave={() => {}} // Peut être rendu éditable si nécessaire
              placeholder="Formule de politesse..."
            />
          </div>

          {/* Signature */}
          <div className="text-right text-sm text-gray-700">
            <div>{cv.personal_info?.fullName}</div>
          </div>
        </CardContent>
      </Card>

      {/* Conseils d'édition */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">💡 Conseils d'édition</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Cliquez sur n'importe quel texte pour le modifier</li>
            <li>• Personnalisez le contenu selon l'offre d'emploi</li>
            <li>• Vérifiez que les informations de contact sont correctes</li>
            <li>• Adaptez le ton selon l'entreprise ciblée</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoverLetterInlineEditor;