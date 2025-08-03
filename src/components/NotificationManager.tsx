import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, X, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}

interface NotificationManagerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({ 
  notifications, 
  onRemove 
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setVisibleNotifications(notifications);
    
    // Auto-remove non-persistent notifications
    notifications.forEach(notification => {
      if (!notification.persistent) {
        const duration = notification.duration || 5000;
        setTimeout(() => {
          onRemove(notification.id);
        }, duration);
      }
    });
  }, [notifications, onRemove]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const getStylesByType = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-success/20 bg-success/5';
      case 'error':
        return 'border-destructive/20 bg-destructive/5';
      case 'warning':
        return 'border-orange-500/20 bg-orange-500/5';
      case 'info':
        return 'border-primary/20 bg-primary/5';
    }
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {visibleNotifications.map((notification) => (
        <Card 
          key={notification.id}
          className={cn(
            "p-4 shadow-elegant border animate-slide-in-right",
            getStylesByType(notification.type)
          )}
        >
          <div className="flex items-start space-x-3">
            {getIcon(notification.type)}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm">{notification.title}</h4>
              {notification.message && (
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(notification.id)}
              className="h-6 w-6 p-0 hover:bg-background/80"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default NotificationManager;