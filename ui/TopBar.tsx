'use client';

import React from 'react';

export const TOPBAR_HEIGHT = 64;

const TOKENS = {
  background: '#06232c',
  border: '1px solid #536b75',
  fontFamily: 'var(--font-body)',
  textColor: '#ffffff',
  padding: '0 24px',
};

const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="14" height="2" rx="1" fill="#ffffff" />
    <rect x="2" y="8" width="14" height="2" rx="1" fill="#ffffff" />
    <rect x="2" y="12" width="14" height="2" rx="1" fill="#ffffff" />
  </svg>
);

const Logo = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'flex-end',
      gap: 3,
      color: '#ffffff',
      fontFamily: 'var(--font-body)',
    }}
  >
    <span
      style={{
        fontSize: 28,
        fontWeight: 700,
        letterSpacing: -0.5,
      }}
    >
      fever
    </span>
    <span
      style={{
        fontSize: 9,
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontWeight: 400,
        alignSelf: 'flex-start',
        marginTop: 4,
      }}
    >
      zone
    </span>
  </div>
);

const Avatar = () => (
  <span
    style={{
      width: 36,
      height: 36,
      borderRadius: '50%',
      border: '1px solid #536b75',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="3" stroke="#ffffff" strokeWidth="1.5" />
      <path
        d="M4 17C4 14.2386 6.68629 12 10 12C13.3137 12 16 14.2386 16 17"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  </span>
);

interface TopBarProps {
  userName?: string;
  onMenuToggle?: () => void;
}

export function TopBar({ userName = 'SO Test', onMenuToggle }: TopBarProps) {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: `${TOPBAR_HEIGHT}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: TOKENS.background,
        borderBottom: TOKENS.border,
        fontFamily: TOKENS.fontFamily,
        padding: TOKENS.padding,
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          aria-label="Open menu"
          onClick={onMenuToggle}
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            border: 'none',
            background: 'transparent',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MenuIcon />
        </button>
        <Logo />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: TOKENS.textColor, fontSize: 16 }}>{userName}</span>
        <Avatar />
      </div>
    </header>
  );
}
