import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Type, 
  Move, 
  RotateCcw,
  Droplets,
  Layers,
  Grid,
  AlignLeft,
  AlignCenter,
  AlignRight
} from "lucide-react";

interface DesignSystemProps {
  onFontChange: (font: string) => void;
  onColorChange: (colors: ColorPalette) => void;
  onSpacingChange: (spacing: SpacingControls) => void;
}

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
  muted: string;
}

interface SpacingControls {
  margin: number;
  padding: number;
  lineHeight: number;
  letterSpacing: number;
}

const googleFonts = [
  { name: "Inter", value: "Inter", category: "Sans-serif moderne" },
  { name: "Roboto", value: "Roboto", category: "Sans-serif classique" },
  { name: "Playfair Display", value: "Playfair Display", category: "Serif élégant" },
  { name: "Montserrat", value: "Montserrat", category: "Sans-serif géométrique" },
  { name: "Lora", value: "Lora", category: "Serif moderne" },
  { name: "Open Sans", value: "Open Sans", category: "Sans-serif humaniste" },
  { name: "Poppins", value: "Poppins", category: "Sans-serif rond" },
  { name: "Source Sans Pro", value: "Source Sans Pro", category: "Sans-serif professionnel" }
];

const colorPalettes = [
  {
    name: "Professionnel",
    colors: {
      primary: "#2563eb",
      secondary: "#64748b",
      accent: "#0ea5e9",
      text: "#1e293b",
      background: "#ffffff",
      muted: "#f1f5f9"
    }
  },
  {
    name: "Moderne",
    colors: {
      primary: "#7c3aed",
      secondary: "#a855f7",
      accent: "#ec4899",
      text: "#1f2937",
      background: "#ffffff",
      muted: "#f9fafb"
    }
  },
  {
    name: "Minimaliste",
    colors: {
      primary: "#374151",
      secondary: "#6b7280",
      accent: "#059669",
      text: "#111827",
      background: "#ffffff",
      muted: "#f3f4f6"
    }
  },
  {
    name: "Chaleureux",
    colors: {
      primary: "#ea580c",
      secondary: "#f59e0b",
      accent: "#dc2626",
      text: "#1f2937",
      background: "#fffbeb",
      muted: "#fef3c7"
    }
  }
];

const DesignSystem: React.FC<DesignSystemProps> = ({
  onFontChange,
  onColorChange,
  onSpacingChange
}) => {
  const [selectedFont, setSelectedFont] = useState("Inter");
  const [customColors, setCustomColors] = useState<ColorPalette>(colorPalettes[0].colors);
  const [spacing, setSpacing] = useState<SpacingControls>({
    margin: 16,
    padding: 12,
    lineHeight: 1.5,
    letterSpacing: 0
  });

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    onFontChange(font);
    
    // Charger la police Google Fonts dynamiquement
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@400;500;600;700&display=swap`;
    link.rel = 'stylesheet';
    if (!document.querySelector(`link[href*="${font.replace(' ', '+')}"]`)) {
      document.head.appendChild(link);
    }
  };

  const handleColorPaletteChange = (palette: ColorPalette) => {
    setCustomColors(palette);
    onColorChange(palette);
  };

  const handleSpacingChange = (key: keyof SpacingControls, value: number) => {
    const newSpacing = { ...spacing, [key]: value };
    setSpacing(newSpacing);
    onSpacingChange(newSpacing);
  };

  const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (color: string) => void }) => (
    <div className="flex items-center space-x-2">
      <Label className="text-sm min-w-[80px]">{label}</Label>
      <div className="flex items-center space-x-2">
        <div 
          className="w-8 h-8 rounded border cursor-pointer"
          style={{ backgroundColor: value }}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'color';
            input.value = value;
            input.onchange = (e) => onChange((e.target as HTMLInputElement).value);
            input.click();
          }}
        />
        <Input 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-20 text-xs"
        />
      </div>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="h-5 w-5" />
          <span>Système de Design</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="typography" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="typography">
              <Type className="h-4 w-4 mr-1" />
              Police
            </TabsTrigger>
            <TabsTrigger value="colors">
              <Droplets className="h-4 w-4 mr-1" />
              Couleurs
            </TabsTrigger>
            <TabsTrigger value="spacing">
              <Grid className="h-4 w-4 mr-1" />
              Espacement
            </TabsTrigger>
            <TabsTrigger value="layout">
              <Layers className="h-4 w-4 mr-1" />
              Mise en page
            </TabsTrigger>
          </TabsList>

          <TabsContent value="typography" className="space-y-4">
            <div className="space-y-3">
              <Label>Police principale</Label>
              <Select value={selectedFont} onValueChange={handleFontChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une police" />
                </SelectTrigger>
                <SelectContent>
                  {googleFonts.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <div className="flex flex-col">
                        <span style={{ fontFamily: font.value }}>{font.name}</span>
                        <span className="text-xs text-muted-foreground">{font.category}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="p-4 border rounded-md" style={{ fontFamily: selectedFont }}>
                <h3 className="font-semibold mb-2">Aperçu de la police</h3>
                <p className="text-sm text-muted-foreground">
                  Développeur Frontend passionné avec 5 ans d'expérience dans la création d'applications web modernes.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="colors" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="mb-3 block">Palettes prédéfinies</Label>
                <div className="grid grid-cols-2 gap-2">
                  {colorPalettes.map((palette) => (
                    <Button
                      key={palette.name}
                      variant="outline"
                      className="h-auto p-3 flex flex-col space-y-2"
                      onClick={() => handleColorPaletteChange(palette.colors)}
                    >
                      <span className="text-sm font-medium">{palette.name}</span>
                      <div className="flex space-x-1">
                        {Object.values(palette.colors).slice(0, 4).map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Couleurs personnalisées</Label>
                <ColorPicker 
                  label="Primaire" 
                  value={customColors.primary}
                  onChange={(color) => {
                    const newColors = { ...customColors, primary: color };
                    setCustomColors(newColors);
                    onColorChange(newColors);
                  }}
                />
                <ColorPicker 
                  label="Secondaire" 
                  value={customColors.secondary}
                  onChange={(color) => {
                    const newColors = { ...customColors, secondary: color };
                    setCustomColors(newColors);
                    onColorChange(newColors);
                  }}
                />
                <ColorPicker 
                  label="Accent" 
                  value={customColors.accent}
                  onChange={(color) => {
                    const newColors = { ...customColors, accent: color };
                    setCustomColors(newColors);
                    onColorChange(newColors);
                  }}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="spacing" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Marges externes ({spacing.margin}px)</Label>
                <Slider
                  value={[spacing.margin]}
                  onValueChange={([value]) => handleSpacingChange('margin', value)}
                  max={50}
                  min={0}
                  step={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Padding interne ({spacing.padding}px)</Label>
                <Slider
                  value={[spacing.padding]}
                  onValueChange={([value]) => handleSpacingChange('padding', value)}
                  max={30}
                  min={0}
                  step={1}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Hauteur de ligne ({spacing.lineHeight})</Label>
                <Slider
                  value={[spacing.lineHeight]}
                  onValueChange={([value]) => handleSpacingChange('lineHeight', value)}
                  max={3}
                  min={1}
                  step={0.1}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Espacement des lettres ({spacing.letterSpacing}px)</Label>
                <Slider
                  value={[spacing.letterSpacing]}
                  onValueChange={([value]) => handleSpacingChange('letterSpacing', value)}
                  max={2}
                  min={-1}
                  step={0.1}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="mb-3 block">Alignement du texte</Label>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="mb-3 block">Composants réorganisables</Label>
                <div className="p-4 border-2 border-dashed rounded-md">
                  <p className="text-sm text-muted-foreground text-center">
                    Glissez-déposez les sections de votre CV pour les réorganiser
                  </p>
                  <div className="mt-3 space-y-2">
                    {['Expérience', 'Formation', 'Compétences', 'Projets'].map((section) => (
                      <div 
                        key={section}
                        className="p-2 bg-secondary/20 rounded cursor-move flex items-center space-x-2"
                        draggable
                      >
                        <Move className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{section}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Réinitialiser la mise en page
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DesignSystem;