import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Edit3, 
  Download, 
  Trash2, 
  MoreVertical,
  Copy,
  Share2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import ConfirmDialog from './ConfirmDialog';

interface CVCardProps {
  cv: {
    id: string;
    title: string;
    updated_at: string;
    template_id: string;
    is_published: boolean;
  };
  onDelete: (id: string, title: string) => Promise<void>;
  onDuplicate?: (id: string) => Promise<void>;
  templateName?: string;
}

const CVCard: React.FC<CVCardProps> = ({ 
  cv, 
  onDelete, 
  onDuplicate,
  templateName = cv.template_id 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusColor = (isPublished: boolean) => {
    return isPublished
      ? "bg-success text-success-foreground"
      : "bg-muted text-muted-foreground";
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(cv.id, cv.title);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting CV:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async () => {
    if (onDuplicate) {
      try {
        await onDuplicate(cv.id);
        toast({
          title: "CV dupliqué",
          description: "Une copie de votre CV a été créée.",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de dupliquer le CV.",
          variant: "destructive",
        });
      }
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/cv-preview/${cv.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Lien copié",
      description: "Le lien de partage a été copié dans le presse-papiers.",
    });
  };

  return (
    <>
      <Card className="border-0 shadow-card hover:shadow-elegant transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold truncate">{cv.title}</h3>
                <Badge className={getStatusColor(cv.is_published)}>
                  {cv.is_published ? "Publié" : "Brouillon"}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground space-x-4">
                <span>Modifié le {new Date(cv.updated_at).toLocaleDateString('fr-FR')}</span>
                <span>•</span>
                <span>Template: {templateName}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate(`/cv-preview/${cv.id}`)}
                className="hover:bg-primary hover:text-primary-foreground"
              >
                <Eye className="w-4 h-4 mr-2" />
                Aperçu
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate(`/cv-builder/${cv.id}`)}
                className="hover:bg-accent hover:text-accent-foreground"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Modifier
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Partager
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger PDF
                  </DropdownMenuItem>
                  {onDuplicate && (
                    <DropdownMenuItem onClick={handleDuplicate}>
                      <Copy className="w-4 h-4 mr-2" />
                      Dupliquer
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Supprimer le CV"
        description={`Êtes-vous sûr de vouloir supprimer le CV "${cv.title}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </>
  );
};

export default CVCard;