"use client";

import * as React from "react";

interface LogoIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function LogoIcon({ className, ...props }: LogoIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="100%"
      height="100%"
      fill="none"
      className={className}
      {...props}
    >
      {/* Coding Brackets: Blue / Cyan Color Accents */}
      <path
        d="M 32,38 L 20,50 L 32,62"
        stroke="#2563EB"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 68,38 L 80,50 L 68,62"
        stroke="#06B6D4"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Binary Algorithm Connections */}
      <line x1="50" y1="36" x2="38" y2="58" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <line x1="50" y1="36" x2="62" y2="58" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />

      {/* Joint Small Pins */}
      <circle cx="50" cy="48" r="3" fill="#FFFFFF" />

      {/* Nodes circles */}
      <circle cx="50" cy="30" r="10" fill="#2563EB" />
      <circle cx="36" cy="62" r="10" fill="#8B5CF6" />
      <circle cx="64" cy="62" r="10" fill="#8B5CF6" />
    </svg>
  );
}
