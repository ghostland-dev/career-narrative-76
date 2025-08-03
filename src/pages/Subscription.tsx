import React from 'react';
import AppLayout from '@/components/AppLayout';
import SubscriptionManager from '@/components/subscription/SubscriptionManager';
import SEOHead from '@/components/seo/SEOHead';

const Subscription: React.FC = () => {
  return (
    <>
      <SEOHead 
        title="Abonnements et tarifs - CV Builder Pro"
        description="Découvrez nos plans d'abonnement et débloquez toutes les fonctionnalités premium pour créer des CV professionnels exceptionnels."
        keywords="abonnement cv, plan premium, tarifs cv builder, fonctionnalités premium"
      />
      <AppLayout
        title="Abonnements"
        subtitle="Choisissez le plan qui vous convient"
        showBackButton={true}
        backTo="/dashboard"
      >
        <SubscriptionManager />
      </AppLayout>
    </>
  );
};

export default Subscription;