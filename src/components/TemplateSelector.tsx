import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Briefcase, Sparkles, Monitor, Award, Crown, Zap, FileText } from "lucide-react";

interface TemplateSelectorProps {
  currentTemplate: string;
  onTemplateChange: (template: string) => void;
}

const templates = [
  {
    id: "modern",
    name: "Moderne",
    description: "Design contemporain avec gradient et couleurs vives",
    icon: <Palette className="h-4 w-4" />,
    preview: "bg-gradient-to-r from-primary/10 to-primary/5 border-l-4 border-primary",
    color: "text-primary"
  },
  {
    id: "classic",
    name: "Classique",
    description: "Style traditionnel et professionnel",
    icon: <Briefcase className="h-4 w-4" />,
    preview: "bg-gray-50 border-b-2 border-gray-800",
    color: "text-gray-800"
  },
  {
    id: "minimal",
    name: "Minimaliste",
    description: "Design épuré et simple",
    icon: <FileText className="h-4 w-4" />,
    preview: "border-b border-gray-300",
    color: "text-gray-700"
  },
  {
    id: "creative",
    name: "Créatif",
    description: "Style artistique avec couleurs purple/pink",
    icon: <Sparkles className="h-4 w-4" />,
    preview: "bg-gradient-to-r from-purple-100 to-pink-100 border-l-4 border-purple-500 rounded-r-lg",
    color: "text-purple-600"
  },
  {
    id: "professional",
    name: "Professionnel",
    description: "Look corporate avec tons slate",
    icon: <Award className="h-4 w-4" />,
    preview: "bg-slate-100 border-l-4 border-slate-600",
    color: "text-slate-700"
  },
  {
    id: "elegant",
    name: "Élégant",
    description: "Style raffiné avec touches dorées",
    icon: <Crown className="h-4 w-4" />,
    preview: "bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500",
    color: "text-amber-700"
  },
  {
    id: "tech",
    name: "Tech",
    description: "Style technologique avec bleu cyan",
    icon: <Monitor className="h-4 w-4" />,
    preview: "bg-gradient-to-r from-blue-100 to-cyan-100 border-l-4 border-blue-500",
    color: "text-blue-600"
  },
  {
    id: "print",
    name: "Impression",
    description: "Optimisé pour l'impression",
    icon: <Zap className="h-4 w-4" />,
    preview: "border-b-2 border-primary",
    color: "text-primary"
  }
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  currentTemplate,
  onTemplateChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Styles de CV</h3>
        <Badge variant="secondary" className="ml-auto">
          {templates.find(t => t.id === currentTemplate)?.name || "Moderne"}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
              currentTemplate === template.id
                ? "ring-2 ring-primary shadow-lg"
                : "hover:ring-1 hover:ring-primary/50"
            }`}
            onClick={() => onTemplateChange(template.id)}
          >
            <CardContent className="p-3">
              <div className="space-y-2">
                {/* Aperçu visuel */}
                <div className="h-12 w-full rounded-md flex items-center justify-center relative overflow-hidden">
                  <div className={`absolute inset-0 ${template.preview}`} />
                  <div className={`relative z-10 ${template.color}`}>
                    {template.icon}
                  </div>
                </div>
                
                {/* Nom du template */}
                <div className="text-center">
                  <p className="font-medium text-sm">{template.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                </div>
                
                {/* Indicateur de sélection */}
                {currentTemplate === template.id && (
                  <div className="flex justify-center">
                    <Badge variant="default" className="text-xs">
                      Sélectionné
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-xs text-muted-foreground text-center mt-4">
        Cliquez sur un style pour l'appliquer instantanément à votre CV
      </div>
    </div>
  );
};

export default TemplateSelector;