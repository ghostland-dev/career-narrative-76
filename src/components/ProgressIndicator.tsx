import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface Section {
  id: string;
  name: string;
  required: boolean;
  completed: boolean;
  hasErrors?: boolean;
}

interface ProgressIndicatorProps {
  sections: Section[];
  currentSection?: string;
  onSectionClick?: (sectionId: string) => void;
}

export const ProgressIndicator = ({ 
  sections, 
  currentSection, 
  onSectionClick 
}: ProgressIndicatorProps) => {
  const completedSections = sections.filter(s => s.completed).length;
  const totalSections = sections.length;
  const requiredSections = sections.filter(s => s.required);
  const completedRequiredSections = requiredSections.filter(s => s.completed).length;
  
  const progressPercentage = (completedSections / totalSections) * 100;
  const isReadyForExport = requiredSections.every(s => s.completed);

  const getSectionIcon = (section: Section) => {
    if (section.hasErrors) {
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
    if (section.completed) {
      return <CheckCircle2 className="h-4 w-4 text-success" />;
    }
    return <Circle className="h-4 w-4 text-muted-foreground" />;
  };

  const getSectionStatus = (section: Section) => {
    if (section.hasErrors) return 'Erreurs';
    if (section.completed) return 'Terminé';
    if (section.required) return 'Requis';
    return 'Optionnel';
  };

  const getSectionStatusVariant = (section: Section): "default" | "secondary" | "destructive" | "outline" => {
    if (section.hasErrors) return 'destructive';
    if (section.completed) return 'default';
    if (section.required) return 'outline';
    return 'secondary';
  };

  return (
    <Card className="border-0 shadow-card">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">Progression du CV</h3>
              <span className="text-sm text-muted-foreground">
                {completedSections}/{totalSections} sections
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {isReadyForExport && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm font-medium text-success">
                  CV prêt à être exporté !
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                  currentSection === section.id 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'hover:bg-accent'
                }`}
                onClick={() => onSectionClick?.(section.id)}
              >
                <div className="flex items-center space-x-2">
                  {getSectionIcon(section)}
                  <span className="text-sm font-medium">{section.name}</span>
                </div>
                <Badge variant={getSectionStatusVariant(section)} className="text-xs">
                  {getSectionStatus(section)}
                </Badge>
              </div>
            ))}
          </div>

          <div className="text-xs text-muted-foreground pt-2 border-t">
            <p>
              Les sections marquées "Requis" doivent être complétées pour exporter le CV.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};