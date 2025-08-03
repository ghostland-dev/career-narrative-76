import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  backTo?: string;
  actions?: ReactNode;
  className?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  title,
  subtitle,
  showBackButton = false,
  backTo = '/dashboard',
  actions,
  className
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isOnDashboard = location.pathname === '/dashboard';
  const isOnAuth = location.pathname === '/auth';

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Header */}
      {!isOnAuth && (
        <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {showBackButton && !isOnDashboard && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate(backTo)}
                  className="hover:bg-accent"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              )}
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">CVCraft</span>
              </div>
              {title && (
                <div className="hidden sm:block ml-4">
                  <h1 className="text-lg font-semibold">{title}</h1>
                  {subtitle && (
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                  )}
                </div>
              )}
            </div>
            
            {actions && (
              <div className="flex items-center space-x-3">
                {actions}
              </div>
            )}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;