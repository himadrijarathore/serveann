'use client';

import React from 'react';

export default function PaisleyBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Top Left Mandala/Paisley Element */}
      <div className="absolute -top-32 -left-32 w-96 h-96 opacity-[0.07] text-[var(--color-primary)]">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
          <path d="M100 0 C120 40, 160 80, 200 100 C160 120, 120 160, 100 200 C80 160, 40 120, 0 100 C40 80, 80 40, 100 0 Z" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="5,5" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,8" />
          <path d="M100 20 Q120 60 100 100 Q80 60 100 20" fill="currentColor" opacity="0.5"/>
          <path d="M100 180 Q120 140 100 100 Q80 140 100 180" fill="currentColor" opacity="0.5"/>
          <path d="M20 100 Q60 80 100 100 Q60 120 20 100" fill="currentColor" opacity="0.5"/>
          <path d="M180 100 Q140 80 100 100 Q140 120 180 100" fill="currentColor" opacity="0.5"/>
        </svg>
      </div>

      {/* Bottom Right Mandala/Rangoli Element */}
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] opacity-[0.05] text-[var(--color-secondary)]">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="6" />
          <circle cx="100" cy="100" r="75" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4,4" />
          <path d="M100 10 L115 85 L190 100 L115 115 L100 190 L85 115 L10 100 L85 85 Z" fill="currentColor" />
          <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="3" />
          <circle cx="100" cy="100" r="15" fill="currentColor" />
        </svg>
      </div>

      {/* Center Subtle Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 C35 15, 45 25, 55 30 C45 35, 35 45, 30 55 C25 45, 15 35, 5 30 C15 25, 25 15, 30 5 Z' fill='%23D4AF37' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px',
          backgroundPosition: 'center'
        }}
      ></div>
    </div>
  );
}
