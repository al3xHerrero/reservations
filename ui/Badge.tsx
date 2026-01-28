'use client';

import React from 'react';

// Design tokens from Figma
const TOKENS = {
  success: '#24a865',
  warning: '#df7b00',
  danger: '#eb0052',
  neutral: '#536b75',
  white: '#ffffff',
  captionSize: '12px',
  captionLineHeight: '16px',
  weightSemibold: '600',
  fontFamily: 'Montserrat, sans-serif',
};

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'info';
type BadgeStyle = 'filled' | 'outlined' | 'dot';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  badgeStyle?: BadgeStyle;
  className?: string;
}

// Check icon for success
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M4 6L5.5 7.5L8 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Clock icon for pending/warning
const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6 3.5V6L7.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function Badge({ children, variant = 'neutral', badgeStyle = 'dot', className = '' }: BadgeProps) {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'success':
        return 'rgba(36, 168, 101, 0.12)';
      case 'warning':
        return 'rgba(223, 123, 0, 0.12)';
      case 'danger':
        return 'rgba(235, 0, 82, 0.12)';
      case 'info':
        return 'rgba(0, 121, 202, 0.12)';
      default:
        return 'rgba(83, 107, 117, 0.12)';
    }
  };

  const getForegroundColor = () => {
    switch (variant) {
      case 'success':
        return TOKENS.success;
      case 'warning':
        return TOKENS.warning;
      case 'danger':
        return TOKENS.danger;
      case 'info':
        return '#0079ca';
      default:
        return TOKENS.neutral;
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckIcon />;
      case 'warning':
      case 'danger':
        return <ClockIcon />;
      default:
        return null;
    }
  };

  if (badgeStyle === 'dot') {
    return (
      <span
        className={`inline-flex items-center gap-1 ${className}`}
        style={{
          padding: '4px 8px',
          borderRadius: '9999px',
          backgroundColor: getBackgroundColor(),
          color: getForegroundColor(),
          fontSize: TOKENS.captionSize,
          lineHeight: TOKENS.captionLineHeight,
          fontWeight: TOKENS.weightSemibold,
          fontFamily: TOKENS.fontFamily,
        }}
      >
        {getIcon()}
        {children}
      </span>
    );
  }

  if (badgeStyle === 'filled') {
    return (
      <span
        className={`inline-flex items-center gap-1 ${className}`}
        style={{
          padding: '4px 8px',
          borderRadius: '9999px',
          backgroundColor: getForegroundColor(),
          color: TOKENS.white,
          fontSize: TOKENS.captionSize,
          lineHeight: TOKENS.captionLineHeight,
          fontWeight: TOKENS.weightSemibold,
          fontFamily: TOKENS.fontFamily,
        }}
      >
        {getIcon()}
        {children}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 ${className}`}
      style={{
        padding: '4px 8px',
        borderRadius: '9999px',
        backgroundColor: 'transparent',
        color: getForegroundColor(),
        border: `1px solid ${getForegroundColor()}`,
        fontSize: TOKENS.captionSize,
        lineHeight: TOKENS.captionLineHeight,
        fontWeight: TOKENS.weightSemibold,
        fontFamily: TOKENS.fontFamily,
      }}
    >
      {children}
    </span>
  );
}
