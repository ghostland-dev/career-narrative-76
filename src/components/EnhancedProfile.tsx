import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Settings, 
  Shield, 
  Camera, 
  Save,
  Upload,
  Trash2,
  Edit,
  CheckCircle,
  AlertCircle,
  Star,
  Award,
  TrendingUp,
  Download,
  Eye,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AnimatedStats, { CVStats } from "./AnimatedStats";

interface Profile {
  full_name: string;
  email: string;
  phone: string;
  company: string;
  avatar_url: string;
  job_title?: string;
  location?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

interface EnhancedProfileProps {
  profile: Profile;
  onProfileUpdate: (profile: Profile) => void;
  user: any;
}

const EnhancedProfile: React.FC<EnhancedProfileProps> = ({
  profile,
  onProfileUpdate,
  user
}) => {
  const { toast } = useToast();
  const [localProfile, setLocalProfile] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [completionScore, setCompletionScore] = useState(0);

  useEffect(() => {
    calculateCompletionScore();
  }, [localProfile]);

  const calculateCompletionScore = () => {
    const fields = [
      localProfile.full_name,
      localProfile.email,
      localProfile.phone,
      localProfile.company,
      localProfile.job_title,
      localProfile.location,
      localProfile.bio,
      localProfile.avatar_url
    ];
    
    const completed = fields.filter(field => field && field.trim() !== '').length;
    const percentage = Math.round((completed / fields.length) * 100);
    setCompletionScore(percentage);
  };

  const handleSave = () => {
    onProfileUpdate(localProfile);
    setIsEditing(false);
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été sauvegardées avec succès.",
      duration: 3000,
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getCompletionBadge = () => {
    if (completionScore >= 90) return { variant: "default" as const, text: "Profil Expert", color: "text-green-600" };
    if (completionScore >= 70) return { variant: "secondary" as const, text: "Profil Avancé", color: "text-blue-600" };
    if (completionScore >= 50) return { variant: "outline" as const, text: "Profil Intermédiaire", color: "text-yellow-600" };
    return { variant: "destructive" as const, text: "Profil Basique", color: "text-red-600" };
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-0 shadow-elegant bg-gradient-to-br from-card to-primary/5">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar Section */}
            <div className="relative group">
              <Avatar className="w-32 h-32 ring-4 ring-background shadow-xl">
                <AvatarImage src={localProfile.avatar_url} className="object-cover" />
                <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-primary-glow text-white">
                  {localProfile.full_name ? getInitials(localProfile.full_name) : "U"}
                </AvatarFallback>
              </Avatar>
              
              <Button
                size="sm"
                className="absolute bottom-2 right-2 rounded-full w-10 h-10 p-0 shadow-lg bg-white text-primary hover:bg-gray-50"
                onClick={() => {
                  // TODO: Implement photo upload
                  toast({
                    title: "Fonctionnalité en cours",
                    description: "L'upload de photo sera bientôt disponible.",
                  });
                }}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {localProfile.full_name || "Nom non renseigné"}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {localProfile.job_title || "Poste non spécifié"}
                </p>
                <p className="text-muted-foreground flex items-center mt-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  {localProfile.location || "Localisation non spécifiée"}
                </p>
              </div>

              {/* Completion Score */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Complétude du profil</Label>
                  <Badge {...getCompletionBadge()}>{getCompletionBadge().text}</Badge>
                </div>
                <Progress value={completionScore} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {completionScore}% complété • {100 - completionScore}% restant pour optimiser votre profil
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={isEditing ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="animate-fade-in"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? "Mode lecture" : "Modifier le profil"}
                </Button>
                
                {isEditing && (
                  <Button size="sm" onClick={handleSave} className="animate-scale-in">
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Stats */}
      <AnimatedStats stats={CVStats} />

      {/* Profile Details Tabs */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Personnel
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Compte
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Sécurité
          </TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal" className="space-y-6">
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nom complet *</Label>
                  <Input
                    id="fullName"
                    value={localProfile.full_name}
                    onChange={(e) => setLocalProfile(prev => ({
                      ...prev,
                      full_name: e.target.value
                    }))}
                    placeholder="Jean Dupont"
                    disabled={!isEditing}
                    className={isEditing ? "border-primary/50" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Poste actuel</Label>
                  <Input
                    id="jobTitle"
                    value={localProfile.job_title || ""}
                    onChange={(e) => setLocalProfile(prev => ({
                      ...prev,
                      job_title: e.target.value
                    }))}
                    placeholder="Développeur Frontend Senior"
                    disabled={!isEditing}
                    className={isEditing ? "border-primary/50" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={localProfile.email}
                      onChange={(e) => setLocalProfile(prev => ({
                        ...prev,
                        email: e.target.value
                      }))}
                      placeholder="jean.dupont@email.com"
                      disabled={!isEditing}
                      className={`pl-10 ${isEditing ? "border-primary/50" : ""}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={localProfile.phone}
                      onChange={(e) => setLocalProfile(prev => ({
                        ...prev,
                        phone: e.target.value
                      }))}
                      placeholder="+33 1 23 45 67 89"
                      disabled={!isEditing}
                      className={`pl-10 ${isEditing ? "border-primary/50" : ""}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Localisation</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={localProfile.location || ""}
                      onChange={(e) => setLocalProfile(prev => ({
                        ...prev,
                        location: e.target.value
                      }))}
                      placeholder="Paris, France"
                      disabled={!isEditing}
                      className={`pl-10 ${isEditing ? "border-primary/50" : ""}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Entreprise</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company"
                      value={localProfile.company}
                      onChange={(e) => setLocalProfile(prev => ({
                        ...prev,
                        company: e.target.value
                      }))}
                      placeholder="Nom de l'entreprise"
                      disabled={!isEditing}
                      className={`pl-10 ${isEditing ? "border-primary/50" : ""}`}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Information */}
        <TabsContent value="account" className="space-y-6">
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle>Informations du compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Membre depuis</p>
                      <p className="text-sm text-muted-foreground">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : "Non disponible"}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {user?.created_at ? Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0} jours
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-success" />
                    <div>
                      <p className="font-medium">Dernière connexion</p>
                      <p className="text-sm text-muted-foreground">
                        {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('fr-FR') : "Non disponible"}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    En ligne
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle>Paramètres de sécurité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <div>
                      <p className="font-medium">Email vérifié</p>
                      <p className="text-sm text-muted-foreground">Votre adresse email est confirmée</p>
                    </div>
                  </div>
                  <Badge variant="default">Vérifié</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">Mot de passe</p>
                      <p className="text-sm text-muted-foreground">Dernière modification il y a 30 jours</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedProfile;