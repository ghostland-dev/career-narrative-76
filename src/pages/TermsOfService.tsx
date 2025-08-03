import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Users, 
  Shield, 
  CreditCard,
  Download,
  Share2,
  Settings,
  AlertTriangle
} from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Conditions d'Utilisation</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Utilisation du Service</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>En utilisant CVCraft, vous acceptez de :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Fournir des informations exactes et à jour</li>
              <li>Utiliser le service conformément aux lois applicables</li>
              <li>Ne pas porter atteinte aux droits d'autrui</li>
              <li>Respecter les autres utilisateurs</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Propriété Intellectuelle</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-800 font-medium mb-2">📄 Vos CV vous appartiennent</p>
              <p className="text-blue-700 text-sm">
                Vous conservez tous les droits sur le contenu de vos CV
              </p>
            </div>
            <p>CVCraft reste propriétaire de :</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>La plateforme et ses fonctionnalités</li>
              <li>Les templates et designs</li>
              <li>Le code source et algorithmes</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Facturation et Paiements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Abonnements</h4>
                <ul className="text-sm space-y-1">
                  <li>• Facturation mensuelle ou annuelle</li>
                  <li>• Renouvellement automatique</li>
                  <li>• Annulation possible à tout moment</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Remboursements</h4>
                <ul className="text-sm space-y-1">
                  <li>• 14 jours de garantie satisfaction</li>
                  <li>• Remboursement partiel au prorata</li>
                  <li>• Traitement sous 5-7 jours</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Limitation de Responsabilité</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-amber-800 font-medium mb-2">⚠️ Important</p>
              <p className="text-amber-700 text-sm">
                CVCraft fournit un service "en l'état". Nous ne garantissons pas l'obtention d'un emploi.
              </p>
            </div>
            <p>Notre responsabilité est limitée aux montants payés pour le service.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Modifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Nous nous réservons le droit de modifier ces conditions à tout moment. 
              Les utilisateurs seront notifiés des changements importants par email.
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-12" />

      <div className="text-center">
        <Button variant="outline" onClick={() => window.history.back()}>
          Retour
        </Button>
      </div>
    </div>
  );
};

export default TermsOfService;