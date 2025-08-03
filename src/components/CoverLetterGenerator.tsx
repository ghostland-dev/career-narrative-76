import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, FileText, Download, Loader2, Edit3, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { exportToPDF } from '@/lib/pdf-export';
import CoverLetterInlineEditor from './CoverLetterInlineEditor';

interface CoverLetterGeneratorProps {
  cv: any;
  isOpen: boolean;
  onClose: () => void;
}

const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({ cv, isOpen, onClose }) => {
  const [letterType, setLetterType] = useState<'spontaneous' | 'targeted'>('spontaneous');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTab, setCurrentTab] = useState<'generate' | 'edit'>('generate');
  const { toast } = useToast();

  const generateCoverLetter = async () => {
    if (letterType === 'targeted' && (!jobTitle.trim() || !company.trim())) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir le titre du poste et l'entreprise.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-cover-letter', {
        body: {
          type: letterType,
          cv,
          jobTitle,
          company,
          jobDescription
        }
      });

      if (error) throw error;

      if (data.success) {
        setGeneratedLetter(data.coverLetter);
        setCurrentTab('edit');
        toast({
          title: "Lettre générée !",
          description: "Votre lettre de motivation a été créée avec succès.",
        });
      } else {
        throw new Error(data.error || 'Erreur inconnue');
      }
    } catch (error) {
      console.error('Erreur génération lettre:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la lettre de motivation.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadLetter = async () => {
    try {
      await exportToPDF('cover-letter-content', `Lettre_motivation_${company || 'spontanee'}.pdf`);
      toast({
        title: "Téléchargement réussi",
        description: "La lettre de motivation a été exportée en PDF.",
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter la lettre en PDF.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setJobTitle('');
    setCompany('');
    setJobDescription('');
    setGeneratedLetter('');
    setLetterType('spontaneous');
    setCurrentTab('generate');
  };

  const handleUpdateContent = (content: string) => {
    setGeneratedLetter(content);
  };

  const handleUpdateJobDetails = (newJobTitle: string, newCompany: string) => {
    setJobTitle(newJobTitle);
    setCompany(newCompany);
  };

  const handleSaveLetter = () => {
    toast({
      title: "Lettre sauvegardée",
      description: "La lettre a été mise à jour avec vos modifications.",
    });
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value as 'generate' | 'edit');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        resetForm();
      }
    }}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Générateur de Lettre de Motivation IA</span>
          </DialogTitle>
          <DialogDescription>
            Créez et modifiez une lettre de motivation personnalisée basée sur votre CV
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate" className="flex items-center space-x-2">
              <Wand2 className="h-4 w-4" />
              <span>Générer</span>
            </TabsTrigger>
            <TabsTrigger value="edit" disabled={!generatedLetter} className="flex items-center space-x-2">
              <Edit3 className="h-4 w-4" />
              <span>Éditer</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6 mt-6">
            {/* Type Selection */}
            <div className="space-y-4">
              <label className="text-sm font-medium">Type de lettre</label>
              <div className="grid grid-cols-2 gap-4">
                <Card 
                  className={`cursor-pointer transition-all ${letterType === 'spontaneous' ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setLetterType('spontaneous')}
                >
                  <CardHeader className="text-center pb-3">
                    <CardTitle className="text-base">Lettre Spontanée</CardTitle>
                    <CardDescription className="text-sm">
                      Pour candidatures spontanées
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all ${letterType === 'targeted' ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setLetterType('targeted')}
                >
                  <CardHeader className="text-center pb-3">
                    <CardTitle className="text-base">Lettre Ciblée</CardTitle>
                    <CardDescription className="text-sm">
                      Pour offres d'emploi spécifiques
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Targeted Letter Fields */}
            {letterType === 'targeted' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Titre du poste *</label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="Ex: Développeur Frontend"
                      className="w-full p-2 border border-border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Entreprise *</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Ex: TechCorp"
                      className="w-full p-2 border border-border rounded-md"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description du poste (optionnel)</label>
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Copiez la description du poste pour une lettre plus précise..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            <Button 
              onClick={generateCoverLetter} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Générer la lettre
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="edit" className="mt-6">
            {generatedLetter && (
              <CoverLetterInlineEditor
                cv={cv}
                letterType={letterType}
                jobTitle={jobTitle}
                company={company}
                generatedContent={generatedLetter}
                onUpdateContent={handleUpdateContent}
                onUpdateJobDetails={handleUpdateJobDetails}
                onSave={handleSaveLetter}
              />
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <div className="flex space-x-2">
            {generatedLetter && (
              <Button variant="outline" onClick={downloadLetter}>
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
            )}
          </div>
          <div className="flex space-x-2">
            {generatedLetter && (
              <Button variant="outline" onClick={resetForm}>
                Nouvelle lettre
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CoverLetterGenerator;