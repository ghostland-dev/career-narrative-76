import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, AlertCircle, Wand2, Loader2, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SpellCheckResult {
  text: string;
  corrections: Array<{
    original: string;
    suggested: string;
    type: 'spelling' | 'grammar' | 'style';
    position: number;
  }>;
  score: number;
}

interface SpellCheckerProps {
  text: string;
  onCorrectedText: (text: string) => void;
}

const SpellChecker: React.FC<SpellCheckerProps> = ({ text, onCorrectedText }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<SpellCheckResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  // Simulation d'une vérification orthographique/grammaticale
  const performSpellCheck = async () => {
    setIsChecking(true);
    
    try {
      // Simulation d'une API de vérification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Règles de base pour détecter des erreurs communes
      const corrections = [];
      const words = text.split(/\s+/);
      
      // Dictionnaire simple d'erreurs communes en français
      const commonErrors = {
        'developper': 'développer',
        'developement': 'développement',
        'reseaux': 'réseaux',
        'francais': 'français',
        'entreprise': 'entreprise',
        'competences': 'compétences',
        'experience': 'expérience',
        'etude': 'étude',
        'formation': 'formation'
      };
      
      words.forEach((word, index) => {
        const cleanWord = word.toLowerCase().replace(/[.,!?;]/g, '');
        if (commonErrors[cleanWord]) {
          corrections.push({
            original: word,
            suggested: commonErrors[cleanWord],
            type: 'spelling' as const,
            position: index
          });
        }
      });
      
      // Vérifications grammaticales basiques
      if (text.includes('sa va')) {
        corrections.push({
          original: 'sa va',
          suggested: 'ça va',
          type: 'grammar' as const,
          position: text.indexOf('sa va')
        });
      }
      
      if (text.includes('ces') && text.includes('interessant')) {
        corrections.push({
          original: 'ces interessant',
          suggested: "c'est intéressant",
          type: 'grammar' as const,
          position: text.indexOf('ces interessant')
        });
      }
      
      // Calcul du score de qualité
      const totalWords = words.length;
      const errorCount = corrections.length;
      const score = Math.max(0, Math.min(100, 100 - (errorCount / totalWords) * 20));
      
      const result: SpellCheckResult = {
        text,
        corrections,
        score: Math.round(score)
      };
      
      setResults(result);
      setShowResults(true);
      
      if (corrections.length === 0) {
        toast({
          title: "Excellent !",
          description: "Aucune erreur détectée dans votre texte.",
        });
      } else {
        toast({
          title: `${corrections.length} amélioration(s) suggérée(s)`,
          description: "Consultez les suggestions ci-dessous.",
        });
      }
      
    } catch (error) {
      console.error('Spell check error:', error);
      toast({
        title: "Erreur de vérification",
        description: "Impossible de vérifier l'orthographe",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const applyCorrectionBatch = () => {
    if (!results) return;
    
    let correctedText = text;
    
    // Appliquer toutes les corrections
    results.corrections.forEach((correction) => {
      correctedText = correctedText.replace(new RegExp(correction.original, 'g'), correction.suggested);
    });
    
    onCorrectedText(correctedText);
    setShowResults(false);
    setResults(null);
    
    toast({
      title: "Corrections appliquées",
      description: "Toutes les suggestions ont été intégrées au texte.",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return "default";
    if (score >= 70) return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-4">
      {/* Action Button */}
      <div className="flex justify-center">
        <Button
          onClick={performSpellCheck}
          disabled={isChecking || !text.trim()}
          className="animate-pulse-glow"
        >
          {isChecking ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Vérification en cours...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Vérifier l'orthographe
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      {showResults && results && (
        <Card className="border-0 shadow-modern animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-primary" />
                Résultats de la vérification
              </div>
              <Badge variant={getScoreBadgeVariant(results.score)}>
                Score: {results.score}/100
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.corrections.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-600 mb-2">
                  Parfait !
                </h3>
                <p className="text-muted-foreground">
                  Votre texte ne contient aucune erreur détectée.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
                    {results.corrections.length} amélioration(s) suggérée(s)
                  </h4>
                  <Button
                    size="sm"
                    onClick={applyCorrectionBatch}
                    className="animate-scale-in"
                  >
                    Appliquer toutes
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  {results.corrections.map((correction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {correction.type === 'spelling' ? 'Orthographe' : 
                             correction.type === 'grammar' ? 'Grammaire' : 'Style'}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          <span className="line-through text-red-600 mr-2">
                            {correction.original}
                          </span>
                          <span className="text-green-600 font-medium">
                            → {correction.suggested}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h5 className="font-medium text-blue-900 mb-2">
                    💡 Conseils pour améliorer votre CV
                  </h5>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Utilisez des verbes d'action (réalisé, développé, géré)</li>
                    <li>• Évitez les répétitions et variez le vocabulaire</li>
                    <li>• Soyez précis dans les descriptions d'expériences</li>
                    <li>• Relisez attentivement avant finalisation</li>
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SpellChecker;