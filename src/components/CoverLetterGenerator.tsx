import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sparkles, FileText, Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  const downloadLetter = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `lettre_motivation_${company || 'spontanee'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const resetForm = () => {
    setJobTitle('');
    setCompany('');
    setJobDescription('');
    setGeneratedLetter('');
    setLetterType('spontaneous');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        resetForm();
      }
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Générateur de Lettre de Motivation IA</span>
          </DialogTitle>
          <DialogDescription>
            Créez une lettre de motivation personnalisée basée sur votre CV
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!generatedLetter ? (
            <>
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
            </>
          ) : (
            /* Generated Letter Display */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Lettre générée</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={downloadLetter}>
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetForm}>
                    Nouvelle lettre
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {generatedLetter}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CoverLetterGenerator;