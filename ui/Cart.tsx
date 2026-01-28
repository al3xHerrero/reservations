import React from 'react';
import { CartOverrideModule, CartOverrideConfig } from './CartOverride';
import { FieldSwitch } from './FieldSwitch';
import { FieldCheckbox } from './FieldCheckbox';

const iconChevron = '/icons/chevron-down.svg';
const iconCalendar = '/icons/calendar.svg';
const iconEdit = '/icons/edit.svg';
const iconWarning = '/icons/warning.svg';

export type CartItem = {
  id: string;
  quantity: number;
  title: string;
  price: number;
  feePerTicket?: number;
  feeTotal?: number;
};

export type CartBreakdown = {
  reservationValue: number;
  reservationValueDetail?: { label: string; value: number };
  override?: { label: string; value: number; note?: string; noteValue?: number };
  outstandingAmount?: number;
  outstandingLabel?: string;
  breakdownLinkLabel?: string;
};

export type { CartOverrideConfig } from './CartOverride';

export interface CartProps {
  title: string;
  dateLabel?: string;
  items: CartItem[];
  emptyState?: { title: string; description: string };
  showOriginalPricesCheckbox?: boolean;
  originalPricesChecked?: boolean;
  onOriginalPricesChange?: (checked: boolean) => void;
  showOverrideModule?: boolean;
  overrideEnabled?: boolean;
  onOverrideToggle?: () => void;
  overrideConfig?: CartOverrideConfig;
  breakdown?: CartBreakdown;
  totalLabel?: string;
  totalAmount?: number;
}

const formatMoney = (amount: number) =>
  amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export function Cart({
  title,
  dateLabel,
  items,
  emptyState,
  showOriginalPricesCheckbox = false,
  originalPricesChecked = false,
  onOriginalPricesChange,
  showOverrideModule = false,
  overrideEnabled = false,
  onOverrideToggle,
  overrideConfig,
  breakdown,
  totalLabel,
  totalAmount,
}: CartProps) {
  const hasItems = items.length > 0;
  const isCheckboxControlled = typeof onOriginalPricesChange === 'function';

  return (
    <div
      className="space-y-[var(--space-4)]"
      style={{
        padding: 'var(--space-4)',
        borderRadius: 'var(--card/dimensions/radii)',
        backgroundColor: 'var(--card/color/bg/default)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--card/color/border/default)',
      }}
    >
      <div className="flex items-center justify-between pb-2">
        <p className="text-[length:var(--font-h4-size)] font-[var(--weight-semibold)] leading-[var(--font-h4-line-height)] text-[var(--text/main/default)]">
          {title}
        </p>
        <img alt="" className="h-2 w-4 rotate-180" src={iconChevron} />
      </div>

      {showOriginalPricesCheckbox && (
        <FieldCheckbox
          className="w-full justify-end"
          checked={originalPricesChecked}
          onChange={(checked) => onOriginalPricesChange?.(checked)}
          label="Show original prices"
          disabled={!isCheckboxControlled}
        />
      )}

      {!hasItems && emptyState && (
        <div
          className="text-center"
          style={{
            borderRadius: 'var(--card/dimensions/radii)',
            backgroundColor: 'var(--card/color/bg/default)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--card/color/border/default)',
            paddingInline: 'var(--space-4)',
            paddingBlock: 'var(--shell/dimensions/padding)',
          }}
        >
          <div
            className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full"
            style={{
              backgroundColor: 'var(--palette/neutral/75)',
              color: 'var(--text/subtle/default)',
            }}
          >
            <span className="text-[length:var(--font-h4-size)]">≡</span>
          </div>
          <p className="text-[length:var(--size-small)] font-[var(--weight-semibold)] leading-[var(--leading-small)] text-[var(--text/main/default)]">
            {emptyState.title}
          </p>
          <p className="text-[length:var(--size-caption)] leading-[var(--leading-caption)] text-[var(--text/subtle/default)]">
            {emptyState.description}
          </p>
        </div>
      )}

      {hasItems && (
        <div className="space-y-[var(--space-4)]">
          {dateLabel && (
            <div
              className="inline-flex items-center gap-2 text-[length:var(--size-small)] font-[var(--weight-semibold)] leading-[var(--leading-small)]"
              style={{
                backgroundColor: 'var(--banner/color/bg/info)',
                color: 'var(--text/main/default)',
                paddingInline: 'var(--space-2)',
                paddingBlock: 'var(--space-1)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <img alt="" className="h-4 w-4" src={iconCalendar} />
              <span>{dateLabel}</span>
            </div>
          )}

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-start gap-2 text-[length:var(--size-small)] leading-[var(--leading-small)] text-[var(--text/main/default)]">
                  <span className="text-[length:var(--size-base)] font-[var(--weight-semibold)] leading-[var(--leading-base)]">
                    {item.quantity}x
                  </span>
                  <span className="flex-1">{item.title}</span>
                  <span className="text-right">{formatMoney(item.price)}</span>
                </div>
                {typeof item.feePerTicket === 'number' && (
                  <div className="flex items-center justify-between pl-7 text-[length:var(--size-caption)] leading-[var(--leading-caption)] text-[var(--text/subtle/default)]">
                    <span>Booking fee per ticket: {formatMoney(item.feePerTicket)}</span>
                    {typeof item.feeTotal === 'number' && <span>{formatMoney(item.feeTotal)}</span>}
                  </div>
                )}
                {index < items.length - 1 && (
                  <div
                    className="border-t border-dashed"
                    style={{ borderColor: 'var(--card/color/border/default)' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {overrideConfig && <CartOverrideModule config={overrideConfig} />}

      {!overrideConfig && showOverrideModule && (
        <div
          className="px-[var(--space-4)] py-[var(--override/padding-block)]"
          style={{
            borderRadius: 'var(--dimensions-radii)',
            backgroundColor: 'var(--palette/neutral/75)',
          }}
        >
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
              <p className="text-[length:var(--size-small)] font-[var(--weight-semibold)] leading-[var(--leading-small)] text-[var(--text/main/default)]">
                Override reservation value
              </p>
              <p className="text-[length:var(--size-caption)] leading-[var(--leading-caption)] text-[var(--text/subtle/default)]">
                Set a custom value for this reservation.
              </p>
            </div>
            <FieldSwitch
              checked={overrideEnabled}
              onChange={(checked) => {
                if (checked !== overrideEnabled) onOverrideToggle?.();
              }}
            />
          </div>
        </div>
      )}

      {(typeof totalAmount === 'number' || breakdown) && (
        <div style={{ borderTopWidth: '1px', borderTopStyle: 'solid', borderTopColor: 'var(--card/color/border/default)' }} />
      )}

      {typeof totalAmount === 'number' && (
        <div className="flex items-center justify-between pt-3 text-[length:var(--size-small)] font-[var(--weight-semibold)] leading-[var(--leading-small)] text-[var(--text/main/default)]">
          <span>{totalLabel ?? 'Total to pay'}</span>
          <span className="text-[length:var(--size-base)] leading-[var(--leading-base)]">
            {formatMoney(totalAmount)}
          </span>
        </div>
      )}

      {breakdown && (
        <div className="space-y-3 text-[length:var(--size-small)] leading-[var(--leading-small)] text-[var(--text/main/default)]">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Reservation value</span>
              <span>{formatMoney(breakdown.reservationValue)}</span>
            </div>
            {breakdown.reservationValueDetail && (
              <div className="flex justify-between text-[length:var(--size-caption)] leading-[var(--leading-caption)] text-[var(--text/subtle/default)]">
                <span>{breakdown.reservationValueDetail.label}</span>
                <span>{formatMoney(breakdown.reservationValueDetail.value)}</span>
              </div>
            )}
          </div>

          {breakdown.override && (
            <div
              className="space-y-1 border-t border-dashed pt-3"
              style={{ borderColor: 'var(--card/color/border/default)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded"
                    style={{ backgroundColor: 'var(--banner/color/bg/warning)' }}
                  >
                    <img alt="" className="h-3 w-3" src={iconWarning} />
                  </span>
                  <span>{breakdown.override.label}</span>
                </div>
                <span>{formatMoney(breakdown.override.value)}</span>
              </div>
              {breakdown.override.note && (
                <div className="flex justify-between text-[length:var(--size-caption)] italic leading-[var(--leading-caption)] text-[var(--text/subtle/default)]">
                  <span>{breakdown.override.note}</span>
                  {typeof breakdown.override.noteValue === 'number' && (
                    <span>{formatMoney(breakdown.override.noteValue)}</span>
                  )}
                </div>
              )}
            </div>
          )}

          {typeof breakdown.outstandingAmount === 'number' && (
            <div
              className="border-t pt-3"
              style={{ borderColor: 'var(--card/color/border/default)' }}
            >
              <div className="flex items-center justify-between font-[var(--weight-semibold)]">
                <span>{breakdown.outstandingLabel ?? 'Outstanding amount'}</span>
                <span className="text-[length:var(--size-base)] leading-[var(--leading-base)]">
                  {formatMoney(breakdown.outstandingAmount)}
                </span>
              </div>
              {breakdown.breakdownLinkLabel && (
                <div className="flex justify-end">
                  <span
                    className="text-[length:var(--size-caption)] font-[var(--weight-semibold)] leading-[var(--leading-caption)]"
                    style={{ color: 'var(--link-primary)' }}
                  >
                    {breakdown.breakdownLinkLabel}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
