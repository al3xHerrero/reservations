'use client';

import React from 'react';
import { FieldInput } from './FieldInput';
import { FieldSelect } from './FieldSelect';
import { FieldSwitch } from './FieldSwitch';
import { FieldTextarea } from './FieldTextarea';
import { IconOverride } from './Icons';

// Design tokens
const TOKENS = {
  container: {
    background: '#f6f7f7', // palette/neutral/75
    borderRadius: '8px',
    paddingInline: '16px',
    paddingBlock: '12px',
    gap: '16px',
  },
  header: {
    gap: '16px',
  },
  fieldset: {
    padding: '16px 12px',
    borderRadius: '8px',
    gap: '16px',
    borderDefault: '2px solid #ccd2d8',
    borderSelected: '2px solid #0079ca',
    background: '#ffffff',
  },
  controls: {
    actionWidth: '168px',
    gap: '9px',
  },
  typography: {
    title: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 600,
      color: '#031419',
    },
    description: {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: 400,
      color: '#536b75',
    },
    label: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 600,
      color: '#031419',
    },
  },
  radio: {
    size: '16px',
    activeBackground: '#0089e3',
    inactiveBackground: '#ffffff',
    inactiveBorder: '#ccd2d8',
    dotColor: '#ffffff',
  },
};

export type CartOverrideErrors = {
  amount?: string;
  concept?: string;
};

export type CartOverrideConfig = {
  enabled: boolean;
  onToggle: () => void;
  mode: 'fixed' | 'percentage';
  onModeChange: (mode: 'fixed' | 'percentage') => void;
  action: 'add' | 'reduce' | 'set_final';
  onActionChange: (action: 'add' | 'reduce' | 'set_final') => void;
  amount: string;
  onAmountChange: (value: string) => void;
  concept: string;
  onConceptChange: (value: string) => void;
  disabled?: boolean;
  errors?: CartOverrideErrors;
};

interface CartOverrideModuleProps {
  config: CartOverrideConfig;
}

const actionOptions = [
  { value: 'add', label: 'Add' },
  { value: 'reduce', label: 'Reduce' },
  { value: 'set_final', label: 'Set final value' },
];

// Radio button component for fieldset style
const FieldsetRadio = ({
  selected,
  label,
  onClick,
  disabled,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: TOKENS.fieldset.gap,
      padding: TOKENS.fieldset.padding,
      borderRadius: TOKENS.fieldset.borderRadius,
      border: selected ? TOKENS.fieldset.borderSelected : TOKENS.fieldset.borderDefault,
      background: TOKENS.fieldset.background,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
    }}
  >
    {/* Radio input */}
    <span
      style={{
        width: TOKENS.radio.size,
        height: TOKENS.radio.size,
        borderRadius: '64px',
        background: selected ? TOKENS.radio.activeBackground : TOKENS.radio.inactiveBackground,
        border: selected ? 'none' : `1px solid ${TOKENS.radio.inactiveBorder}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {selected && (
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: TOKENS.radio.dotColor,
          }}
        />
      )}
    </span>
    {/* Label */}
    <span
      style={{
        flex: 1,
        fontSize: TOKENS.typography.label.fontSize,
        lineHeight: TOKENS.typography.label.lineHeight,
        fontWeight: TOKENS.typography.label.fontWeight,
        color: TOKENS.typography.label.color,
        textAlign: 'left',
      }}
    >
      {label}
    </span>
  </button>
);

export function CartOverrideModule({ config }: CartOverrideModuleProps) {
  const isDisabled = Boolean(config.disabled);

  return (
    <div
      style={{
        background: TOKENS.container.background,
        borderRadius: TOKENS.container.borderRadius,
        padding: `${TOKENS.container.paddingBlock} ${TOKENS.container.paddingInline}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: TOKENS.container.gap,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: TOKENS.header.gap,
          }}
        >
          <span style={{ flexShrink: 0 }}>
            <IconOverride size={20} color="#06232C" />
          </span>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: TOKENS.typography.title.fontSize,
                lineHeight: TOKENS.typography.title.lineHeight,
                fontWeight: TOKENS.typography.title.fontWeight,
                color: TOKENS.typography.title.color,
                margin: 0,
              }}
            >
              Override booking price
            </p>
            <p
              style={{
                fontSize: TOKENS.typography.description.fontSize,
                lineHeight: TOKENS.typography.description.lineHeight,
                fontWeight: TOKENS.typography.description.fontWeight,
                color: TOKENS.typography.description.color,
                margin: 0,
              }}
            >
              Set a custom value for this reservation.
            </p>
          </div>
          <FieldSwitch
            checked={config.enabled}
            onChange={() => config.onToggle()}
            disabled={isDisabled}
          />
        </div>

        {/* Expanded content - with smooth transition */}
        <div
          style={{
            display: 'grid',
            gridTemplateRows: config.enabled ? '1fr' : '0fr',
            opacity: config.enabled ? 1 : 0,
            transition: 'grid-template-rows 0.25s ease-out, opacity 0.2s ease-out',
          }}
        >
          <div style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: TOKENS.container.gap }}>
              {/* Mode selection: Fixed / Percentage */}
              <div style={{ display: 'flex', gap: TOKENS.container.gap }}>
                <FieldsetRadio
                  selected={config.mode === 'fixed'}
                  label="Fixed"
                  onClick={() => config.onModeChange('fixed')}
                  disabled={isDisabled}
                />
                <FieldsetRadio
                  selected={config.mode === 'percentage'}
                  label="Percentage"
                  onClick={() => config.onModeChange('percentage')}
                  disabled={isDisabled}
                />
              </div>

              {/* Description text */}
              <p
                style={{
                  fontSize: TOKENS.typography.description.fontSize,
                  lineHeight: TOKENS.typography.description.lineHeight,
                  fontWeight: TOKENS.typography.description.fontWeight,
                  color: TOKENS.typography.description.color,
                  margin: 0,
                }}
              >
                Modify the price by adding, reducing, or setting a final value.
              </p>

              {/* Controls: Action select + Amount input */}
              <div
                style={{
                  display: 'flex',
                  gap: TOKENS.controls.gap,
                  alignItems: 'center',
                }}
              >
                <div style={{ width: TOKENS.controls.actionWidth, flexShrink: 0 }}>
                  <FieldSelect
                    value={config.action}
                    onChange={(value) => config.onActionChange(value as 'add' | 'reduce' | 'set_final')}
                    options={actionOptions}
                    disabled={isDisabled}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <FieldInput
                    label={config.mode === 'percentage' ? '% Amount' : '$ Amount'}
                    type="number"
                    value={config.amount}
                    onChange={(event) => config.onAmountChange(event.target.value)}
                    disabled={isDisabled}
                    error={config.errors?.amount}
                  />
                </div>
              </div>

              {/* Concept textarea */}
              <div style={{ marginTop: config.errors?.amount ? '16px' : undefined }}>
                <FieldTextarea
                  label="Concept"
                  value={config.concept}
                  onChange={(event) => config.onConceptChange(event.target.value)}
                  disabled={isDisabled}
                  error={config.errors?.concept}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
