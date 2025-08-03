import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Sparkles, Loader2, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CVTextParserProps {
  isOpen: boolean;
  onClose: () => void;
  onDataParsed: (data: any) => void;
}

const CVTextParser: React.FC<CVTextParserProps> = ({ isOpen, onClose, onDataParsed }) => {
  const [inputText, setInputText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const { toast } = useToast();

  const parseText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Texte requis",
        description: "Veuillez saisir du texte à analyser.",
        variant: "destructive",
      });
      return;
    }

    setIsParsing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-cv-parser', {
        body: { text: inputText }
      });

      if (error) throw error;

      if (data.success) {
        onDataParsed(data.data);
        toast({
          title: "Analyse terminée !",
          description: "Les informations ont été extraites avec succès.",
        });
        onClose();
        setInputText('');
      } else {
        throw new Error(data.error || 'Erreur inconnue');
      }
    } catch (error) {
      console.error('Erreur analyse texte:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'analyser le texte fourni.",
        variant: "destructive",
      });
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        setInputText('');
      }
    }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-primary" />
            <span>Remplir le CV avec l'IA</span>
          </DialogTitle>
          <DialogDescription>
            Collez votre CV ou vos informations professionnelles. L'IA va automatiquement extraire et structurer les données.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Formats acceptés</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>CV existant :</strong>
                  <ul className="list-disc list-inside text-muted-foreground mt-1">
                    <li>Texte copié/collé</li>
                    <li>CV Word converti</li>
                    <li>Contenu LinkedIn</li>
                  </ul>
                </div>
                <div>
                  <strong>Informations libres :</strong>
                  <ul className="list-disc list-inside text-muted-foreground mt-1">
                    <li>Expériences détaillées</li>
                    <li>Formations</li>
                    <li>Compétences</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <label className="text-sm font-medium">Votre texte</label>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Collez ici votre CV, votre profil LinkedIn, ou toute information professionnelle que vous souhaitez structurer automatiquement...

Exemple :
- Jean Dupont, développeur web avec 5 ans d'expérience
- Email : jean.dupont@email.com
- Expérience chez TechCorp de 2020 à 2024 en tant que développeur frontend
- Formation : Master en informatique à l'Université de Paris
- Compétences : React, JavaScript, TypeScript, etc."
              rows={12}
              className="resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              L'IA va identifier automatiquement : nom, contact, expériences, formations, compétences
            </div>
            <div className="text-xs text-muted-foreground">
              {inputText.length}/5000 caractères
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={parseText} 
            disabled={isParsing || !inputText.trim()}
          >
            {isParsing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Analyser avec l'IA
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CVTextParser;