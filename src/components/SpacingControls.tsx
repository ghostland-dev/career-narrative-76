import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Move, 
  AlignLeft,
  AlignCenter,
  AlignRight,
  Layers
} from 'lucide-react';

interface SpacingSettings {
  pageMargin: number;
  sectionSpacing: number;
  itemSpacing: number;
  lineHeight: number;
  headerPadding: number;
  contentPadding: number;
  borderRadius: number;
  fontSize: number;
}

interface SpacingControlsProps {
  settings: SpacingSettings;
  onSettingsChange: (settings: SpacingSettings) => void;
  onReset: () => void;
}

const SpacingControls: React.FC<SpacingControlsProps> = ({
  settings,
  onSettingsChange,
  onReset
}) => {
  const updateSetting = (key: keyof SpacingSettings, value: number) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const defaultSettings: SpacingSettings = {
    pageMargin: 32,
    sectionSpacing: 24,
    itemSpacing: 16,
    lineHeight: 1.5,
    headerPadding: 16,
    contentPadding: 16,
    borderRadius: 8,
    fontSize: 14
  };

  const presets = [
    { name: "Compact", values: { ...defaultSettings, pageMargin: 16, sectionSpacing: 12, itemSpacing: 8 } },
    { name: "Standard", values: defaultSettings },
    { name: "Spacieux", values: { ...defaultSettings, pageMargin: 48, sectionSpacing: 32, itemSpacing: 24 } },
    { name: "Moderne", values: { ...defaultSettings, borderRadius: 12, headerPadding: 24, contentPadding: 20 } }
  ];

  return (
    <Card className="border-0 shadow-modern">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Layers className="w-5 h-5 mr-2 text-primary" />
            Contrôles d'espacement
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Presets rapides */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Presets rapides</Label>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <Badge
                key={preset.name}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => onSettingsChange(preset.values)}
              >
                {preset.name}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Contrôles de marge de page */}
        <div className="space-y-3">
          <div className="flex items-center">
            <Maximize2 className="w-4 h-4 mr-2 text-muted-foreground" />
            <Label className="text-sm font-medium">Marge de page</Label>
            <span className="ml-auto text-xs text-muted-foreground">{settings.pageMargin}px</span>
          </div>
          <Slider
            value={[settings.pageMargin]}
            onValueChange={([value]) => updateSetting('pageMargin', value)}
            min={8}
            max={64}
            step={4}
            className="w-full"
          />
        </div>

        {/* Espacement entre sections */}
        <div className="space-y-3">
          <div className="flex items-center">
            <Move className="w-4 h-4 mr-2 text-muted-foreground" />
            <Label className="text-sm font-medium">Espacement sections</Label>
            <span className="ml-auto text-xs text-muted-foreground">{settings.sectionSpacing}px</span>
          </div>
          <Slider
            value={[settings.sectionSpacing]}
            onValueChange={([value]) => updateSetting('sectionSpacing', value)}
            min={8}
            max={48}
            step={4}
            className="w-full"
          />
        </div>

        {/* Espacement entre éléments */}
        <div className="space-y-3">
          <div className="flex items-center">
            <Minimize2 className="w-4 h-4 mr-2 text-muted-foreground" />
            <Label className="text-sm font-medium">Espacement éléments</Label>
            <span className="ml-auto text-xs text-muted-foreground">{settings.itemSpacing}px</span>
          </div>
          <Slider
            value={[settings.itemSpacing]}
            onValueChange={([value]) => updateSetting('itemSpacing', value)}
            min={4}
            max={32}
            step={2}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Padding des en-têtes */}
        <div className="space-y-3">
          <div className="flex items-center">
            <AlignCenter className="w-4 h-4 mr-2 text-muted-foreground" />
            <Label className="text-sm font-medium">Padding en-têtes</Label>
            <span className="ml-auto text-xs text-muted-foreground">{settings.headerPadding}px</span>
          </div>
          <Slider
            value={[settings.headerPadding]}
            onValueChange={([value]) => updateSetting('headerPadding', value)}
            min={8}
            max={32}
            step={2}
            className="w-full"
          />
        </div>

        {/* Padding du contenu */}
        <div className="space-y-3">
          <div className="flex items-center">
            <AlignLeft className="w-4 h-4 mr-2 text-muted-foreground" />
            <Label className="text-sm font-medium">Padding contenu</Label>
            <span className="ml-auto text-xs text-muted-foreground">{settings.contentPadding}px</span>
          </div>
          <Slider
            value={[settings.contentPadding]}
            onValueChange={([value]) => updateSetting('contentPadding', value)}
            min={8}
            max={32}
            step={2}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Hauteur de ligne */}
        <div className="space-y-3">
          <div className="flex items-center">
            <AlignLeft className="w-4 h-4 mr-2 text-muted-foreground" />
            <Label className="text-sm font-medium">Hauteur de ligne</Label>
            <span className="ml-auto text-xs text-muted-foreground">{settings.lineHeight.toFixed(1)}</span>
          </div>
          <Slider
            value={[settings.lineHeight * 10]}
            onValueChange={([value]) => updateSetting('lineHeight', value / 10)}
            min={12}
            max={25}
            step={1}
            className="w-full"
          />
        </div>

        {/* Taille de police */}
        <div className="space-y-3">
          <div className="flex items-center">
            <AlignRight className="w-4 h-4 mr-2 text-muted-foreground" />
            <Label className="text-sm font-medium">Taille de police</Label>
            <span className="ml-auto text-xs text-muted-foreground">{settings.fontSize}px</span>
          </div>
          <Slider
            value={[settings.fontSize]}
            onValueChange={([value]) => updateSetting('fontSize', value)}
            min={10}
            max={18}
            step={1}
            className="w-full"
          />
        </div>

        {/* Rayon de bordure */}
        <div className="space-y-3">
          <div className="flex items-center">
            <Minimize2 className="w-4 h-4 mr-2 text-muted-foreground" />
            <Label className="text-sm font-medium">Rayon bordures</Label>
            <span className="ml-auto text-xs text-muted-foreground">{settings.borderRadius}px</span>
          </div>
          <Slider
            value={[settings.borderRadius]}
            onValueChange={([value]) => updateSetting('borderRadius', value)}
            min={0}
            max={16}
            step={2}
            className="w-full"
          />
        </div>

        {/* Aperçu des paramètres */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <Label className="text-xs font-medium text-muted-foreground">Aperçu des paramètres</Label>
          <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
            <div>Page: {settings.pageMargin}px</div>
            <div>Sections: {settings.sectionSpacing}px</div>
            <div>Éléments: {settings.itemSpacing}px</div>
            <div>Police: {settings.fontSize}px</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpacingControls;