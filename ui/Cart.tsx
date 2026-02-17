'use client';

import React, { useState } from 'react';
import { CartOverrideModule, CartOverrideConfig } from './CartOverride';
import { FieldCheckbox } from './FieldCheckbox';
import {
  IconChevronUp,
  IconChevronDown,
  IconCalendar,
  IconTriangleExclamation,
  IconList,
} from './Icons';

// Types
export type CartItem = {
  id: string;
  quantity: number;
  title: string;
  /** Current price (with override applied if enabled) */
  price: number;
  /** Original price before override (shown strikethrough when "Show original prices" is checked) */
  originalPrice?: number;
  /** Current fee per ticket (with override applied) */
  feePerTicket?: number;
  /** Original fee per ticket before override */
  originalFeePerTicket?: number;
  /** Current total fee (with override applied) */
  feeTotal?: number;
  /** Original total fee before override */
  originalFeeTotal?: number;
};

export type CartDateGroup = {
  date: string;
  items: CartItem[];
};

/** A line item in the breakdown section */
export type BreakdownLine = {
  /** Title of the line (e.g., "Reservation value", "Coupon applied") */
  label: string;
  /** Description shown below the title in gray/italic */
  description?: string;
  /** Value shown on the right */
  value: number;
  /** Whether to show warning icon (for override lines) */
  showWarningIcon?: boolean;
  /** Whether description should be italic */
  descriptionItalic?: boolean;
};

export type CartBreakdown = {
  /** Main reservation value */
  reservationValue: number;
  /** Override line with warning icon */
  override?: {
    label: string;
    value: number;
    /** Description shown in italic below (e.g., concept text) */
    description?: string;
  };
  /** Additional lines (coupons, discounts, etc.) */
  additionalLines?: BreakdownLine[];
  /** Total amount to pay */
  totalToPay: number;
  /** Label for total (default: "Total to pay") */
  totalLabel?: string;
  /** Whether breakdown details are expanded (controlled) */
  isExpanded?: boolean;
  /** Callback when breakdown expansion is toggled */
  onToggleExpanded?: () => void;
};

export type CartEmptyState = {
  title: string;
  description: string;
  hasError?: boolean;
  isFlashing?: boolean;
};

export type { CartOverrideConfig } from './CartOverride';

export interface CartProps {
  /** Title of the cart */
  title?: string;
  /** Whether the cart is collapsible */
  collapsible?: boolean;
  /** Initial collapsed state */
  defaultCollapsed?: boolean;
  /** Show original prices checkbox */
  showOriginalPricesCheckbox?: boolean;
  /** Original prices checked state */
  originalPricesChecked?: boolean;
  /** Callback when original prices checkbox changes */
  onOriginalPricesChange?: (checked: boolean) => void;
  /** Groups of items by date */
  dateGroups?: CartDateGroup[];
  /** Simple items list (legacy support) */
  items?: CartItem[];
  /** Date label for simple items */
  dateLabel?: string;
  /** Empty state configuration */
  emptyState?: CartEmptyState;
  /** Override module configuration */
  overrideConfig?: CartOverrideConfig;
  /** Breakdown configuration */
  breakdown?: CartBreakdown;
  /** Simple total (legacy support) */
  totalLabel?: string;
  /** Simple total amount (legacy support) */
  totalAmount?: number;
  /** Clear all callback */
  onClearAll?: () => void;
}

const formatMoney = (amount: number, currency: string = '$') =>
  `${currency}${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function Cart({
  title = 'Purchase details',
  collapsible = true,
  defaultCollapsed = false,
  showOriginalPricesCheckbox = false,
  originalPricesChecked = false,
  onOriginalPricesChange,
  dateGroups,
  items,
  dateLabel,
  emptyState,
  overrideConfig,
  breakdown,
  totalLabel,
  totalAmount,
  onClearAll,
}: CartProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  // Determine if we have items
  const hasDateGroups = dateGroups && dateGroups.length > 0;
  const hasSimpleItems = items && items.length > 0;
  const hasItems = hasDateGroups || hasSimpleItems;

  // Convert simple items to date group format if needed
  const effectiveDateGroups: CartDateGroup[] = hasDateGroups
    ? dateGroups
    : hasSimpleItems && dateLabel
    ? [{ date: dateLabel, items }]
    : [];

  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--background-main-default)',
        border: '1px solid var(--border-main-default)',
        borderRadius: '8px',
        padding: 'var(--space-4)',
      }}
    >
      {/* Header row: Title + Clear all */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: collapsible ? 'pointer' : 'default',
          paddingBottom: hasItems && onClearAll ? '0' : undefined,
        }}
        onClick={collapsible ? toggleCollapse : undefined}
      >
        <span
          style={{
            fontSize: 'var(--size-h4)',
            lineHeight: 'var(--leading-h4)',
            fontWeight: 'var(--weight-semibold)',
            color: 'var(--text-main-default)',
          }}
        >
          {title}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Clear all link - in header row */}
          {hasItems && onClearAll && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClearAll();
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                lineHeight: '20px',
                color: '#0079ca',
                textDecoration: 'underline',
                padding: 0,
              }}
            >
              Clear all
            </button>
          )}
          {collapsible && (
            <span style={{ color: 'var(--text-main-default)' }}>
              {isCollapsed ? <IconChevronDown size={12} /> : <IconChevronUp size={12} />}
            </span>
          )}
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div style={{ marginTop: 'var(--space-4)' }}>
          {/* Show original prices checkbox - appears when override is enabled OR when breakdown has override */}
          {showOriginalPricesCheckbox && (overrideConfig?.enabled || breakdown?.override) && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-4)' }}>
              <FieldCheckbox
                checked={originalPricesChecked}
                onChange={(checked) => onOriginalPricesChange?.(checked)}
                label="Show original prices"
                disabled={overrideConfig ? !overrideConfig.amount : false}
              />
            </div>
          )}

          {/* Empty State */}
          {!hasItems && emptyState && (
            <div
              style={{
                backgroundColor: 'var(--palette-neutral-50)',
                border: `1px solid ${emptyState.hasError ? 'var(--palette-danger-500)' : 'var(--border-main-default)'}`,
                borderRadius: '8px',
                padding: 'var(--space-6) var(--space-4)',
                textAlign: 'center',
                transition: emptyState.isFlashing ? 'none' : 'border-color 0.3s ease',
                animation: emptyState.isFlashing ? 'cartFlash 0.3s ease' : 'none',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--palette-neutral-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-3)',
                  color: 'var(--text-subtle-default)',
                }}
              >
                <IconList size={20} />
              </div>
              <p
                style={{
                  fontSize: 'var(--size-small)',
                  fontWeight: 'var(--weight-semibold)',
                  color: 'var(--text-main-default)',
                  margin: '0 0 4px 0',
                }}
              >
                {emptyState.title}
              </p>
              <p
                style={{
                  fontSize: 'var(--size-caption)',
                  color: 'var(--text-subtle-default)',
                  margin: 0,
                }}
              >
                {emptyState.description}
              </p>
            </div>
          )}

          {/* Date Groups */}
          {effectiveDateGroups.map((group, groupIndex) => (
            <div key={group.date} style={{ marginBottom: 'var(--space-4)' }}>
              {/* Date Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#e6f4ff',
                  paddingRight: '8px',
                  borderRadius: '4px',
                  marginBottom: 'var(--space-3)',
                  color: 'var(--text-main-default)',
                  height: '24px',
                }}
              >
                <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconCalendar size={16} />
                </div>
                <span
                  style={{
                    fontSize: 'var(--size-small)',
                    fontWeight: 'var(--weight-semibold)',
                  }}
                >
                  {group.date}
                </span>
              </div>

              {/* Items in this group */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {group.items.map((item) => {
                  // Show original prices when checkbox is checked AND there's an override (either via overrideConfig or breakdown)
                  const hasOverride = overrideConfig?.enabled || breakdown?.override;
                  const showOriginal = hasOverride && originalPricesChecked && item.originalPrice !== undefined;
                  
                  return (
                    <div key={item.id}>
                      {/* Main item row */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 'var(--size-base)',
                            fontWeight: 'var(--weight-semibold)',
                            color: 'var(--text-main-default)',
                            minWidth: '24px',
                          }}
                        >
                          {item.quantity}x
                        </span>
                        <span
                          style={{
                            flex: 1,
                            fontSize: 'var(--size-small)',
                            color: 'var(--text-main-default)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            minWidth: 0,
                          }}
                        >
                          {item.title}
                        </span>
                        {/* Original price (strikethrough) when showing originals - with transition */}
                        {item.originalPrice !== undefined && (
                          <span
                            style={{
                              fontSize: 'var(--size-small)',
                              color: '#a7b2ba',
                              textAlign: 'right',
                              textDecoration: 'line-through',
                              opacity: showOriginal ? 1 : 0,
                              maxWidth: showOriginal ? '100px' : '0px',
                              overflow: 'hidden',
                              transition: 'opacity 0.2s ease-out, max-width 0.2s ease-out',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {formatMoney(item.originalPrice)}
                          </span>
                        )}
                        {/* Current price (with override applied) */}
                        <span
                          style={{
                            fontSize: 'var(--size-small)',
                            color: 'var(--text-main-default)',
                            textAlign: 'right',
                          }}
                        >
                          {formatMoney(item.price)}
                        </span>
                      </div>

                      {/* Booking fee row */}
                      {typeof item.feePerTicket === 'number' && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            paddingLeft: '28px',
                            marginTop: '4px',
                          }}
                        >
                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <span
                              style={{
                                fontSize: '12px',
                                lineHeight: '16px',
                                color: '#536b75',
                              }}
                            >
                              Booking fee per ticket:
                            </span>
                            {/* Original fee per ticket (strikethrough) - with transition */}
                            {item.originalFeePerTicket !== undefined && (
                              <span
                                style={{
                                  fontSize: '12px',
                                  lineHeight: '16px',
                                  color: '#a7b2ba',
                                  textDecoration: 'line-through',
                                  marginLeft: showOriginal ? '8px' : '0px',
                                  opacity: showOriginal ? 1 : 0,
                                  maxWidth: showOriginal ? '80px' : '0px',
                                  overflow: 'hidden',
                                  transition: 'opacity 0.2s ease-out, max-width 0.2s ease-out, margin-left 0.2s ease-out',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {formatMoney(item.originalFeePerTicket)}
                              </span>
                            )}
                            <span
                              style={{
                                fontSize: '12px',
                                lineHeight: '16px',
                                color: '#536b75',
                              }}
                            >
                              {formatMoney(item.feePerTicket)}
                            </span>
                          </div>
                          {typeof item.feeTotal === 'number' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {/* Original fee total (strikethrough) - with transition */}
                              {item.originalFeeTotal !== undefined && (
                                <span
                                  style={{
                                    fontSize: '12px',
                                    lineHeight: '16px',
                                    color: '#a7b2ba',
                                    textDecoration: 'line-through',
                                    opacity: showOriginal ? 1 : 0,
                                    maxWidth: showOriginal ? '80px' : '0px',
                                    overflow: 'hidden',
                                    transition: 'opacity 0.2s ease-out, max-width 0.2s ease-out',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {formatMoney(item.originalFeeTotal)}
                                </span>
                              )}
                              <span
                                style={{
                                  fontSize: '12px',
                                  lineHeight: '16px',
                                  color: '#536b75',
                                }}
                              >
                                {formatMoney(item.feeTotal)}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Separator between groups */}
              {groupIndex < effectiveDateGroups.length - 1 && (
                <div
                  style={{
                    borderBottom: '1px dashed var(--border-main-default)',
                    marginTop: 'var(--space-4)',
                  }}
                />
              )}
            </div>
          ))}

          {/* Override Module */}
          {overrideConfig && (
            <div style={{ marginTop: 'var(--space-4)' }}>
              <CartOverrideModule config={overrideConfig} />
            </div>
          )}

          {/* Simple Total (legacy) */}
          {typeof totalAmount === 'number' && !breakdown && (
            <>
              <div
                style={{
                  borderTop: '1px solid var(--border-main-default)',
                  marginTop: 'var(--space-4)',
                  paddingTop: 'var(--space-3)',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--size-small)',
                    fontWeight: 'var(--weight-semibold)',
                    color: 'var(--text-main-default)',
                  }}
                >
                  {totalLabel ?? 'Total'}
                </span>
                <span
                  style={{
                    fontSize: 'var(--size-base)',
                    fontWeight: 'var(--weight-semibold)',
                    color: 'var(--text-main-default)',
                  }}
                >
                  {formatMoney(totalAmount)}
                </span>
              </div>
            </>
          )}

          {/* Breakdown */}
          {breakdown && (
            <div style={{ marginTop: 'var(--space-4)' }}>
              {/* Determine if we have extra breakdown content */}
              {(() => {
                const hasBreakdownContent = breakdown.override || (breakdown.additionalLines && breakdown.additionalLines.length > 0);
                const isExpanded = breakdown.isExpanded ?? true;

                return (
                  <>
                    {/* Breakdown details - animated container */}
                    {hasBreakdownContent && (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateRows: isExpanded ? '1fr' : '0fr',
                          opacity: isExpanded ? 1 : 0,
                          transition: 'grid-template-rows 0.25s ease-out, opacity 0.2s ease-out',
                        }}
                      >
                        <div style={{ overflow: 'hidden' }}>
                          {/* Separator - inside animated container */}
                          <div
                            style={{
                              borderTop: '1px solid var(--border-main-default)',
                              marginBottom: 'var(--space-4)',
                            }}
                          />
                          {/* Reservation Value */}
                          <div style={{ marginBottom: 'var(--space-2)' }}>
                            {/* Main row: title + value */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '12px',
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '14px',
                                  lineHeight: '20px',
                                  color: '#031419',
                                  flex: 1,
                                }}
                              >
                                Reservation value
                              </span>
                              <span
                                style={{
                                  fontSize: '14px',
                                  lineHeight: '20px',
                                  color: '#031419',
                                  textAlign: 'right',
                                }}
                              >
                                {formatMoney(breakdown.reservationValue)}
                              </span>
                            </div>
                            {/* Description row - always shown */}
                            <p
                              style={{
                                fontSize: '12px',
                                lineHeight: '16px',
                                color: '#536b75',
                                margin: '4px 0 0 0',
                              }}
                            >
                              Real value of the chosen tickets
                            </p>
                          </div>

                          {/* Additional Lines (coupons, discounts, etc.) */}
                          {breakdown.additionalLines?.map((line, index) => (
                            <div
                              key={index}
                              style={{
                                marginTop: 'var(--space-2)',
                                paddingTop: 'var(--space-2)',
                                borderTop: '1px dashed var(--border-main-default)',
                              }}
                            >
                              {/* Main row */}
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                }}
                              >
                                {line.showWarningIcon && (
                                  <span
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      width: '20px',
                                      height: '20px',
                                      backgroundColor: '#fff4e6',
                                      borderRadius: '2px',
                                      flexShrink: 0,
                                    }}
                                  >
                                    <IconTriangleExclamation size={12} color="#FFA639" />
                                  </span>
                                )}
                                <span
                                  style={{
                                    fontSize: '14px',
                                    lineHeight: '20px',
                                    color: '#031419',
                                    flex: 1,
                                  }}
                                >
                                  {line.label}
                                </span>
                                <span
                                  style={{
                                    fontSize: '14px',
                                    lineHeight: '20px',
                                    color: '#031419',
                                    textAlign: 'right',
                                  }}
                                >
                                  {line.value < 0 ? '-' : ''}{formatMoney(line.value)}
                                </span>
                              </div>
                              {/* Description row */}
                              {line.description && (
                                <p
                                  style={{
                                    fontSize: '12px',
                                    lineHeight: '16px',
                                    color: '#536b75',
                                    fontStyle: line.descriptionItalic ? 'italic' : 'normal',
                                    margin: '4px 0 0 0',
                                  }}
                                >
                                  {line.description}
                                </p>
                              )}
                            </div>
                          ))}

                          {/* Override Price */}
                          {breakdown.override && (
                            <div
                              style={{
                                marginTop: 'var(--space-3)',
                                paddingTop: 'var(--space-3)',
                                borderTop: '1px dashed var(--border-main-default)',
                              }}
                            >
                              {/* Main row: icon + label + value */}
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                                  {/* Warning icon with background */}
                                  <span
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      width: '20px',
                                      height: '20px',
                                      backgroundColor: '#fff4e6',
                                      borderRadius: '2px',
                                      flexShrink: 0,
                                    }}
                                  >
                                    <IconTriangleExclamation size={12} color="#FFA639" />
                                  </span>
                                  <span
                                    style={{
                                      fontSize: '14px',
                                      lineHeight: '20px',
                                      color: '#031419',
                                    }}
                                  >
                                    {breakdown.override.label}
                                  </span>
                                </div>
                                <span
                                  style={{
                                    fontSize: '14px',
                                    lineHeight: '20px',
                                    color: '#031419',
                                    textAlign: 'right',
                                  }}
                                >
                                  {breakdown.override.value < 0 ? '-' : ''}{formatMoney(breakdown.override.value)}
                                </span>
                              </div>
                              {/* Concept row (italic) */}
                              {breakdown.override.description && (
                                <p
                                  style={{
                                    fontSize: '12px',
                                    lineHeight: '16px',
                                    color: '#536b75',
                                    fontStyle: 'italic',
                                    margin: '4px 0 0 0',
                                  }}
                                >
                                  {breakdown.override.description}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Total to Pay */}
                    <div
                      style={{
                        marginTop: 'var(--space-4)',
                        paddingTop: 'var(--space-4)',
                        borderTop: '1px solid var(--border-main-default)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 'var(--size-small)',
                            fontWeight: 'var(--weight-semibold)',
                            color: 'var(--text-main-default)',
                          }}
                        >
                          {breakdown.totalLabel ?? 'Total to pay'}
                        </span>
                        <span
                          style={{
                            fontSize: '16px',
                            lineHeight: '24px',
                            fontWeight: 600,
                            color: '#031419',
                          }}
                        >
                          {formatMoney(breakdown.totalToPay)}
                        </span>
                      </div>
                      {/* Show/Hide breakdown link - only when there's content to show/hide */}
                      {hasBreakdownContent && breakdown.onToggleExpanded && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              breakdown.onToggleExpanded?.();
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '12px',
                              lineHeight: '16px',
                              color: '#0079ca',
                              fontWeight: 600,
                              padding: 0,
                            }}
                          >
                            {isExpanded ? 'Hide breakdown' : 'Show breakdown'}
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
