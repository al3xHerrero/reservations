'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';

// Design tokens from Figma
const TOKENS = {
  dimensions: {
    large: { width: '48px', height: '48px' },
    medium: { width: '40px', height: '40px' },
    small: { width: '32px', height: '32px' },
    radii: '64px',
    iconSmall: '18px',
    iconBase: '20px',
  },
  colors: {
    primary: {
      default: {
        rest: { background: '#0079ca', foreground: '#ffffff', border: 'transparent' },
        hover: { background: '#0068b0', foreground: '#ffffff', border: 'transparent' },
        focus: { background: '#0079ca', foreground: '#ffffff', border: '#005795' },
        disabled: { background: '#f2f3f3', foreground: '#a7b2ba', border: 'transparent' },
      },
      contrast: {
        rest: { background: '#39a5ee', foreground: '#031419', border: 'transparent' },
        hover: { background: '#73bff6', foreground: '#031419', border: 'transparent' },
        focus: { background: '#39a5ee', foreground: '#031419', border: '#e6f4ff' },
        disabled: { background: '#2c4751', foreground: '#536b75', border: 'transparent' },
      },
    },
    secondary: {
      default: {
        rest: { background: 'transparent', foreground: '#0079ca', border: '#ccd2d8' },
        hover: { background: 'transparent', foreground: '#0068b0', border: '#a7b2ba' },
        focus: { background: 'transparent', foreground: '#0079ca', border: '#ccd2d8' },
        disabled: { background: '#f2f3f3', foreground: '#a7b2ba', border: '#f2f3f3' },
      },
      contrast: {
        rest: { background: 'transparent', foreground: '#39a5ee', border: '#536b75' },
        hover: { background: 'transparent', foreground: '#73bff6', border: '#73bff6' },
        focus: { background: 'transparent', foreground: '#39a5ee', border: '#536b75' },
        disabled: { background: '#2c4751', foreground: '#536b75', border: '#2c4751' },
      },
    },
    tertiary: {
      default: {
        rest: { background: 'transparent', foreground: '#0079ca', border: 'transparent' },
        hover: { background: '#e6f4ff', foreground: '#0068b0', border: 'transparent' },
        focus: { background: 'transparent', foreground: '#0079ca', border: 'transparent' },
        disabled: { background: 'transparent', foreground: '#a7b2ba', border: 'transparent' },
      },
      contrast: {
        rest: { background: 'transparent', foreground: '#39a5ee', border: 'transparent' },
        hover: { background: '#004679', foreground: '#73bff6', border: 'transparent' },
        focus: { background: 'transparent', foreground: '#39a5ee', border: 'transparent' },
        disabled: { background: 'transparent', foreground: '#536b75', border: 'transparent' },
      },
    },
  },
  shadows: {
    focus: {
      default: '0 0 0 4px rgba(0, 121, 202, 0.32)',
      contrast: '0 0 0 4px rgba(0, 121, 202, 0.64)',
    },
    fab: {
      default: '0 6px 6px rgba(0, 70, 121, 0.2)',
      contrast: '0 6px 6px rgba(3, 20, 25, 0.8)',
    },
  },
};

export type IconButtonSize = 'small' | 'medium' | 'large';
export type IconButtonSentiment = 'primary' | 'secondary' | 'tertiary';

// Icon components
const IconPlus = ({ color, size }: { color: string; size: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 1V13M1 7H13"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const IconMinus = ({ color, size }: { color: string; size: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 14 2"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1H13"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** The icon to display: 'plus' or 'minus', or a custom React node */
  icon: 'plus' | 'minus' | React.ReactNode;
  /** Size of the button */
  size?: IconButtonSize;
  /** Visual style */
  sentiment?: IconButtonSentiment;
  /** Use contrast mode (for dark backgrounds) */
  contrast?: boolean;
  /** Floating action button style (with shadow) */
  fab?: boolean;
  /** Additional class name */
  className?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      size = 'medium',
      sentiment = 'primary',
      contrast = false,
      fab = false,
      disabled = false,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    // Get dimensions
    const dimensions = TOKENS.dimensions[size];
    const iconSize = size === 'small' ? '12px' : '14px';

    // Get color scheme
    const mode = contrast ? 'contrast' : 'default';
    const colorScheme = TOKENS.colors[sentiment][mode];
    
    // Determine current state
    const state = disabled ? 'disabled' : isFocused ? 'focus' : isHovered ? 'hover' : 'rest';
    const colors = colorScheme[state];

    // Build styles
    const buttonStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: dimensions.width,
      height: dimensions.height,
      borderRadius: TOKENS.dimensions.radii,
      backgroundColor: colors.background,
      border: colors.border !== 'transparent' ? `1px solid ${colors.border}` : 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 1 : 1,
      transition: 'all 0.15s ease',
      outline: 'none',
      padding: 0,
      boxShadow: fab
        ? TOKENS.shadows.fab[mode]
        : isFocused && !disabled
        ? TOKENS.shadows.focus[mode]
        : 'none',
      ...style,
    };

    // Render icon
    const renderIcon = () => {
      if (icon === 'plus') {
        return <IconPlus color={colors.foreground} size={iconSize} />;
      }
      if (icon === 'minus') {
        return <IconMinus color={colors.foreground} size={iconSize} />;
      }
      // Custom icon - clone and apply color if possible
      if (React.isValidElement(icon)) {
        return React.cloneElement(icon as React.ReactElement<{ color?: string }>, {
          color: colors.foreground,
        });
      }
      return icon;
    };

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={className}
        style={buttonStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      >
        {renderIcon()}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

// Convenience components for common use cases
export const IconButtonPlus = forwardRef<HTMLButtonElement, Omit<IconButtonProps, 'icon'>>(
  (props, ref) => <IconButton ref={ref} icon="plus" {...props} />
);
IconButtonPlus.displayName = 'IconButtonPlus';

export const IconButtonMinus = forwardRef<HTMLButtonElement, Omit<IconButtonProps, 'icon'>>(
  (props, ref) => <IconButton ref={ref} icon="minus" {...props} />
);
IconButtonMinus.displayName = 'IconButtonMinus';
