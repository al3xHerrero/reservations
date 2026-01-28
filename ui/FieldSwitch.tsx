'use client';

import React, { useState } from 'react';

const iconSwitchCheckDefault = '/icons/switch-check.svg';
const iconSwitchCheckContrast = '/icons/switch-check-contrast.svg';

interface FieldSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  contrast?: boolean;
  testId?: string;
  className?: string;
}

// Design tokens from Figma
const TOKENS = {
  // Dimensions
  width: '56px',
  height: '32px',
  borderRadii: '64px',
  paddingInlineStart: '8px',
  paddingInlineEnd: '4px',
  paddingBlock: '4px',
  // Toggle dimensions
  toggleWidthOn: '24px',
  toggleHeightOn: '24px',
  toggleWidthOff: '16px',
  toggleHeightOff: '16px',
  toggleBorderRadii: '64px',
  iconSize: '16px',
  // Colors - ON states
  bgOnDefault: '#24a865',
  bgOnContrast: '#24a865',
  borderOnDefault: '#ccd2d8',
  borderOnContrast: '#536b75',
  toggleBgOnDefault: '#ffffff',
  toggleBgOnContrast: '#ffffff',
  toggleFgOnDefault: '#18824c',
  toggleFgOnContrast: '#24a865',
  // Colors - OFF states
  bgOffDefault: '#a7b2ba',
  bgOffContrast: '#536b75',
  borderOffDefault: '#ccd2d8',
  borderOffContrast: '#536b75',
  toggleBgOffDefault: '#ffffff',
  toggleBgOffContrast: '#ffffff',
  // Colors - DISABLE states
  bgDisableDefault: '#f2f3f3',
  bgDisableContrast: '#2c4751',
  toggleBgDisableDefault: '#ffffff',
  toggleBgDisableContrast: '#7d8e98',
  // Shadows
  shadowDefault: '0px 2px 2px 0px rgba(6, 35, 44, 0.16)',
  shadowContrast: '0px 2px 2px 0px rgba(6, 35, 44, 0.24)',
  shadowAccessibilityDefault: '0px 0px 0px 8px rgba(0, 121, 202, 0.4), 0px 2px 2px 0px rgba(6, 35, 44, 0.16)',
  shadowAccessibilityContrast: '0px 0px 0px 8px rgba(0, 121, 202, 0.64), 0px 2px 2px 0px rgba(6, 35, 44, 0.24)',
};

export function FieldSwitch({
  checked,
  onChange,
  disabled = false,
  contrast = false,
  testId,
  className = '',
}: FieldSwitchProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    onChange(!checked);
  };

  const getTrackBackground = () => {
    if (disabled) {
      return contrast ? TOKENS.bgDisableContrast : TOKENS.bgDisableDefault;
    }
    if (checked) {
      return contrast ? TOKENS.bgOnContrast : TOKENS.bgOnDefault;
    }
    return contrast ? TOKENS.bgOffContrast : TOKENS.bgOffDefault;
  };

  const getTrackBorder = () => {
    if (disabled) return 'transparent';
    if (checked) {
      return contrast ? TOKENS.borderOnContrast : TOKENS.borderOnDefault;
    }
    return contrast ? TOKENS.borderOffContrast : TOKENS.borderOffDefault;
  };

  const getToggleBackground = () => {
    if (disabled) {
      return contrast ? TOKENS.toggleBgDisableContrast : TOKENS.toggleBgDisableDefault;
    }
    if (checked) {
      return contrast ? TOKENS.toggleBgOnContrast : TOKENS.toggleBgOnDefault;
    }
    return contrast ? TOKENS.toggleBgOffContrast : TOKENS.toggleBgOffDefault;
  };

  const getToggleShadow = () => {
    if (isFocused && !disabled) {
      return contrast ? TOKENS.shadowAccessibilityContrast : TOKENS.shadowAccessibilityDefault;
    }
    return contrast ? TOKENS.shadowContrast : TOKENS.shadowDefault;
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-testid={testId}
      onClick={handleClick}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      disabled={disabled}
      className={`flex items-center overflow-clip cursor-pointer ${checked ? 'justify-end' : 'justify-start'} ${disabled ? 'cursor-not-allowed' : ''} ${className}`}
      style={{
        width: TOKENS.width,
        height: TOKENS.height,
        paddingLeft: TOKENS.paddingInlineStart,
        paddingRight: TOKENS.paddingInlineEnd,
        paddingTop: TOKENS.paddingBlock,
        paddingBottom: TOKENS.paddingBlock,
        borderRadius: TOKENS.borderRadii,
        backgroundColor: getTrackBackground(),
        borderWidth: disabled ? 0 : 1,
        borderStyle: 'solid',
        borderColor: getTrackBorder(),
      }}
    >
      <span
        className="flex items-center justify-center shrink-0 overflow-clip"
        aria-hidden="true"
        style={{
          width: checked ? TOKENS.toggleWidthOn : TOKENS.toggleWidthOff,
          height: checked ? TOKENS.toggleHeightOn : TOKENS.toggleHeightOff,
          borderRadius: TOKENS.toggleBorderRadii,
          backgroundColor: getToggleBackground(),
          boxShadow: getToggleShadow(),
        }}
      >
        {checked && !disabled && (
          <img
            alt=""
            src={contrast ? iconSwitchCheckContrast : iconSwitchCheckDefault}
            style={{
              width: TOKENS.iconSize,
              height: TOKENS.iconSize,
            }}
          />
        )}
      </span>
    </button>
  );
}
