import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  Award, 
  Download,
  Eye,
  Heart,
  Star,
  Zap
} from "lucide-react";

interface StatItem {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  gradient: string;
  suffix?: string;
  prefix?: string;
}

interface AnimatedStatsProps {
  stats?: StatItem[];
  className?: string;
}

const defaultStats: StatItem[] = [
  {
    label: "CV créés",
    value: 1247,
    icon: TrendingUp,
    color: "text-blue-600",
    gradient: "from-blue-500 to-blue-600",
    suffix: "+"
  },
  {
    label: "Utilisateurs actifs",
    value: 892,
    icon: Users,
    color: "text-green-600", 
    gradient: "from-green-500 to-green-600"
  },
  {
    label: "Taux de réussite",
    value: 94,
    icon: Award,
    color: "text-purple-600",
    gradient: "from-purple-500 to-purple-600",
    suffix: "%"
  },
  {
    label: "Téléchargements",
    value: 3621,
    icon: Download,
    color: "text-orange-600",
    gradient: "from-orange-500 to-orange-600"
  }
];

const AnimatedStats: React.FC<AnimatedStatsProps> = ({ 
  stats = defaultStats,
  className = ""
}) => {
  const [animatedValues, setAnimatedValues] = useState<number[]>(
    stats.map(() => 0)
  );
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60; // 60 FPS
    const stepDuration = duration / steps;

    stats.forEach((stat, index) => {
      let currentStep = 0;
      
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        // Easing function (ease-out cubic)
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(stat.value * easedProgress);
        
        setAnimatedValues(prev => {
          const newValues = [...prev];
          newValues[index] = currentValue;
          return newValues;
        });

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);
    });
  }, [isVisible, stats]);

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        
        return (
          <Card 
            key={index}
            className={`group relative overflow-hidden border-0 shadow-card hover:shadow-elegant transition-all duration-500 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{
              transitionDelay: `${index * 100}ms`
            }}
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
            
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                
                {/* Animated pulse indicator */}
                <div className="relative">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${stat.gradient} animate-pulse`} />
                  <div className={`absolute inset-0 w-3 h-3 rounded-full bg-gradient-to-r ${stat.gradient} animate-ping opacity-30`} />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className={`text-3xl font-bold ${stat.color} group-hover:scale-105 transition-transform duration-300 font-mono`}>
                  {stat.prefix || ""}{animatedValues[index].toLocaleString()}{stat.suffix || ""}
                </div>
                
                <p className="text-sm text-muted-foreground font-medium group-hover:text-foreground transition-colors duration-300">
                  {stat.label}
                </p>
                
                {/* Progress bar */}
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000 ease-out`}
                    style={{
                      width: isVisible ? '100%' : '0%',
                      transitionDelay: `${index * 100 + 500}ms`
                    }}
                  />
                </div>
              </div>
            </CardContent>
            
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700" />
          </Card>
        );
      })}
    </div>
  );
};

// Preset configurations for different use cases
export const CVStats: StatItem[] = [
  {
    label: "CV créés ce mois",
    value: 156,
    icon: TrendingUp,
    color: "text-primary",
    gradient: "from-primary to-primary-glow"
  },
  {
    label: "Vues de profil",
    value: 2847,
    icon: Eye,
    color: "text-blue-600",
    gradient: "from-blue-500 to-blue-600"
  },
  {
    label: "Taux de succès",
    value: 87,
    icon: Heart,
    color: "text-red-600", 
    gradient: "from-red-500 to-red-600",
    suffix: "%"
  },
  {
    label: "Candidatures",
    value: 23,
    icon: Star,
    color: "text-yellow-600",
    gradient: "from-yellow-500 to-yellow-600"
  }
];

export const PlatformStats: StatItem[] = [
  {
    label: "Utilisateurs",
    value: 12420,
    icon: Users,
    color: "text-green-600",
    gradient: "from-green-500 to-green-600",
    prefix: "+"
  },
  {
    label: "CV générés",
    value: 45780,
    icon: Award,
    color: "text-purple-600",
    gradient: "from-purple-500 to-purple-600"
  },
  {
    label: "Téléchargements",
    value: 98450,
    icon: Download,
    color: "text-orange-600",
    gradient: "from-orange-500 to-orange-600"
  },
  {
    label: "Satisfaction",
    value: 98,
    icon: Zap,
    color: "text-pink-600",
    gradient: "from-pink-500 to-pink-600",
    suffix: "%"
  }
];

export default AnimatedStats;