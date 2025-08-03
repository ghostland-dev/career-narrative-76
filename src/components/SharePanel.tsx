import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { 
  Share2, 
  Copy, 
  ExternalLink, 
  Download, 
  Code, 
  Link2,
  QrCode,
  Mail,
  MessageSquare,
  Twitter,
  Linkedin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportToPDF } from "@/lib/pdf-export";

interface SharePanelProps {
  cvId: string;
  cvTitle: string;
}

const SharePanel: React.FC<SharePanelProps> = ({ cvId, cvTitle }) => {
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const { toast } = useToast();
  
  const baseUrl = window.location.origin;
  const publicUrl = `${baseUrl}/cv-public/${cvId}`;
  const embedUrl = `${baseUrl}/cv-embed/${cvId}`;
  
  const embedCode = `<iframe src="${embedUrl}" width="100%" height="800" frameborder="0" title="${cvTitle}"></iframe>`;

  const copyToClipboard = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copié !",
        description: message,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive",
      });
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`CV de ${cvTitle}`);
    const body = encodeURIComponent(`Voici mon CV : ${publicUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaLinkedIn = () => {
    const url = encodeURIComponent(publicUrl);
    const text = encodeURIComponent(`Découvrez mon CV professionnel`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank');
  };

  const shareViaTwitter = () => {
    const url = encodeURIComponent(publicUrl);
    const text = encodeURIComponent(`Découvrez mon CV professionnel`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF('cv-preview-content', `${cvTitle}.pdf`);
      toast({
        title: "Export réussi",
        description: "Votre CV a été exporté en PDF.",
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter le CV en PDF.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-0 shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Share2 className="h-5 w-5 mr-2 text-primary" />
          Partager votre CV
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Lien public */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center">
            <Link2 className="h-4 w-4 mr-2 text-primary" />
            Lien public
          </h4>
          <div className="flex items-center space-x-2">
            <Input
              value={publicUrl}
              readOnly
              className="flex-1 bg-muted/50 font-mono text-sm"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(publicUrl, "Lien public copié dans le presse-papiers")}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(publicUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Partagez ce lien pour que d'autres puissent voir votre CV en ligne
          </p>
        </div>

        <Separator />

        {/* Code d'intégration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center">
              <Code className="h-4 w-4 mr-2 text-primary" />
              Code d'intégration
            </h4>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowEmbedCode(!showEmbedCode)}
            >
              {showEmbedCode ? "Masquer" : "Afficher"}
            </Button>
          </div>
          
          {showEmbedCode && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Input
                  value={embedCode}
                  readOnly
                  className="flex-1 bg-muted/50 font-mono text-xs"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(embedCode, "Code d'intégration copié")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Intégrez ce code HTML dans votre site web ou portfolio
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Partage social */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center">
            <MessageSquare className="h-4 w-4 mr-2 text-primary" />
            Partage social
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={shareViaLinkedIn}
              className="flex items-center justify-center"
            >
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shareViaTwitter}
              className="flex items-center justify-center"
            >
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shareViaEmail}
              className="flex items-center justify-center"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              className="flex items-center justify-center"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        <Separator />

        {/* Statistiques et options */}
        <div className="space-y-3">
          <h4 className="font-medium">Options avancées</h4>
          <div className="grid grid-cols-2 gap-2">
            <Badge variant="outline" className="justify-center py-2">
              <QrCode className="h-3 w-3 mr-1" />
              QR Code bientôt
            </Badge>
            <Badge variant="outline" className="justify-center py-2">
              📊 Analytics bientôt
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SharePanel;