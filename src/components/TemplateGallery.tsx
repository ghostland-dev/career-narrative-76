import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Palette } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  preview_image_url?: string;
  styles: any;
  is_premium: boolean;
}

interface TemplateGalleryProps {
  templates: Template[];
  onSelectTemplate: (templateId: string) => void;
  selectedTemplate?: string;
}

const TemplateGallery = ({ templates, onSelectTemplate, selectedTemplate }: TemplateGalleryProps) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'free' | 'premium'>('all');

  const filteredTemplates = templates.filter(template => {
    if (selectedCategory === 'free') return !template.is_premium;
    if (selectedCategory === 'premium') return template.is_premium;
    return true;
  });

  const getTemplatePreview = (template: Template) => {
    // Generate a simple preview based on template styles
    const styles = template.styles || {};
    const primaryColor = styles.primaryColor || '#2563eb';
    const layout = styles.layout || 'single-column';
    
    return (
      <div className="w-full h-32 bg-background border border-border rounded-lg p-3 overflow-hidden">
        <div className="space-y-2">
          <div 
            className="h-3 rounded"
            style={{ backgroundColor: primaryColor, width: '70%' }}
          />
          <div className="h-1 bg-muted rounded" style={{ width: '50%' }} />
          <div className="h-1 bg-muted rounded" style={{ width: '60%' }} />
          <div className="space-y-1 mt-3">
            <div className="h-1 bg-muted rounded" style={{ width: '80%' }} />
            <div className="h-1 bg-muted rounded" style={{ width: '70%' }} />
            <div className="h-1 bg-muted rounded" style={{ width: '65%' }} />
          </div>
          {layout === 'two-column' && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="space-y-1">
                <div className="h-1 bg-muted rounded" />
                <div className="h-1 bg-muted rounded" style={{ width: '80%' }} />
              </div>
              <div className="space-y-1">
                <div className="h-1 bg-muted rounded" />
                <div className="h-1 bg-muted rounded" style={{ width: '90%' }} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Galerie de Templates</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            Tous
          </Button>
          <Button
            variant={selectedCategory === 'free' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedCategory('free')}
          >
            Gratuits
          </Button>
          <Button
            variant={selectedCategory === 'premium' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedCategory('premium')}
          >
            Premium
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card 
            key={template.id} 
            className={`cursor-pointer transition-all hover:shadow-elegant ${
              selectedTemplate === template.id 
                ? 'ring-2 ring-primary shadow-card' 
                : 'border-0 shadow-card'
            }`}
            onClick={() => onSelectTemplate(template.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                {template.is_premium && (
                  <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                    Premium
                  </Badge>
                )}
              </div>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Template Preview */}
              <div className="relative">
                {template.preview_image_url ? (
                  <img 
                    src={template.preview_image_url} 
                    alt={`Aperçu ${template.name}`}
                    className="w-full h-32 object-cover rounded-lg border border-border"
                  />
                ) : (
                  getTemplatePreview(template)
                )}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
                  <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2">
                    <Eye className="h-4 w-4 text-white" />
                    <span className="text-white text-sm">Aperçu</span>
                  </div>
                </div>
              </div>

              {/* Template Features */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Palette className="h-4 w-4" />
                  <span>{template.styles?.layout || 'Standard'}</span>
                </div>
                <Button 
                  size="sm" 
                  variant={selectedTemplate === template.id ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(template.id);
                  }}
                >
                  {selectedTemplate === template.id ? 'Sélectionné' : 'Utiliser'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card className="border-0 shadow-card">
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun template trouvé</h3>
            <p className="text-muted-foreground">
              Aucun template ne correspond à vos critères de recherche.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TemplateGallery;