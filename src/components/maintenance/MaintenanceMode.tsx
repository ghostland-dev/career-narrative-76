import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, RefreshCw, Mail } from 'lucide-react';

interface MaintenanceModeProps {
  message?: string;
  estimatedTime?: string;
  contactEmail?: string;
}

const MaintenanceMode: React.FC<MaintenanceModeProps> = ({
  message = "Nous effectuons actuellement une maintenance planifiée pour améliorer votre expérience.",
  estimatedTime = "30 minutes",
  contactEmail = "support@cvbuilder.com"
}) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-8 h-8 text-primary" />
          </div>
          <CardTitle>Maintenance en cours</CardTitle>
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>Temps estimé : {estimatedTime}</p>
            <p>Nous serons de retour très bientôt !</p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
            <Button variant="outline" asChild>
              <a href={`mailto:${contactEmail}`}>
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </a>
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Merci pour votre patience
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceMode;