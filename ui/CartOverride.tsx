import React from 'react';
import { FieldInput } from './FieldInput';
import { FieldRadioGroup } from './FieldRadioGroup';
import { FieldSelect } from './FieldSelect';
import { FieldSwitch } from './FieldSwitch';
import { FieldTextarea } from './FieldTextarea';

const iconEdit = '/icons/edit.svg';

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

const modeOptions = [
  { value: 'fixed', label: 'Fixed' },
  { value: 'percentage', label: 'Percentage' },
];

export function CartOverrideModule({ config }: CartOverrideModuleProps) {
  const isDisabled = Boolean(config.disabled);

  return (
    <div className="rounded-[var(--dimensions-radii)] bg-[var(--palette-neutral-75)] px-[var(--space-4)] py-[var(--override/padding-block)]">
      <div className="flex flex-col gap-[var(--space-4)]">
        <div className="flex items-center gap-[var(--space-4)]">
          <span
            className="flex shrink-0 items-center justify-center overflow-hidden"
            style={{
              width: 'var(--icon-dimension-width-base)',
              height: 'var(--icon-dimension-height-base)',
            }}
            aria-hidden="true"
          >
            <img alt="" className="block h-full w-full" src={iconEdit} />
          </span>
          <div className="flex-1">
            <p className="text-[length:var(--size-small)] font-[var(--weight-semibold)] leading-[var(--leading-small)] text-[var(--text-main-default)]">
              Override reservation value
            </p>
            <p className="text-[length:var(--size-caption)] leading-[var(--leading-caption)] text-[var(--text-subtle-default)]">
              Set a custom value for this reservation.
            </p>
          </div>
          <FieldSwitch
            checked={config.enabled}
            onChange={() => config.onToggle()}
            disabled={isDisabled}
          />
        </div>

        {config.enabled && (
          <>
            <FieldRadioGroup
              value={config.mode}
              onChange={(value) => config.onModeChange(value as 'fixed' | 'percentage')}
              options={modeOptions}
              disabled={isDisabled}
              className="grid grid-cols-2 gap-[var(--space-4)]"
            />

            <p className="text-[length:var(--size-caption)] leading-[var(--leading-caption)] text-[var(--text-subtle-default)]">
              Modify the price by adding, reducing, or setting a final value.
            </p>

            <div className="grid grid-cols-[var(--override/action-width)_1fr] gap-[var(--override/controls-gap)]">
              <div className="w-[var(--override/action-width)]">
                <FieldSelect
                  placeholder="Reduce"
                  value={config.action}
                  onChange={(value) => config.onActionChange(value as 'add' | 'reduce' | 'set_final')}
                  options={actionOptions}
                  disabled={isDisabled}
                />
              </div>
              <FieldInput
                type="number"
                placeholder="$ Amount"
                value={config.amount}
                onChange={(event) => config.onAmountChange(event.target.value)}
                disabled={isDisabled}
                error={config.errors?.amount}
                aria-label="$ Amount"
              />
            </div>

            <FieldTextarea
              placeholder="Concept"
              value={config.concept}
              onChange={(event) => config.onConceptChange(event.target.value)}
              disabled={isDisabled}
              error={config.errors?.concept}
              aria-label="Concept"
            />
          </>
        )}
      </div>
    </div>
  );
}
