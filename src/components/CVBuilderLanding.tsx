import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Sparkles, Download, Zap, Users, Globe, TrendingUp, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const CVBuilderLanding = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">CVCraft</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-smooth">Fonctionnalités</a>
            <a href="#templates" className="text-muted-foreground hover:text-foreground transition-smooth">Modèles</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-smooth">Tarifs</a>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={() => window.location.href = "/auth"}>Connexion</Button>
            <Button variant="hero" size="sm" onClick={() => window.location.href = "/auth"}>Essayer gratuitement</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="mb-4">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Optimisé par l'IA
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Créez un CV qui 
                  <span className="bg-hero-gradient bg-clip-text text-transparent"> vous démarque</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Transformez votre parcours professionnel en histoire captivante. 
                  CVCraft vous aide à créer des CV modernes, optimisés ATS et parfaitement adaptés à votre secteur.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" className="text-lg px-8">
                  <Zap className="w-5 h-5 mr-2" />
                  Créer mon CV
                </Button>
                <Button variant="glass" size="lg" className="text-lg px-8">
                  <FileText className="w-5 h-5 mr-2" />
                  Voir les exemples
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10k+</div>
                  <div className="text-sm text-muted-foreground">CV créés</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">95%</div>
                  <div className="text-sm text-muted-foreground">Taux de réussite</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">4.9/5</div>
                  <div className="text-sm text-muted-foreground">Note moyenne</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-hero-gradient rounded-3xl blur-3xl opacity-20"></div>
              <img 
                src={heroImage} 
                alt="Interface de création de CV moderne"
                className="relative rounded-3xl shadow-card border border-border/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Tout ce dont vous avez besoin pour réussir
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Des outils intelligents pour créer, optimiser et partager votre CV professionnel
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-card transition-smooth border-0 bg-card/60 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">IA Intégrée</h3>
                <p className="text-muted-foreground">
                  Suggestions intelligentes de contenu, optimisation ATS automatique et amélioration du ton professionnel.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-card transition-smooth border-0 bg-card/60 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Templates Modernes</h3>
                <p className="text-muted-foreground">
                  Plus de 50 modèles professionnels adaptés à chaque secteur et niveau d'expérience.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-card transition-smooth border-0 bg-card/60 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Download className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Export Flexible</h3>
                <p className="text-muted-foreground">
                  PDF haute qualité, liens partageables, et synchronisation avec LinkedIn en un clic.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-card transition-smooth border-0 bg-card/60 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Analyse de Performance</h3>
                <p className="text-muted-foreground">
                  Score de qualité en temps réel et recommandations personnalisées pour maximiser votre impact.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-card transition-smooth border-0 bg-card/60 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Multi-CV</h3>
                <p className="text-muted-foreground">
                  Créez plusieurs versions de votre CV adaptées à différents postes et entreprises.
                </p>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-card transition-smooth border-0 bg-card/60 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">CV Web</h3>
                <p className="text-muted-foreground">
                  Version en ligne de votre CV avec analytics des vues et partage facilité.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold">
              Prêt à transformer votre carrière ?
            </h2>
            <p className="text-xl text-muted-foreground">
              Rejoignez des milliers de professionnels qui ont déjà décroché leur emploi de rêve grâce à CVCraft
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="text-lg px-12">
                <Zap className="w-5 h-5 mr-2" />
                Commencer gratuitement
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-12">
                Découvrir les fonctionnalités
              </Button>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-success" />
                Essai gratuit de 14 jours
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-success" />
                Aucune carte de crédit requise
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-success" />
                Support client 24/7
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">CVCraft</span>
              </div>
              <p className="text-muted-foreground">
                L'outil de création de CV le plus intelligent pour les professionnels modernes.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Produit</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#" className="block hover:text-foreground transition-smooth">Fonctionnalités</a>
                <a href="#" className="block hover:text-foreground transition-smooth">Modèles</a>
                <a href="#" className="block hover:text-foreground transition-smooth">Tarifs</a>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#" className="block hover:text-foreground transition-smooth">Centre d'aide</a>
                <a href="#" className="block hover:text-foreground transition-smooth">Contact</a>
                <a href="#" className="block hover:text-foreground transition-smooth">Documentation</a>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Légal</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#" className="block hover:text-foreground transition-smooth">Confidentialité</a>
                <a href="#" className="block hover:text-foreground transition-smooth">Conditions</a>
                <a href="#" className="block hover:text-foreground transition-smooth">Cookies</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 CVCraft. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CVBuilderLanding;