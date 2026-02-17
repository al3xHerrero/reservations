'use client';

import React, { useState } from 'react';

// Design tokens from Figma (consistent with Checkbox)
const TOKENS = {
  dimensions: {
    width: '16px',
    height: '16px',
    radius: '9999px', // Fully rounded for radio
    gap: '4px',
    dotSize: '8px',
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
      dot: {
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

export type FieldRadioOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type RadioSize = 'base' | 'small';
export type RadioSentiment = 'default' | 'danger';

export interface FieldRadioGroupProps {
  /** Currently selected value */
  value: string;
  /** Callback when value changes */
  onChange: (value: string) => void;
  /** Array of options */
  options: FieldRadioOption[];
  /** Disable all options */
  disabled?: boolean;
  /** Size variant */
  size?: RadioSize;
  /** Use contrast mode (for dark backgrounds) */
  contrast?: boolean;
  /** Sentiment variant */
  sentiment?: RadioSentiment;
  /** Name attribute for the radio group */
  name?: string;
  /** Test ID for testing */
  testId?: string;
  /** Additional class names */
  className?: string;
  /** Direction of the radio group */
  direction?: 'horizontal' | 'vertical';
}

export function FieldRadioGroup({
  value,
  onChange,
  options,
  disabled = false,
  size = 'base',
  contrast = false,
  sentiment = 'default',
  name,
  testId,
  className = '',
  direction = 'vertical',
}: FieldRadioGroupProps) {
  const [focusedValue, setFocusedValue] = useState<string | null>(null);

  const getBackgroundColor = (isSelected: boolean, isDisabled: boolean) => {
    if (isDisabled) {
      return contrast
        ? TOKENS.colors.input.bg.disable.contrast
        : TOKENS.colors.input.bg.disable.default;
    }
    if (isSelected) {
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

  const getBorderColor = (isSelected: boolean, isDisabled: boolean) => {
    if (isDisabled || isSelected) return 'transparent';
    if (sentiment === 'danger') {
      return contrast
        ? TOKENS.colors.input.border.danger.contrast
        : TOKENS.colors.input.border.danger.default;
    }
    return contrast
      ? TOKENS.colors.input.border.contrast
      : TOKENS.colors.input.border.default;
  };

  const getLabelColor = (isSelected: boolean, isDisabled: boolean) => {
    if (isDisabled) {
      return contrast
        ? TOKENS.colors.label.disable.contrast
        : TOKENS.colors.label.disable.default;
    }
    if (isSelected) {
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

  const getDotColor = (isDisabled: boolean) => {
    if (isDisabled) {
      return contrast
        ? TOKENS.colors.input.dot.disable.contrast
        : TOKENS.colors.input.dot.disable.default;
    }
    return TOKENS.colors.input.dot.active;
  };

  const getFocusShadow = (isFocused: boolean, isDisabled: boolean) => {
    if (!isFocused || isDisabled) return 'none';
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
    <div
      className={`flex ${direction === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col'} ${className}`}
      style={{ gap: direction === 'horizontal' ? '16px' : '8px' }}
      role="radiogroup"
      aria-disabled={disabled || undefined}
      data-testid={testId}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        const isDisabled = disabled || option.disabled;
        const isFocused = focusedValue === option.value;

        return (
          <label
            key={option.value}
            className={`flex items-start cursor-pointer ${isDisabled ? 'cursor-not-allowed' : ''}`}
            style={{ gap: TOKENS.dimensions.gap }}
          >
            {/* Hidden radio input */}
            <span
              className="flex items-center"
              style={{ paddingTop: size === 'small' ? '3px' : '5px' }}
            >
              <input
                type="radio"
                className="sr-only"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => !isDisabled && onChange(option.value)}
                disabled={isDisabled}
                onFocus={() => setFocusedValue(option.value)}
                onBlur={() => setFocusedValue(null)}
              />
              
              {/* Visual radio */}
              <span
                aria-hidden="true"
                className="flex items-center justify-center shrink-0 transition-colors"
                style={{
                  width: TOKENS.dimensions.width,
                  height: TOKENS.dimensions.height,
                  borderRadius: TOKENS.dimensions.radius,
                  backgroundColor: getBackgroundColor(isSelected, !!isDisabled),
                  border: isSelected || isDisabled ? 'none' : `1px solid ${getBorderColor(isSelected, !!isDisabled)}`,
                  boxShadow: getFocusShadow(isFocused, !!isDisabled),
                }}
              >
                {isSelected && (
                  <span
                    style={{
                      width: TOKENS.dimensions.dotSize,
                      height: TOKENS.dimensions.dotSize,
                      borderRadius: '50%',
                      backgroundColor: getDotColor(!!isDisabled),
                    }}
                  />
                )}
              </span>
            </span>

            {/* Label */}
            <span
              style={{
                fontSize: typographyTokens.size,
                lineHeight: typographyTokens.lineHeight,
                fontWeight: TOKENS.typography.weight,
                fontFamily: TOKENS.typography.fontFamily,
                color: getLabelColor(isSelected, !!isDisabled),
              }}
            >
              {option.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}

// Single Radio Button component for more flexibility
export interface FieldRadioProps {
  /** Whether the radio is selected */
  checked: boolean;
  /** Callback when radio is selected */
  onChange: () => void;
  /** Whether the radio is disabled */
  disabled?: boolean;
  /** Label text */
  label?: string;
  /** Whether to show the label */
  showLabel?: boolean;
  /** Use contrast mode (for dark backgrounds) */
  contrast?: boolean;
  /** Size variant */
  size?: RadioSize;
  /** Sentiment variant */
  sentiment?: RadioSentiment;
  /** Name attribute */
  name?: string;
  /** Value attribute */
  value?: string;
  /** Test ID for testing */
  testId?: string;
  /** Additional class names */
  className?: string;
}

export function FieldRadio({
  checked,
  onChange,
  disabled = false,
  label = '',
  showLabel = true,
  contrast = false,
  size = 'base',
  sentiment = 'default',
  name,
  value,
  testId,
  className = '',
}: FieldRadioProps) {
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

  const getDotColor = () => {
    if (disabled) {
      return contrast
        ? TOKENS.colors.input.dot.disable.contrast
        : TOKENS.colors.input.dot.disable.default;
    }
    return TOKENS.colors.input.dot.active;
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
      {/* Hidden radio input */}
      <span
        className="flex items-center"
        style={{ paddingTop: size === 'small' ? '3px' : '5px' }}
      >
        <input
          type="radio"
          className="sr-only"
          name={name}
          value={value}
          checked={checked}
          onChange={() => !disabled && onChange()}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {/* Visual radio */}
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
          {checked && (
            <span
              style={{
                width: TOKENS.dimensions.dotSize,
                height: TOKENS.dimensions.dotSize,
                borderRadius: '50%',
                backgroundColor: getDotColor(),
              }}
            />
          )}
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
