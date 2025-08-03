import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Mail, 
  MessageSquare, 
  Phone, 
  MapPin, 
  Send,
  Clock,
  CheckCircle,
  HelpCircle,
  FileText,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Support = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message envoyé",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
      setContactForm({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  const faqItems = [
    {
      question: "Comment créer mon premier CV ?",
      answer: "Cliquez sur 'Nouveau CV' dans votre dashboard, choisissez un template et suivez les étapes guidées pour remplir vos informations."
    },
    {
      question: "Puis-je modifier un template ?",
      answer: "Oui, tous nos templates sont entièrement personnalisables. Vous pouvez modifier les couleurs, polices et mise en page."
    },
    {
      question: "Comment exporter mon CV en PDF ?",
      answer: "Dans l'éditeur ou l'aperçu de votre CV, cliquez sur 'Télécharger PDF' pour générer une version haute qualité."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Absolument. Toutes vos données sont chiffrées et stockées de manière sécurisée. Nous ne partageons jamais vos informations."
    },
    {
      question: "Puis-je partager mon CV en ligne ?",
      answer: "Oui, chaque CV dispose d'un lien de partage unique que vous pouvez envoyer aux recruteurs."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Support & Aide</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Comment pouvons-nous vous aider ?</h1>
            <p className="text-muted-foreground text-lg">
              Notre équipe est là pour répondre à toutes vos questions sur CVCraft
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-card hover:shadow-elegant transition-smooth cursor-pointer">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Guide de démarrage</CardTitle>
                <CardDescription>
                  Apprenez les bases pour créer votre premier CV
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-card hover:shadow-elegant transition-smooth cursor-pointer">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Chat en direct</CardTitle>
                <CardDescription>
                  Parlez directement avec notre équipe support
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-card hover:shadow-elegant transition-smooth cursor-pointer">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-secondary/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ExternalLink className="w-6 h-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-lg">Documentation</CardTitle>
                <CardDescription>
                  Consultez notre base de connaissances complète
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle>Questions Fréquentes</CardTitle>
              <CardDescription>
                Trouvez rapidement des réponses aux questions les plus courantes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-semibold text-foreground flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2 text-primary" />
                    {item.question}
                  </h3>
                  <p className="text-muted-foreground pl-6">
                    {item.answer}
                  </p>
                  {index < faqItems.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Contactez-nous</CardTitle>
                <CardDescription>
                  Vous ne trouvez pas de réponse ? Envoyez-nous un message
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom</Label>
                      <Input
                        id="name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({
                          ...prev,
                          name: e.target.value
                        }))}
                        placeholder="Votre nom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({
                          ...prev,
                          email: e.target.value
                        }))}
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <Input
                      id="subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm(prev => ({
                        ...prev,
                        subject: e.target.value
                      }))}
                      placeholder="De quoi s'agit-il ?"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({
                        ...prev,
                        message: e.target.value
                      }))}
                      placeholder="Décrivez votre question ou problème..."
                      rows={5}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Autres moyens de contact</CardTitle>
                  <CardDescription>
                    Vous préférez nous contacter autrement ?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">support@cvcraft.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Téléphone</p>
                      <p className="text-sm text-muted-foreground">+33 1 23 45 67 89</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Horaires</p>
                      <p className="text-sm text-muted-foreground">Lun-Ven 9h-18h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Temps de réponse</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email</span>
                    <Badge variant="secondary">24h</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Chat en direct</span>
                    <Badge variant="default">Immédiat</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Téléphone</span>
                    <Badge variant="secondary">Immédiat</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Support;