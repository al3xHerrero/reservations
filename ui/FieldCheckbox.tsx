'use client';

import React, { useState } from 'react';

// Design tokens from Figma
const TOKENS = {
  dimensions: {
    width: '16px',
    height: '16px',
    radius: '4px',
    gap: '4px',
  },
  typography: {
    base: {
      size: '16px',
      lineHeight: '24px',
    },
    small: {
      size: '14px',
      lineHeight: '20px',
    },
    weight: '400',
    fontFamily: 'var(--font-body), Montserrat, sans-serif',
  },
  colors: {
    input: {
      bg: {
        default: '#ffffff',
        contrast: '#06232c',
        disable: {
          default: '#f2f3f3',
          contrast: '#2c4751',
        },
        danger: {
          default: '#ffffff',
          contrast: '#06232c',
        },
        active: {
          default: '#0089e3',
          contrast: '#0089e3',
        },
      },
      border: {
        default: '#ccd2d8',
        contrast: '#536b75',
        danger: {
          default: '#eb0052',
          contrast: '#eb0052',
        },
      },
      fg: {
        active: '#ffffff',
        disable: {
          default: '#a7b2ba',
          contrast: '#536b75',
        },
      },
    },
    label: {
      default: '#031419',
      contrast: '#ffffff',
      danger: {
        default: '#031419',
        contrast: '#ffffff',
      },
      disable: {
        default: '#a7b2ba',
        contrast: '#536b75',
      },
      active: {
        default: '#031419',
        contrast: '#ffffff',
      },
    },
  },
  shadow: {
    primary: {
      default: '0px 0px 0px 4px rgba(0, 121, 202, 0.32)',
      contrast: '0px 0px 0px 4px rgba(0, 121, 202, 0.64)',
    },
    danger: {
      default: '0px 0px 0px 4px rgba(235, 0, 82, 0.32)',
      contrast: '0px 0px 0px 4px rgba(235, 0, 82, 0.64)',
    },
  },
};

// Check icon component
const CheckIcon = ({ color }: { color: string }) => (
  <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 3.5L4 6.5L10 0.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export type CheckboxSize = 'base' | 'small';
export type CheckboxSentiment = 'default' | 'danger';

export interface FieldCheckboxProps {
  /** Whether the checkbox is checked */
  checked: boolean;
  /** Callback when checkbox value changes */
  onChange: (checked: boolean) => void;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Label text */
  label?: string;
  /** Whether to show the label */
  showLabel?: boolean;
  /** Use contrast mode (for dark backgrounds) */
  contrast?: boolean;
  /** Size variant */
  size?: CheckboxSize;
  /** Sentiment variant */
  sentiment?: CheckboxSentiment;
  /** Test ID for testing */
  testId?: string;
  /** Additional class names */
  className?: string;
}

export function FieldCheckbox({
  checked,
  onChange,
  disabled = false,
  label = '',
  showLabel = true,
  contrast = false,
  size = 'base',
  sentiment = 'default',
  testId,
  className = '',
}: FieldCheckboxProps) {
  const [isFocused, setIsFocused] = useState(false);

  const getBackgroundColor = () => {
    if (disabled) {
      return contrast
        ? TOKENS.colors.input.bg.disable.contrast
        : TOKENS.colors.input.bg.disable.default;
    }
    if (checked) {
      return contrast
        ? TOKENS.colors.input.bg.active.contrast
        : TOKENS.colors.input.bg.active.default;
    }
    if (sentiment === 'danger') {
      return contrast
        ? TOKENS.colors.input.bg.danger.contrast
        : TOKENS.colors.input.bg.danger.default;
    }
    return contrast
      ? TOKENS.colors.input.bg.contrast
      : TOKENS.colors.input.bg.default;
  };

  const getBorderColor = () => {
    if (disabled || checked) return 'transparent';
    if (sentiment === 'danger') {
      return contrast
        ? TOKENS.colors.input.border.danger.contrast
        : TOKENS.colors.input.border.danger.default;
    }
    return contrast
      ? TOKENS.colors.input.border.contrast
      : TOKENS.colors.input.border.default;
  };

  const getLabelColor = () => {
    if (disabled) {
      return contrast
        ? TOKENS.colors.label.disable.contrast
        : TOKENS.colors.label.disable.default;
    }
    if (checked) {
      return contrast
        ? TOKENS.colors.label.active.contrast
        : TOKENS.colors.label.active.default;
    }
    if (sentiment === 'danger') {
      return contrast
        ? TOKENS.colors.label.danger.contrast
        : TOKENS.colors.label.danger.default;
    }
    return contrast
      ? TOKENS.colors.label.contrast
      : TOKENS.colors.label.default;
  };

  const getCheckIconColor = () => {
    if (disabled) {
      return contrast
        ? TOKENS.colors.input.fg.disable.contrast
        : TOKENS.colors.input.fg.disable.default;
    }
    return TOKENS.colors.input.fg.active;
  };

  const getFocusShadow = () => {
    if (!isFocused || disabled) return 'none';
    if (sentiment === 'danger') {
      return contrast
        ? TOKENS.shadow.danger.contrast
        : TOKENS.shadow.danger.default;
    }
    return contrast
      ? TOKENS.shadow.primary.contrast
      : TOKENS.shadow.primary.default;
  };

  const typographyTokens = size === 'small' ? TOKENS.typography.small : TOKENS.typography.base;

  return (
    <label
      className={`flex items-start cursor-pointer ${disabled ? 'cursor-not-allowed' : ''} ${className}`}
      style={{ gap: TOKENS.dimensions.gap }}
      data-testid={testId}
    >
      {/* Hidden checkbox input */}
      <span
        className="flex items-center"
        style={{ paddingTop: size === 'small' ? '3px' : '5px' }}
      >
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(event) => !disabled && onChange(event.target.checked)}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {/* Visual checkbox */}
        <span
          aria-hidden="true"
          className="flex items-center justify-center shrink-0 transition-colors"
          style={{
            width: TOKENS.dimensions.width,
            height: TOKENS.dimensions.height,
            borderRadius: TOKENS.dimensions.radius,
            backgroundColor: getBackgroundColor(),
            border: checked || disabled ? 'none' : `1px solid ${getBorderColor()}`,
            boxShadow: getFocusShadow(),
          }}
        >
          {checked && <CheckIcon color={getCheckIconColor()} />}
        </span>
      </span>

      {/* Label */}
      {showLabel && label && (
        <span
          style={{
            fontSize: typographyTokens.size,
            lineHeight: typographyTokens.lineHeight,
            fontWeight: TOKENS.typography.weight,
            fontFamily: TOKENS.typography.fontFamily,
            color: getLabelColor(),
          }}
        >
          {label}
        </span>
      )}
    </label>
  );
}
