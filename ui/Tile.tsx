'use client';

import React, { forwardRef, ButtonHTMLAttributes } from 'react';

// Design tokens from Figma
const TOKENS = {
  dimensions: {
    width: '96px',
    widthWider: '160px',
    padding: '12px',
    borderRadius: '8px',
    checkmarkSize: '16px',
  },
  typography: {
    fontSize: '16px',
    lineHeight: '24px',
    fontFamily: 'var(--font-body), Montserrat, sans-serif',
  },
  colors: {
    default: {
      background: '#ffffff',
      border: '#ccd2d8',
      foreground: '#031419',
    },
    hover: {
      background: '#ffffff',
      border: '#0068b0',
      foreground: '#005795',
    },
    focus: {
      background: '#ffffff',
      border: '#0068b0',
      foreground: '#005795',
      shadow: '0 0 0 4px rgba(0, 121, 202, 0.32)',
    },
    selected: {
      background: '#ffffff',
      border: '#0079ca',
      foreground: '#0079ca',
    },
    selectedHover: {
      background: '#ffffff',
      border: '#0068b0',
      foreground: '#005795',
    },
    selectedFocus: {
      background: '#ffffff',
      border: '#0068b0',
      foreground: '#005795',
      shadow: '0 0 0 4px rgba(0, 121, 202, 0.32)',
    },
    disabled: {
      background: '#f2f3f3',
      border: '#f2f3f3',
      foreground: '#a7b2ba',
    },
  },
};

// Checkmark icon for selected state
const CheckmarkIcon = ({ color = '#0079ca' }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M0 4C0 1.79086 1.79086 0 4 0H16V12C16 14.2091 14.2091 16 12 16H0V4Z" 
      fill={color}
    />
    <path 
      d="M5 8L7 10L11 6" 
      stroke="white" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export interface TileProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Primary text (e.g., day of week or time) */
  label: string;
  /** Secondary text (e.g., date) */
  sublabel?: string;
  /** Whether the tile is selected */
  selected?: boolean;
  /** Use wider variant (160px instead of 96px) */
  wider?: boolean;
  /** Use auto width (fit-content) instead of fixed width */
  autoWidth?: boolean;
  /** Additional class name */
  className?: string;
}

export const Tile = forwardRef<HTMLButtonElement, TileProps>(
  (
    {
      label,
      sublabel,
      selected = false,
      wider = false,
      autoWidth = false,
      disabled = false,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    // Determine colors based on state
    const getColors = () => {
      if (disabled) {
        return TOKENS.colors.disabled;
      }
      if (selected) {
        if (isFocused) return TOKENS.colors.selectedFocus;
        if (isHovered) return TOKENS.colors.selectedHover;
        return TOKENS.colors.selected;
      }
      if (isFocused) return TOKENS.colors.focus;
      if (isHovered) return TOKENS.colors.hover;
      return TOKENS.colors.default;
    };

    const colors = getColors();
    const borderWidth = selected && !disabled ? '2px' : '1px';
    const boxShadow = (isFocused && !disabled) ? (colors as { shadow?: string }).shadow || 'none' : 'none';

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={className}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: autoWidth ? 'auto' : wider ? TOKENS.dimensions.widthWider : TOKENS.dimensions.width,
          padding: TOKENS.dimensions.padding,
          borderRadius: TOKENS.dimensions.borderRadius,
          backgroundColor: colors.background,
          border: `${borderWidth} solid ${colors.border}`,
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          boxShadow,
          transition: 'all 0.15s ease',
          overflow: 'hidden',
          ...style,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      >
        {/* Content */}
        <span
          style={{
            fontSize: TOKENS.typography.fontSize,
            lineHeight: TOKENS.typography.lineHeight,
            fontFamily: TOKENS.typography.fontFamily,
            color: colors.foreground,
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          {sublabel ? (
            <>
              <span style={{ display: 'block' }}>{label}</span>
              <span style={{ display: 'block' }}>{sublabel}</span>
            </>
          ) : (
            label
          )}
        </span>

        {/* Checkmark for selected state */}
        {selected && (
          <span
            style={{
              position: 'absolute',
              top: disabled ? '-1px' : '-2px',
              right: disabled ? '-1px' : '-2px',
              width: TOKENS.dimensions.checkmarkSize,
              height: TOKENS.dimensions.checkmarkSize,
            }}
          >
            <CheckmarkIcon color={disabled ? '#a7b2ba' : colors.border} />
          </span>
        )}
      </button>
    );
  }
);

Tile.displayName = 'Tile';

// Convenience component for date tiles
export interface DateTileProps extends Omit<TileProps, 'label' | 'sublabel'> {
  /** Day of week (e.g., "Mon", "Fri") */
  day: string;
  /** Date (e.g., "1 Jul", "8 Aug") */
  date: string;
}

export const DateTile = forwardRef<HTMLButtonElement, DateTileProps>(
  ({ day, date, ...props }, ref) => (
    <Tile ref={ref} label={day} sublabel={date} {...props} />
  )
);

DateTile.displayName = 'DateTile';

// Convenience component for time tiles
export interface TimeTileProps extends Omit<TileProps, 'label' | 'sublabel'> {
  /** Time string (e.g., "10:00") */
  time: string;
}

export const TimeTile = forwardRef<HTMLButtonElement, TimeTileProps>(
  ({ time, ...props }, ref) => (
    <Tile ref={ref} label={time} {...props} />
  )
);

TimeTile.displayName = 'TimeTile';
