'use client';

import React, { useState, useId } from 'react';

const errorIcon = '/icons/error.svg';
const searchIcon = '/icons/search.svg';
const clearIcon = '/icons/clear.svg';

// Design tokens from Figma
const TOKENS = {
  // Dimensions
  height: '56px',
  borderRadius: '8px',
  paddingInline: '12px',
  gap: '8px',
  iconSize: '26px',
  clearButtonSize: '32px',
  touchAreaSize: '44px',
  // Colors - Rest state
  bgDefault: '#ffffff',
  borderDefault: '#ccd2d8',
  labelDefault: '#536b75',
  placeholderDefault: '#536b75',
  valueDefault: '#031419',
  // Colors - Focus state
  borderFocus: '#0068b0',
  shadowFocus: '0px 0px 0px 4px rgba(0, 121, 202, 0.32)',
  // Colors - Disabled state
  bgDisabled: '#f2f3f3',
  borderDisabled: '#f2f3f3',
  labelDisabled: '#a7b2ba',
  valueDisabled: '#a7b2ba',
  iconDisabled: '#a7b2ba',
  // Colors - Error state
  borderError: '#eb0052',
  labelError: '#eb0052',
  shadowError: '0px 0px 0px 4px rgba(235, 0, 82, 0.32)',
  // Typography
  fontFamily: 'Montserrat, sans-serif',
  labelSizeRest: '16px',
  labelSizeFocus: '12px',
  labelLineHeightRest: '24px',
  labelLineHeightFocus: '16px',
  labelWeightRest: '400',
  labelWeightFocus: '600',
  valueSize: '16px',
  valueLineHeight: '24px',
  valueWeight: '400',
};

type FieldInputVariant = 'text' | 'search';

interface FieldInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  wrapperClassName?: string;
  testId?: string;
  variant?: FieldInputVariant;
  showClearButton?: boolean;
  onClear?: () => void;
}

export function FieldInput({
  label,
  error,
  helperText,
  disabled,
  readOnly,
  wrapperClassName = '',
  className = '',
  testId,
  variant = 'text',
  showClearButton = false,
  onClear,
  value,
  placeholder,
  ...props
}: FieldInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const internalId = useId();
  const inputId = props.id || internalId;

  const hasError = Boolean(error);
  const hasValue = Boolean(value && String(value).length > 0);
  const isLabelFloating = isFocused || hasValue;
  const isSearch = variant === 'search';

  const getFieldBackground = () => {
    if (disabled || readOnly) return TOKENS.bgDisabled;
    return TOKENS.bgDefault;
  };

  const getFieldBorder = () => {
    if (disabled) return TOKENS.borderDisabled;
    if (readOnly) return 'transparent';
    if (hasError) return TOKENS.borderError;
    if (isFocused) return TOKENS.borderFocus;
    return TOKENS.borderDefault;
  };

  const getLabelColor = () => {
    if (disabled) return TOKENS.labelDisabled;
    if (hasError) return TOKENS.labelError;
    return TOKENS.labelDefault;
  };

  const getValueColor = () => {
    if (disabled) return TOKENS.valueDisabled;
    return TOKENS.valueDefault;
  };

  const getPlaceholderColor = () => {
    if (disabled) return TOKENS.valueDisabled;
    return TOKENS.labelDefault;
  };

  const getFocusShadow = () => {
    if (!isFocused || disabled || readOnly) return 'none';
    if (hasError) return TOKENS.shadowError;
    return TOKENS.shadowFocus;
  };

  const getBorderWidth = () => {
    if (readOnly) return '0';
    if (isFocused && !disabled) return '2px';
    return '1px';
  };

  const getIconColor = () => {
    if (disabled) return TOKENS.iconDisabled;
    return TOKENS.valueDefault;
  };

  return (
    <div className={`w-full ${wrapperClassName}`}>
      <div
        className={`relative flex items-center ${className}`}
        data-testid={testId}
        style={{
          height: TOKENS.height,
          borderRadius: TOKENS.borderRadius,
          backgroundColor: getFieldBackground(),
          borderWidth: getBorderWidth(),
          borderStyle: 'solid',
          borderColor: getFieldBorder(),
          paddingLeft: TOKENS.paddingInline,
          paddingRight: showClearButton && hasValue ? TOKENS.touchAreaSize : TOKENS.paddingInline,
          gap: TOKENS.gap,
          boxShadow: getFocusShadow(),
          fontFamily: TOKENS.fontFamily,
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        }}
      >
        {/* Search Icon */}
        {isSearch && (
          <span
            className="flex shrink-0 items-center justify-center"
            style={{ width: TOKENS.iconSize, height: TOKENS.iconSize }}
          >
            <img
              alt=""
              src={searchIcon}
              className="w-5 h-5"
              style={{ 
                filter: disabled 
                  ? 'brightness(0) saturate(100%) invert(75%) sepia(6%) saturate(393%) hue-rotate(169deg) brightness(91%) contrast(88%)' 
                  : 'none' 
              }}
            />
          </span>
        )}

        {/* Text wrapper */}
        <div className="relative flex-1 flex flex-col justify-center" style={{ minHeight: '40px' }}>
          {/* Label */}
          {label && (
            <label
              htmlFor={inputId}
              className="absolute left-0 transition-all duration-150 pointer-events-none"
              style={{
                top: isLabelFloating ? '0' : '50%',
                transform: isLabelFloating ? 'translateY(0)' : 'translateY(-50%)',
                fontSize: isLabelFloating ? TOKENS.labelSizeFocus : TOKENS.labelSizeRest,
                lineHeight: isLabelFloating ? TOKENS.labelLineHeightFocus : TOKENS.labelLineHeightRest,
                fontWeight: isLabelFloating ? TOKENS.labelWeightFocus : TOKENS.labelWeightRest,
                color: getLabelColor(),
              }}
            >
              {label}
            </label>
          )}

          {/* Input */}
          <input
            {...props}
            id={inputId}
            value={value}
            placeholder={!label || isLabelFloating ? placeholder : undefined}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={hasError || undefined}
            className="w-full bg-transparent outline-none disabled:cursor-not-allowed"
            style={{
              fontSize: TOKENS.valueSize,
              lineHeight: TOKENS.valueLineHeight,
              fontWeight: TOKENS.valueWeight,
              color: getValueColor(),
              paddingTop: label && isLabelFloating ? '16px' : '0',
              fontFamily: TOKENS.fontFamily,
            }}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
          />
        </div>

        {/* Clear Button */}
        {showClearButton && hasValue && !disabled && !readOnly && (
          <button
            type="button"
            onClick={onClear}
            className="absolute flex items-center justify-center hover:opacity-70 transition-opacity"
            style={{
              right: '6px',
              width: TOKENS.clearButtonSize,
              height: TOKENS.clearButtonSize,
              borderRadius: '64px',
            }}
            aria-label="Clear input"
          >
            <img alt="" src={clearIcon} className="w-[10px] h-[10px]" />
          </button>
        )}
      </div>

      {/* Helper/Error text */}
      {hasError ? (
        <div className="flex items-start gap-1 mt-1 pl-3">
          <span className="shrink-0 w-4 h-4">
            <img alt="" src={errorIcon} className="w-full h-full" />
          </span>
          <p
            style={{
              fontSize: TOKENS.labelSizeFocus,
              lineHeight: TOKENS.labelLineHeightFocus,
              color: TOKENS.labelError,
              fontFamily: TOKENS.fontFamily,
            }}
          >
            {error}
          </p>
        </div>
      ) : helperText ? (
        <p
          className="mt-1 pl-3"
          style={{
            fontSize: TOKENS.labelSizeFocus,
            lineHeight: TOKENS.labelLineHeightFocus,
            color: TOKENS.labelDefault,
            fontFamily: TOKENS.fontFamily,
          }}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

// Convenience component for search inputs
export function FieldSearch(props: Omit<FieldInputProps, 'variant'>) {
  return <FieldInput {...props} variant="search" />;
}
