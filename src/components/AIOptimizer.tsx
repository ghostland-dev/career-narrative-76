import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Wand2, Loader2, CheckCircle, Target, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AIOptimizerProps {
  cvData: any;
  onOptimizedData: (data: any) => void;
}

const AIOptimizer: React.FC<AIOptimizerProps> = ({ cvData, onOptimizedData }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationStatus, setOptimizationStatus] = useState<{
    [key: string]: 'pending' | 'processing' | 'done'
  }>({});
  const { toast } = useToast();

  const optimizationTasks = [
    {
      id: 'optimize_cv',
      label: 'Optimisation globale du CV',
      description: 'Améliore l\'ensemble du CV pour le rendre plus attractif',
      icon: Sparkles
    },
    {
      id: 'improve_summary',
      label: 'Résumé professionnel',
      description: 'Créé un résumé impactant basé sur votre profil',
      icon: Target
    },
    {
      id: 'suggest_skills',
      label: 'Suggestions de compétences',
      description: 'Recommande des compétences pertinentes pour votre secteur',
      icon: TrendingUp
    }
  ];

  const runOptimization = async (taskId: string) => {
    setOptimizationStatus(prev => ({ ...prev, [taskId]: 'processing' }));

    try {
      const { data, error } = await supabase.functions.invoke('ai-cv-optimizer', {
        body: {
          action: taskId,
          data: cvData
        }
      });

      if (error) throw error;

      if (data.success) {
        let optimizedData = { ...cvData };

        switch (taskId) {
          case 'optimize_cv':
            try {
              const parsedCV = JSON.parse(data.result);
              optimizedData = parsedCV;
            } catch {
              toast({
                title: "Optimisation partielle",
                description: "Certaines améliorations n'ont pas pu être appliquées automatiquement.",
                variant: "destructive"
              });
            }
            break;

          case 'improve_summary':
            optimizedData.summary = data.result.replace(/^"|"$/g, '');
            break;

          case 'suggest_skills':
            const suggestedSkills = data.result.split(',').map((s: string) => s.trim());
            const existingSkills = cvData.skills || [];
            const newSkills = suggestedSkills.filter((skill: string) => 
              !existingSkills.some((existing: string) => 
                existing.toLowerCase() === skill.toLowerCase()
              )
            );
            optimizedData.skills = [...existingSkills, ...newSkills.slice(0, 5)];
            break;
        }

        onOptimizedData(optimizedData);
        setOptimizationStatus(prev => ({ ...prev, [taskId]: 'done' }));
        
        toast({
          title: "Optimisation réussie",
          description: `${optimizationTasks.find(t => t.id === taskId)?.label} terminée !`,
        });
      } else {
        throw new Error(data.error || 'Erreur inconnue');
      }
    } catch (error) {
      console.error(`Erreur optimisation ${taskId}:`, error);
      setOptimizationStatus(prev => ({ ...prev, [taskId]: 'pending' }));
      toast({
        title: "Erreur d'optimisation",
        description: "Impossible d'optimiser cette section. Réessayez plus tard.",
        variant: "destructive",
      });
    }
  };

  const runAllOptimizations = async () => {
    setIsOptimizing(true);
    
    for (const task of optimizationTasks) {
      await runOptimization(task.id);
      // Petite pause entre les optimisations
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsOptimizing(false);
    toast({
      title: "Optimisation complète terminée !",
      description: "Votre CV a été optimisé avec succès.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case 'done':
        return <CheckCircle className="h-4 w-4 text-success" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <Badge variant="secondary">En cours...</Badge>;
      case 'done':
        return <Badge className="bg-success text-success-foreground">Terminé</Badge>;
      default:
        return <Badge variant="outline">En attente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Wand2 className="h-5 w-5 text-primary" />
            <span>Optimisations IA</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            Améliorez votre CV automatiquement avec l'intelligence artificielle
          </p>
        </div>
        
        <Button 
          onClick={runAllOptimizations}
          disabled={isOptimizing}
          className="animate-pulse-glow"
        >
          {isOptimizing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Optimisation...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Optimiser tout
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4">
        {optimizationTasks.map((task) => {
          const IconComponent = task.icon;
          const status = optimizationStatus[task.id] || 'pending';
          
          return (
            <Card key={task.id} className="border-0 shadow-card hover:shadow-elegant transition-smooth">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{task.label}</h4>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(status)}
                    {getStatusBadge(status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => runOptimization(task.id)}
                      disabled={status === 'processing' || isOptimizing}
                    >
                      {status === 'done' ? 'Re-optimiser' : 'Optimiser'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-primary">Conseil IA</h4>
              <p className="text-sm text-muted-foreground mt-1">
                L'optimisation IA analyse votre profil et améliore automatiquement le contenu pour maximiser 
                vos chances auprès des recruteurs. Les suggestions se basent sur les meilleures pratiques 
                et les tendances actuelles du marché de l'emploi.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIOptimizer;