'use client';

import React from 'react';

// Design tokens from Figma
const TOKENS = {
  dimensions: {
    gap: '8px',
    gapContent: '4px',
    paddingInline: '12px',
    paddingBlock: '8px',
    radii: '8px',
    barWidth: '4px',
    iconSize: '24px',
  },
  typography: {
    titleSize: '16px',
    titleLineHeight: '24px',
    titleWeight: '600',
    descriptionSize: '16px',
    descriptionLineHeight: '24px',
    descriptionWeight: '400',
    fontFamily: 'var(--font-body), Montserrat, sans-serif',
  },
  colors: {
    info: {
      default: {
        foreground: '#0068b0',
        background: '#e6f4ff',
        bar: '#0068b0',
      },
      contrast: {
        foreground: '#e6f4ff',
        background: '#0068b0',
        bar: '#39a5ee',
      },
    },
    accent: {
      default: {
        foreground: '#6f41d7',
        background: '#f0ebfd',
        bar: '#6f41d7',
      },
      contrast: {
        foreground: '#f0ebfd',
        background: '#522da5',
        bar: '#8e69e3',
      },
    },
    positive: {
      default: {
        foreground: '#18824c',
        background: '#e8f8f0',
        bar: '#18824c',
      },
      contrast: {
        foreground: '#ffffff',
        background: '#18824c',
        bar: '#53be88',
      },
    },
    warning: {
      default: {
        foreground: '#9f5800',
        background: '#fff4e6',
        bar: '#9f5800',
      },
      contrast: {
        foreground: '#031419',
        background: '#ffa639',
        bar: '#bf6a00',
      },
    },
    danger: {
      default: {
        foreground: '#b6003c',
        background: '#fff0f4',
        bar: '#b6003c',
      },
      contrast: {
        foreground: '#fff0f4',
        background: '#b6003c',
        bar: '#f43d7a',
      },
    },
  },
  closeButton: {
    size: '32px',
    borderRadius: '64px',
    defaultColor: '#031419',
    contrastColor: '#ffffff',
  },
};

export type AlertSentiment = 'info' | 'accent' | 'positive' | 'warning' | 'danger';

export interface AlertProps {
  /** The title of the alert */
  title: string;
  /** Optional description text */
  description?: React.ReactNode;
  /** The visual style variant */
  sentiment?: AlertSentiment;
  /** Use contrasting solid background */
  contrast?: boolean;
  /** Show close button */
  showCloseButton?: boolean;
  /** Callback when close button is clicked */
  onClose?: () => void;
  /** Additional class names */
  className?: string;
  /** Optional extra content rendered below the description */
  children?: React.ReactNode;
  /** Override the title font weight (default follows design tokens) */
  titleWeight?: number;
}

// Icon components
const InfoIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="7" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M8 7V11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="5" r="0.75" fill={color} />
  </svg>
);

const BellIcon = ({ color }: { color: string }) => (
  <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7 1C4.79086 1 3 2.79086 3 5V8L1.5 11H12.5L11 8V5C11 2.79086 9.20914 1 7 1Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
    />
    <path d="M5.5 11V12C5.5 12.8284 6.17157 13.5 7 13.5C7.82843 13.5 8.5 12.8284 8.5 12V11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CheckIcon = ({ color }: { color: string }) => (
  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 5L5 9L13 1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WarningIcon = ({ color }: { color: string }) => (
  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.134 1.5C7.51888 0.833333 8.48112 0.833333 8.866 1.5L14.9282 12C15.3131 12.6667 14.832 13.5 14.0622 13.5H1.93782C1.16802 13.5 0.686935 12.6667 1.0718 12L7.134 1.5Z"
      stroke={color}
      strokeWidth="1.5"
      fill="none"
    />
    <path d="M8 5V8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="10.5" r="0.75" fill={color} />
  </svg>
);

const DangerIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="7" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M8 4V9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="11.5" r="0.75" fill={color} />
  </svg>
);

const CloseIcon = ({ color }: { color: string }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L11 11M11 1L1 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const getIcon = (sentiment: AlertSentiment, color: string) => {
  switch (sentiment) {
    case 'info':
      return <InfoIcon color={color} />;
    case 'accent':
      return <BellIcon color={color} />;
    case 'positive':
      return <CheckIcon color={color} />;
    case 'warning':
      return <WarningIcon color={color} />;
    case 'danger':
      return <DangerIcon color={color} />;
  }
};

export function Alert({
  title,
  description,
  sentiment = 'info',
  contrast = false,
  showCloseButton = true,
  onClose,
  className = '',
  children,
  titleWeight,
}: AlertProps) {
  const colorScheme = TOKENS.colors[sentiment][contrast ? 'contrast' : 'default'];
  const closeButtonColor = contrast ? TOKENS.closeButton.contrastColor : TOKENS.closeButton.defaultColor;

  const hasMultipleLines = Boolean(description || children);

  return (
    <div
      className={`relative flex overflow-hidden ${hasMultipleLines ? 'items-start' : 'items-center'} ${className}`}
      style={{
        backgroundColor: colorScheme.background,
        borderRadius: TOKENS.dimensions.radii,
        padding: `${TOKENS.dimensions.paddingBlock} ${TOKENS.dimensions.paddingInline}`,
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: TOKENS.dimensions.barWidth,
          backgroundColor: colorScheme.bar,
          borderRadius: `${TOKENS.dimensions.radii} 0 0 ${TOKENS.dimensions.radii}`,
        }}
      />

      {/* Content wrapper */}
      <div
        className={`flex flex-1 ${hasMultipleLines ? 'items-start' : 'items-center'}`}
        style={{
          gap: TOKENS.dimensions.gap,
          marginLeft: TOKENS.dimensions.barWidth,
        }}
      >
        {/* Icon */}
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width: TOKENS.dimensions.iconSize,
            height: TOKENS.dimensions.iconSize,
          }}
        >
          {getIcon(sentiment, colorScheme.foreground)}
        </div>

        {/* Text content */}
        <div
          className="flex flex-col flex-1 min-w-0"
          style={{ gap: description ? TOKENS.dimensions.gapContent : 0 }}
        >
          {/* Title */}
          <p
            style={{
              margin: 0,
              fontSize: description ? TOKENS.typography.titleSize : TOKENS.typography.descriptionSize,
              lineHeight: TOKENS.typography.titleLineHeight,
              fontWeight: titleWeight ?? (description ? TOKENS.typography.titleWeight : TOKENS.typography.descriptionWeight),
              fontFamily: TOKENS.typography.fontFamily,
              color: colorScheme.foreground,
            }}
          >
            {title}
          </p>

          {/* Description */}
          {description && (
            <p
              style={{
                margin: 0,
                fontSize: TOKENS.typography.descriptionSize,
                lineHeight: TOKENS.typography.descriptionLineHeight,
                fontWeight: TOKENS.typography.descriptionWeight,
                fontFamily: TOKENS.typography.fontFamily,
                color: colorScheme.foreground,
              }}
            >
              {description}
            </p>
          )}

          {children && (
            <div
              style={{
                marginTop: TOKENS.dimensions.gapContent,
                fontSize: TOKENS.typography.descriptionSize,
                lineHeight: TOKENS.typography.descriptionLineHeight,
                fontWeight: TOKENS.typography.descriptionWeight,
                fontFamily: TOKENS.typography.fontFamily,
                color: colorScheme.foreground,
              }}
            >
              {children}
            </div>
          )}
        </div>
      </div>

      {/* Close button */}
      {showCloseButton && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 flex items-center justify-center transition-opacity hover:opacity-70"
          style={{
            width: TOKENS.closeButton.size,
            height: TOKENS.closeButton.size,
            borderRadius: TOKENS.closeButton.borderRadius,
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
          aria-label="Close alert"
        >
          <CloseIcon color={closeButtonColor} />
        </button>
      )}
    </div>
  );
}
