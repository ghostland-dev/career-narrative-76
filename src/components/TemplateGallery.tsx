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
    <div className="space-y-8">
      {/* Enhanced Filter Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Galerie de Templates
          </h2>
          <p className="text-muted-foreground">
            {filteredTemplates.length} template{filteredTemplates.length > 1 ? 's' : ''} disponible{filteredTemplates.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className={selectedCategory === 'all' ? 'bg-gradient-to-r from-primary to-primary-glow text-white shadow-none' : 'hover:bg-accent/10'}
          >
            Tous
          </Button>
          <Button
            variant={selectedCategory === 'free' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedCategory('free')}
            className={selectedCategory === 'free' ? 'bg-gradient-to-r from-success to-accent text-white shadow-none' : 'hover:bg-accent/10'}
          >
            Gratuits
          </Button>
          <Button
            variant={selectedCategory === 'premium' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedCategory('premium')}
            className={selectedCategory === 'premium' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-none' : 'hover:bg-accent/10'}
          >
            Premium
          </Button>
        </div>
      </div>

      {/* Enhanced Grid Layout */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTemplates.map((template, index) => (
          <Card 
            key={template.id} 
            className={`group cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
              selectedTemplate === template.id 
                ? 'ring-2 ring-primary shadow-elegant bg-gradient-to-br from-card to-primary/5' 
                : 'border-0 shadow-card hover:shadow-elegant bg-card/50 backdrop-blur-sm'
            }`}
            onClick={() => onSelectTemplate(template.id)}
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                  {template.name}
                </CardTitle>
                {template.is_premium && (
                  <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-glow animate-pulse">
                    <span className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>
                      <span>Premium</span>
                    </span>
                  </Badge>
                )}
              </div>
              <CardDescription className="text-muted-foreground">
                {template.description}
              </CardDescription>
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg flex items-center justify-center">
                  <div className="bg-black/30 backdrop-blur-md rounded-xl px-4 py-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center space-x-2 text-white">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">Aperçu détaillé</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Template Features */}
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Palette className="h-4 w-4" />
                    <span className="font-medium">{template.styles?.layout || 'Standard'}</span>
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="flex items-center space-x-1 text-success text-sm font-medium">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                      <span>Sélectionné</span>
                    </div>
                  )}
                </div>
                <Button 
                  size="sm" 
                  variant={selectedTemplate === template.id ? "default" : "outline"}
                  className={selectedTemplate === template.id 
                    ? "bg-gradient-to-r from-primary to-primary-glow text-white shadow-glow" 
                    : "border-border/50 hover:bg-accent/10 hover:border-primary/30"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(template.id);
                  }}
                >
                  {selectedTemplate === template.id ? (
                    <span className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                      <span>Choisi</span>
                    </span>
                  ) : (
                    'Utiliser'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Empty State */}
      {filteredTemplates.length === 0 && (
        <Card className="border-0 shadow-card bg-card/50 backdrop-blur-sm">
          <CardContent className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-muted to-accent/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <FileText className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Aucun template trouvé</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Aucun template ne correspond à vos critères. Essayez de modifier vos filtres ou 
              <span className="text-primary font-medium"> créez un CV sans template</span>.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TemplateGallery;