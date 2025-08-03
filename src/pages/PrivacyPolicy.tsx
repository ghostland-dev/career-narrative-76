import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Lock, 
  Eye, 
  FileText, 
  Download,
  Share2,
  Settings,
  Bell,
  Users,
  CreditCard,
  HelpCircle
} from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Politique de Confidentialité</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Collecte des Données</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Nous collectons les données suivantes :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Informations de compte (email, nom)</li>
              <li>Données de CV (expérience, formation, compétences)</li>
              <li>Données d'utilisation (analytics anonymes)</li>
              <li>Préférences utilisateur</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Protection des Données</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Vos données sont protégées par :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Chiffrement SSL/TLS pour toutes les communications</li>
              <li>Authentification sécurisée via Supabase</li>
              <li>Contrôles d'accès stricts (Row Level Security)</li>
              <li>Sauvegardes régulières et sécurisées</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Share2 className="h-5 w-5" />
              <span>Partage des Données</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Nous ne partageons vos données qu'avec :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Votre consentement explicite</li>
              <li>Services essentiels (hébergement sécurisé)</li>
              <li>Obligations légales uniquement</li>
            </ul>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-green-800 font-medium">
                🔒 Nous ne vendons jamais vos données personnelles
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Vos Droits</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Conformément au RGPD, vous avez le droit de :</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Accéder à vos données
                </Badge>
                <Badge variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter vos données
                </Badge>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Modifier vos données
                </Badge>
                <Badge variant="outline" className="w-full justify-start">
                  <Lock className="h-4 w-4 mr-2" />
                  Supprimer votre compte
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5" />
              <span>Contact</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Pour toute question concernant cette politique :</p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="font-medium">Email : privacy@cvcraft.com</p>
              <p className="text-sm text-muted-foreground">
                Nous répondons dans les 48h
              </p>
            </div>
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

export default PrivacyPolicy;