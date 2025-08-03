import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Check, 
  X, 
  Sparkles, 
  Zap, 
  Users,
  Calendar,
  CreditCard
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LoadingScreen from '@/components/LoadingScreen';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  recommended?: boolean;
}

interface UserSubscription {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  stripe_customer_id: string | null;
}

const SubscriptionManager: React.FC = () => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Gratuit',
      price: 0,
      interval: 'month',
      features: [
        '3 CV maximum',
        'Templates de base',
        'Export PDF standard',
        'Support communautaire'
      ]
    },
    {
      id: 'pro',
      name: 'Professionnel',
      price: 9.99,
      interval: 'month',
      recommended: true,
      features: [
        'CV illimités',
        'Tous les templates premium',
        'Optimisation IA avancée',
        'Lettres de motivation IA',
        'Export PDF haute qualité',
        'Support prioritaire',
        'Analyse des mots-clés',
        'Statistiques détaillées'
      ]
    },
    {
      id: 'pro-yearly',
      name: 'Professionnel (Annuel)',
      price: 99.99,
      interval: 'year',
      features: [
        'Toutes les fonctionnalités Pro',
        '2 mois gratuits (économisez 20%)',
        'Accès anticipé aux nouvelles fonctionnalités',
        'Consultations CV personnalisées',
        'Intégrations avancées'
      ]
    }
  ];

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSubscription(data || {
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        stripe_customer_id: null
      });
    } catch (error) {
      console.error('Error loading subscription:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les informations d'abonnement.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    setIsProcessing(true);
    try {
      // In a real implementation, this would integrate with Stripe
      toast({
        title: "Redirection vers le paiement",
        description: "Vous allez être redirigé vers Stripe pour finaliser votre abonnement.",
      });
      
      // TODO: Implement Stripe integration
      console.log('Subscribe to plan:', planId);
    } catch (error) {
      console.error('Error subscribing:', error);
      toast({
        title: "Erreur d'abonnement",
        description: "Impossible de traiter votre abonnement. Réessayez plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsProcessing(true);
    try {
      // TODO: Implement subscription cancellation
      toast({
        title: "Annulation programmée",
        description: "Votre abonnement sera annulé à la fin de la période en cours.",
      });
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast({
        title: "Erreur d'annulation",
        description: "Impossible d'annuler votre abonnement. Contactez le support.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number, interval: string) => {
    if (price === 0) return 'Gratuit';
    return `${price}€/${interval === 'month' ? 'mois' : 'an'}`;
  };

  const isCurrentPlan = (planId: string) => {
    if (!subscription) return false;
    if (planId === 'free') return !subscription.subscribed;
    return subscription.subscription_tier === planId;
  };

  const isSubscriptionActive = () => {
    if (!subscription?.subscription_end) return false;
    return new Date(subscription.subscription_end) > new Date();
  };

  if (isLoading) {
    return <LoadingScreen message="Chargement des abonnements..." />;
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Choisissez votre plan</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Débloquez tout le potentiel de notre plateforme CV avec des fonctionnalités avancées 
          et un support prioritaire.
        </p>
      </div>

      {/* Current Subscription Status */}
      {subscription?.subscribed && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-primary" />
              <span>Abonnement actuel</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Plan {subscription.subscription_tier}</p>
                {subscription.subscription_end && (
                  <p className="text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Expire le {new Date(subscription.subscription_end).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
              <Button 
                variant="outline" 
                onClick={handleCancelSubscription}
                disabled={isProcessing}
              >
                Annuler l'abonnement
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${plan.recommended ? 'border-primary shadow-elegant' : ''}`}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Recommandé
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                {plan.id === 'free' && <Users className="w-5 h-5" />}
                {plan.id.includes('pro') && <Crown className="w-5 h-5 text-primary" />}
                <span>{plan.name}</span>
              </CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold">{formatPrice(plan.price, plan.interval)}</span>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-success flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full"
                variant={isCurrentPlan(plan.id) ? "outline" : "default"}
                disabled={isCurrentPlan(plan.id) || isProcessing}
                onClick={() => handleSubscribe(plan.id)}
              >
                {isCurrentPlan(plan.id) ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Plan actuel
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    {plan.price === 0 ? 'Sélectionner' : 'S\'abonner'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Questions fréquentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Puis-je annuler mon abonnement à tout moment ?</h4>
            <p className="text-sm text-muted-foreground">
              Oui, vous pouvez annuler votre abonnement à tout moment. Votre accès aux fonctionnalités 
              premium restera actif jusqu'à la fin de votre période de facturation.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Que se passe-t-il avec mes CV si j'annule ?</h4>
            <p className="text-sm text-muted-foreground">
              Vos CV existants restent accessibles, mais vous serez limité aux fonctionnalités 
              du plan gratuit pour les nouvelles créations.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Y a-t-il une période d'essai gratuite ?</h4>
            <p className="text-sm text-muted-foreground">
              Nous offrons un accès gratuit permanent avec des fonctionnalités de base. 
              Vous pouvez tester notre plateforme avant de vous abonner à un plan premium.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManager;