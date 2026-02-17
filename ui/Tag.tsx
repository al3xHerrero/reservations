'use client';

import React from 'react';
import { IconCircleCheck as DSIconCircleCheck, IconCircleExclamation as DSIconCircleExclamation } from './Icons';

// Design tokens from Figma
const TOKENS = {
  dimensions: {
    height: '24px',
    paddingInline: '8px',
    paddingBlock: '4px',
    gap: '4px',
    borderRadius: '4px',
    minWidth: 'auto',
    iconSize: '12px',
    bulletWidth: '6px',
    bulletHeight: '6px',
  },
  typography: {
    size: '12px',
    lineHeight: '16px',
    weight: '400',
    fontFamily: 'var(--font-body), Montserrat, sans-serif',
  },
  colors: {
    positive: {
      solid: {
        default: { bg: '#24a865', fg: '#ffffff' },
        contrast: { bg: '#24a865', fg: '#ffffff' },
      },
      outline: {
        default: { border: '#24a865', fg: '#18824c' },
        contrast: { border: '#24a865', fg: '#24a865' },
      },
    },
    danger: {
      solid: {
        default: { bg: '#eb0052', fg: '#ffffff' },
        contrast: { bg: '#eb0052', fg: '#ffffff' },
      },
      outline: {
        default: { border: '#eb0052', fg: '#eb0052' },
        contrast: { border: '#f43d7a', fg: '#f43d7a' },
      },
    },
    warning: {
      solid: {
        default: { bg: '#df7b00', fg: '#ffffff' },
        contrast: { bg: '#df7b00', fg: '#ffffff' },
      },
      outline: {
        default: { border: '#bf6a00', fg: '#9f5800' },
        contrast: { border: '#ff8c00', fg: '#ffa639' },
      },
    },
    accent: {
      solid: {
        default: { bg: '#6f41d7', fg: '#ffffff' },
        contrast: { bg: '#6f41d7', fg: '#ffffff' },
      },
      outline: {
        default: { border: '#6f41d7', fg: '#6f41d7' },
        contrast: { border: '#6f41d7', fg: '#ae92ed' },
      },
    },
    info: {
      solid: {
        default: { bg: '#73bff6', fg: '#031419' },
        contrast: { bg: '#0068b0', fg: '#ffffff' },
      },
      outline: {
        default: { border: '#0089e3', fg: '#0079ca' },
        contrast: { border: '#0089e3', fg: '#39a5ee' },
      },
    },
    disabled: {
      solid: {
        default: { bg: '#f2f3f3', fg: '#536b75' },
        contrast: { bg: '#2c4751', fg: '#a7b2ba' },
      },
      outline: {
        default: { border: '#f2f3f3', fg: '#a7b2ba' },
        contrast: { border: '#2c4751', fg: '#536b75' },
      },
    },
    sharp: {
      solid: {
        default: { bg: '#06232c', fg: '#ffffff' },
        contrast: { bg: '#ffffff', fg: '#031419' },
      },
      outline: {
        default: { border: '#06232c', fg: '#031419' },
        contrast: { border: '#f2f3f3', fg: '#ffffff' },
      },
    },
  },
};

export type TagSentiment = 'positive' | 'danger' | 'warning' | 'accent' | 'info' | 'disabled' | 'sharp';
export type TagStyle = 'solid' | 'outline';

export interface TagProps {
  /** The text content of the tag */
  children: React.ReactNode;
  /** The visual sentiment */
  sentiment?: TagSentiment;
  /** The style variant */
  tagStyle?: TagStyle;
  /** Use contrast mode (for dark backgrounds) */
  contrast?: boolean;
  /** Show a bullet/dot before the text */
  showBullet?: boolean;
  /** Optional start icon */
  startIcon?: React.ReactNode;
  /** Optional end icon */
  endIcon?: React.ReactNode;
  /** Additional class names */
  className?: string;
}

// Bullet/dot component
const Bullet = ({ color }: { color: string }) => (
  <span
    style={{
      width: TOKENS.dimensions.bulletWidth,
      height: TOKENS.dimensions.bulletHeight,
      borderRadius: '50%',
      backgroundColor: color,
      flexShrink: 0,
    }}
  />
);

// Re-export icons from DS with appropriate sizing for Tags
export const IconCircleCheck = ({ color = 'currentColor' }: { color?: string }) => (
  <DSIconCircleCheck size={12} color={color} />
);

export const IconCircleExclamation = ({ color = 'currentColor' }: { color?: string }) => (
  <DSIconCircleExclamation size={12} color={color} />
);

export function Tag({
  children,
  sentiment = 'positive',
  tagStyle = 'solid',
  contrast = false,
  showBullet = false,
  startIcon,
  endIcon,
  className = '',
}: TagProps) {
  const colorScheme = TOKENS.colors[sentiment][tagStyle][contrast ? 'contrast' : 'default'];
  const isSolid = tagStyle === 'solid';

  const foregroundColor = colorScheme.fg;
  const backgroundColor = isSolid ? (colorScheme as { bg: string; fg: string }).bg : 'transparent';
  const borderColor = !isSolid ? (colorScheme as { border: string; fg: string }).border : 'transparent';

  return (
    <span
      className={`inline-flex items-center ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: TOKENS.dimensions.height,
        padding: `${TOKENS.dimensions.paddingBlock} ${TOKENS.dimensions.paddingInline}`,
        gap: TOKENS.dimensions.gap,
        borderRadius: TOKENS.dimensions.borderRadius,
        backgroundColor,
        border: !isSolid ? `1px solid ${borderColor}` : 'none',
        fontSize: TOKENS.typography.size,
        lineHeight: TOKENS.typography.lineHeight,
        fontWeight: TOKENS.typography.weight,
        fontFamily: TOKENS.typography.fontFamily,
        color: foregroundColor,
        whiteSpace: 'nowrap',
      }}
    >
      {startIcon && (
        <span
          className="flex items-center justify-center shrink-0"
          style={{ width: TOKENS.dimensions.iconSize, height: TOKENS.dimensions.iconSize }}
        >
          {startIcon}
        </span>
      )}

      {showBullet && <Bullet color={foregroundColor} />}

      <span>{children}</span>

      {endIcon && (
        <span
          className="flex items-center justify-center shrink-0"
          style={{ width: TOKENS.dimensions.iconSize, height: TOKENS.dimensions.iconSize }}
        >
          {endIcon}
        </span>
      )}
    </span>
  );
}

// Convenience components for common use cases
export function TagSuccess(props: Omit<TagProps, 'sentiment'>) {
  return <Tag {...props} sentiment="positive" />;
}

export function TagDanger(props: Omit<TagProps, 'sentiment'>) {
  return <Tag {...props} sentiment="danger" />;
}

export function TagWarning(props: Omit<TagProps, 'sentiment'>) {
  return <Tag {...props} sentiment="warning" />;
}

export function TagInfo(props: Omit<TagProps, 'sentiment'>) {
  return <Tag {...props} sentiment="info" />;
}

export function TagAccent(props: Omit<TagProps, 'sentiment'>) {
  return <Tag {...props} sentiment="accent" />;
}
