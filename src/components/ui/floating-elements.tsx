import React from 'react';

export const FloatingShapes = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Large floating circle */}
      <div
        className="absolute w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-float-slow"
        style={{
          top: '10%',
          right: '-10%',
          animationDelay: '0s'
        }}
      />
      
      {/* Medium floating circle */}
      <div
        className="absolute w-64 h-64 bg-gradient-to-br from-accent/15 to-transparent rounded-full blur-2xl animate-float-medium"
        style={{
          bottom: '20%',
          left: '-5%',
          animationDelay: '2s'
        }}
      />
      
      {/* Small floating circle */}
      <div
        className="absolute w-32 h-32 bg-gradient-to-br from-success/20 to-transparent rounded-full blur-xl animate-float-fast"
        style={{
          top: '60%',
          right: '20%',
          animationDelay: '4s'
        }}
      />
      
      {/* Floating dots */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-primary/30 rounded-full animate-pulse-slow"
          style={{
            left: `${15 + i * 12}%`,
            top: `${25 + (i % 3) * 20}%`,
            animationDelay: `${i * 0.5}s`
          }}
        />
      ))}
    </div>
  );
};

export const GradientBlur = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/5" />
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/10 to-transparent blur-3xl opacity-60" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-t from-accent/10 to-transparent blur-3xl opacity-60" />
    </div>
  );
};
