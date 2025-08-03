import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  Palette, 
  Type, 
  Layout,
  Minus,
  Plus,
  RotateCcw,
  Eye,
  Brush,
  PaintBucket
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DesignSettings {
  pageMargin: number;
  sectionSpacing: number;
  useCustomColors: boolean;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  lineHeight: number;
  backgroundStyle: 'none' | 'subtle' | 'gradient';
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  backgroundColor: string;
}

interface DesignCustomizerProps {
  settings: DesignSettings;
  onSettingsChange: (settings: DesignSettings) => void;
}

const fontOptions = [
  { name: "Montserrat", value: "Montserrat", preview: "font-sans" },
  { name: "Inter", value: "Inter", preview: "font-sans" },
  { name: "Playfair Display", value: "Playfair Display", preview: "font-serif" },
  { name: "Roboto", value: "Roboto", preview: "font-sans" },
  { name: "Open Sans", value: "Open Sans", preview: "font-sans" },
  { name: "Lato", value: "Lato", preview: "font-sans" },
  { name: "Source Sans Pro", value: "Source Sans Pro", preview: "font-sans" },
  { name: "Merriweather", value: "Merriweather", preview: "font-serif" }
];

const colorPresets = [
  { name: "Bleu professionnel", primary: "#2563eb", secondary: "#64748b", text: "#1e293b", bg: "#ffffff" },
  { name: "Vert moderne", primary: "#059669", secondary: "#6b7280", text: "#1f2937", bg: "#ffffff" },
  { name: "Violet créatif", primary: "#7c3aed", secondary: "#a855f7", text: "#1e1b4b", bg: "#ffffff" },
  { name: "Orange dynamique", primary: "#ea580c", secondary: "#f97316", text: "#9a3412", bg: "#ffffff" },
  { name: "Rose élégant", primary: "#ec4899", secondary: "#f472b6", text: "#831843", bg: "#ffffff" },
  { name: "Cyan tech", primary: "#0891b2", secondary: "#06b6d4", text: "#164e63", bg: "#ffffff" }
];

const DesignCustomizer: React.FC<DesignCustomizerProps> = ({
  settings,
  onSettingsChange
}) => {
  const { toast } = useToast();

  const updateSetting = (key: keyof DesignSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    onSettingsChange(newSettings);
  };

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    const newSettings = {
      ...settings,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      textColor: preset.text,
      backgroundColor: preset.bg,
      useCustomColors: true
    };
    onSettingsChange(newSettings);
    toast({
      title: "Palette appliquée",
      description: `Le thème "${preset.name}" a été appliqué à votre CV.`,
      duration: 2000,
    });
  };

  const resetToDefaults = () => {
    const defaultSettings: DesignSettings = {
      pageMargin: 2,
      sectionSpacing: 2,
      useCustomColors: false,
      fontFamily: "Montserrat",
      fontSize: "medium",
      lineHeight: 1.5,
      backgroundStyle: "none",
      primaryColor: "#2563eb",
      secondaryColor: "#64748b",
      textColor: "#1e293b",
      backgroundColor: "#ffffff"
    };
    onSettingsChange(defaultSettings);
    toast({
      title: "Paramètres réinitialisés",
      description: "Tous les réglages ont été remis aux valeurs par défaut.",
      duration: 2000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center">
            <Brush className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Design & Fonte</h3>
            <p className="text-sm text-muted-foreground">Personnalisez l'apparence de votre CV</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={resetToDefaults}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Réinitialiser
        </Button>
      </div>

      {/* Marges et espacement */}
      <Card className="border-0 shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg">
            <Layout className="h-5 w-5 mr-2 text-primary" />
            Mise en page
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Marges de page</Label>
              <Badge variant="outline">{settings.pageMargin}</Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateSetting('pageMargin', Math.max(1, settings.pageMargin - 1))}
                disabled={settings.pageMargin <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Slider
                value={[settings.pageMargin]}
                onValueChange={([value]) => updateSetting('pageMargin', value)}
                max={5}
                min={1}
                step={1}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateSetting('pageMargin', Math.min(5, settings.pageMargin + 1))}
                disabled={settings.pageMargin >= 5}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Espacement de section</Label>
              <Badge variant="outline">{settings.sectionSpacing}</Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateSetting('sectionSpacing', Math.max(1, settings.sectionSpacing - 1))}
                disabled={settings.sectionSpacing <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Slider
                value={[settings.sectionSpacing]}
                onValueChange={([value]) => updateSetting('sectionSpacing', value)}
                max={5}
                min={1}
                step={1}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateSetting('sectionSpacing', Math.min(5, settings.sectionSpacing + 1))}
                disabled={settings.sectionSpacing >= 5}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Couleurs */}
      <Card className="border-0 shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg">
            <Palette className="h-5 w-5 mr-2 text-primary" />
            Couleurs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Utiliser des couleurs personnalisées</Label>
            <Switch
              checked={settings.useCustomColors}
              onCheckedChange={(checked) => updateSetting('useCustomColors', checked)}
            />
          </div>

          {/* Palettes prédéfinies */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Palettes prédéfinies</Label>
            <div className="grid grid-cols-2 gap-3">
              {colorPresets.map((preset, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => applyColorPreset(preset)}
                  className="justify-start h-auto p-3 hover:shadow-card"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div
                        className="w-3 h-3 rounded-full border border-border"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <div
                        className="w-3 h-3 rounded-full border border-border"
                        style={{ backgroundColor: preset.secondary }}
                      />
                    </div>
                    <span className="text-xs font-medium">{preset.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Couleurs personnalisées */}
          {settings.useCustomColors && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Couleur principale</Label>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-8 h-8 rounded-md border border-border"
                      style={{ backgroundColor: settings.primaryColor }}
                    />
                    <Input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting('primaryColor', e.target.value)}
                      className="w-16 h-8 p-0 border-0"
                    />
                    <Input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting('primaryColor', e.target.value)}
                      className="text-xs font-mono flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Couleur secondaire</Label>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-8 h-8 rounded-md border border-border"
                      style={{ backgroundColor: settings.secondaryColor }}
                    />
                    <Input
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                      className="w-16 h-8 p-0 border-0"
                    />
                    <Input
                      type="text"
                      value={settings.secondaryColor}
                      onChange={(e) => updateSetting('secondaryColor', e.target.value)}
                      className="text-xs font-mono flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Typographie */}
      <Card className="border-0 shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg">
            <Type className="h-5 w-5 mr-2 text-primary" />
            Style de police
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sélection de police */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Police de caractères</Label>
            <div className="grid grid-cols-1 gap-2">
              {fontOptions.map((font) => (
                <Button
                  key={font.value}
                  variant={settings.fontFamily === font.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting('fontFamily', font.value)}
                  className={`justify-start ${font.preview} ${
                    settings.fontFamily === font.value 
                      ? "bg-gradient-to-r from-primary to-primary-glow text-white" 
                      : "hover:bg-muted/50"
                  }`}
                >
                  <span style={{ fontFamily: font.value }}>{font.name}</span>
                  {settings.fontFamily === font.value && (
                    <Badge variant="secondary" className="ml-auto bg-white/20 text-white">
                      Sélectionné
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Taille de police */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Taille de police</Label>
            <div className="flex gap-2">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <Button
                  key={size}
                  variant={settings.fontSize === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting('fontSize', size)}
                  className={settings.fontSize === size 
                    ? "bg-gradient-to-r from-primary to-primary-glow text-white" 
                    : ""}
                >
                  {size === 'small' && 'Small'}
                  {size === 'medium' && 'Medium'}
                  {size === 'large' && 'Large'}
                </Button>
              ))}
            </div>
          </div>

          {/* Interligne */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Interligne</Label>
              <Badge variant="outline">{settings.lineHeight}x</Badge>
            </div>
            <Slider
              value={[settings.lineHeight]}
              onValueChange={([value]) => updateSetting('lineHeight', value)}
              max={2}
              min={1}
              step={0.1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Arrière-plans */}
      <Card className="border-0 shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg">
            <PaintBucket className="h-5 w-5 mr-2 text-primary" />
            Arrière-plans
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {([
              { value: 'none', label: 'Aucun' },
              { value: 'subtle', label: 'Subtil' },
              { value: 'gradient', label: 'Gradient' }
            ] as const).map((bg) => (
              <Button
                key={bg.value}
                variant={settings.backgroundStyle === bg.value ? "default" : "outline"}
                size="sm"
                onClick={() => updateSetting('backgroundStyle', bg.value)}
                className={settings.backgroundStyle === bg.value 
                  ? "bg-gradient-to-r from-primary to-primary-glow text-white" 
                  : ""}
              >
                {bg.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Aperçu des modifications */}
      <Card className="border-0 shadow-card bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <Eye className="h-5 w-5 text-primary" />
            <div>
              <h4 className="font-semibold">Aperçu en temps réel</h4>
              <p className="text-sm text-muted-foreground">
                Les modifications sont appliquées automatiquement à votre CV
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignCustomizer;