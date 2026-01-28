'use client';

import React from 'react';

// Design tokens from Figma
const TOKENS = {
  bgContrast: '#06232c',
  textWhite: '#ffffff',
  borderContrast: '#536b75',
  buttonRadii: '64px',
  fontFamily: 'Montserrat, sans-serif',
  baseSize: '16px',
  smallSize: '14px',
  weightRegular: '400',
  weightSemibold: '600',
};

interface TopBarProps {
  userName?: string;
  onCreateEvent?: () => void;
}

export function TopBar({ userName = 'SO Test', onCreateEvent }: TopBarProps) {
  return (
    <header
      className="flex h-14 items-center justify-end gap-4 px-6"
      style={{
        backgroundColor: TOKENS.bgContrast,
        fontFamily: TOKENS.fontFamily,
      }}
    >
      <button
        onClick={onCreateEvent}
        style={{
          padding: '8px 16px',
          borderRadius: TOKENS.buttonRadii,
          border: `1px solid ${TOKENS.textWhite}`,
          backgroundColor: 'transparent',
          fontSize: TOKENS.smallSize,
          fontWeight: TOKENS.weightSemibold,
          color: TOKENS.textWhite,
          fontFamily: TOKENS.fontFamily,
          cursor: 'pointer',
        }}
      >
        Crear evento
      </button>
      <div className="flex items-center gap-3">
        <span style={{ fontSize: TOKENS.smallSize, color: TOKENS.textWhite }}>
          {userName}
        </span>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{ border: `1px solid ${TOKENS.borderContrast}` }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10" cy="7" r="3" stroke="white" strokeWidth="1.5" />
            <path
              d="M4 17C4 14.2386 6.68629 12 10 12C13.3137 12 16 14.2386 16 17"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </header>
  );
}
