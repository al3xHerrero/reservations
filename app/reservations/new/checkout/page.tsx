'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Cart, Sidebar, Alert, IconCreditCard, IconLock, ToastAlert } from '@/ui';
import type { CartDateGroup, CartBreakdown } from '@/ui';
import { useReservationWizard } from '@/contexts/ReservationWizardContext';
import { EVENT_PROFILES } from '@/domain/mockReservations';
import EventInfoCard from '../components/EventInfoCard';
import CheckoutSkeleton from '../components/CheckoutSkeleton';

// Payment method type
type PaymentMethod = 'bank_card' | 'send_payment_link' | 'business_balance' | 'pay_at_box_office' | 'mark_as_paid' | 'pay_later';

const PAYMENT_DESCRIPTIONS: Record<PaymentMethod, string | null> = {
  bank_card: null,
  send_payment_link: 'Send a secure payment link to the customer.',
  business_balance: 'Use the available business balance to pay for this reservation. The total amount will be automatically deducted from the account balance.',
  pay_at_box_office: null,
  mark_as_paid: null,
  pay_later: null,
};

const BUSINESS_BALANCE_AMOUNT = 2332.25;

const PRIMARY_ACTION_LABELS: Record<PaymentMethod, string> = {
  bank_card: 'Pay',
  send_payment_link: 'Send payment link',
  business_balance: 'Pay with balance',
  pay_at_box_office: 'Mark as paid',
  mark_as_paid: 'Mark as paid',
  pay_later: 'Pay later',
};

export default function CheckoutPage() {
  const router = useRouter();
  const {
    state,
    checkoutTransitionRequested,
    showSuccessAlertOnCheckout,
    consumeCheckoutTransition,
  } = useReservationWizard();
  
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const primaryActionLabel = PRIMARY_ACTION_LABELS[paymentMethod] ?? 'Pay';
  const formattedBalance = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(BUSINESS_BALANCE_AMOUNT),
    []
  );
  
  // Cart state
  const [showOriginalPrices, setShowOriginalPrices] = useState(true);
  const [isBreakdownExpanded, setIsBreakdownExpanded] = useState(true);
  const [isShowingCheckoutSkeleton, setIsShowingCheckoutSkeleton] = useState(checkoutTransitionRequested);
  const [isSuccessAlertVisible, setIsSuccessAlertVisible] = useState(false);
  
  // Generate reservation ID
  const reservationId = useMemo(() => `L34Q0X2R2`, []);

  // Calculate totals
  const cartTotal = useMemo(() => {
    return state.selectedTickets.reduce(
      (sum, ticket) => sum + ticket.price * ticket.quantity,
      0
    );
  }, [state.selectedTickets]);

  const calculateFinalTotal = () => {
    let total = cartTotal;
    if (state.override?.enabled && state.override.value) {
      const value = state.override.value;
      if (state.override.mode === 'fixed') {
        if (state.override.action === 'add') total += value;
        else if (state.override.action === 'reduce') total -= value;
        else if (state.override.action === 'set_final') total = value;
      } else {
        if (state.override.action === 'add') total += (total * value) / 100;
        else if (state.override.action === 'reduce') total -= (total * value) / 100;
        else if (state.override.action === 'set_final') total = (total * value) / 100;
      }
    }
    return Math.max(0, total);
  };

  const finalTotal = useMemo(() => calculateFinalTotal(), [cartTotal, state.override]);

  // Format date for cart
  const cartDateLabel = state.selectedDateTime
    ? new Date(state.selectedDateTime).toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).replace(',', '')
    : '8 Aug 2025 10:00';

  // Build cart date groups
  const hasOverride = state.override?.enabled && state.override.value;
  
  const cartDateGroups: CartDateGroup[] = useMemo(() => {
    if (state.selectedTickets.length === 0) {
      // Demo data when no tickets selected
      return [{
        date: cartDateLabel,
        items: [
          {
            id: '1',
            quantity: 2,
            title: 'Fanstand | 3-Day Pass (August 8 - 10)',
            price: 1253.82,
            originalPrice: 1350.00,
            feePerTicket: 38.12,
            feeTotal: 76.24,
          },
          {
            id: '2',
            quantity: 2,
            title: 'Fanstand | 3-Day Pass (August 8 - 10)',
            price: 1253.82,
            originalPrice: 1350.00,
            feePerTicket: 38.12,
            feeTotal: 76.24,
          },
        ],
      }];
    }

    return [{
      date: cartDateLabel,
      items: state.selectedTickets.map((ticket) => ({
        id: ticket.ticketTypeId,
        quantity: ticket.quantity,
        title: `Fanstand | ${ticket.title}`,
        price: ticket.price * ticket.quantity,
        originalPrice: hasOverride ? ticket.price * ticket.quantity * 1.08 : undefined,
        feePerTicket: 38.12,
        feeTotal: 38.12 * ticket.quantity,
      })),
    }];
  }, [state.selectedTickets, cartDateLabel, hasOverride]);

  // Build breakdown
  const breakdown: CartBreakdown = useMemo(() => {
    const reservationValue = 2297.47;
    const overrideValue = -100.00;
    const outstandingAmount = 2197.47;

    return {
      reservationValue: reservationValue,
      override: {
        label: 'Override price',
        value: overrideValue,
        description: '"Comp. Tickets for HR department."',
      },
      totalToPay: outstandingAmount,
      totalLabel: 'Outstanding amount',
      isExpanded: isBreakdownExpanded,
      onToggleExpanded: () => setIsBreakdownExpanded((prev) => !prev),
    };
  }, [isBreakdownExpanded]);

  // Payment method options
  const paymentMethods: { id: PaymentMethod; label: string }[] = [
    { id: 'bank_card', label: 'Bank card' },
    { id: 'send_payment_link', label: 'Send payment link' },
    { id: 'business_balance', label: 'Business balance' },
    { id: 'pay_at_box_office', label: 'Pay at Box Office' },
    { id: 'mark_as_paid', label: 'Mark as paid' },
    { id: 'pay_later', label: 'Pay later' },
  ];

  const handlePayment = () => {
    // TODO: Implement actual payment logic
    router.push(`/reservations/${reservationId}`);
  };

  useEffect(() => {
    if (!checkoutTransitionRequested) {
      return;
    }

    setIsShowingCheckoutSkeleton(true);
    let alertTimer: ReturnType<typeof setTimeout> | undefined;
    const skeletonTimer = setTimeout(() => {
      setIsShowingCheckoutSkeleton(false);
      consumeCheckoutTransition();
      // Only show alert if showSuccessAlertOnCheckout is true (new reservation from contact)
      if (showSuccessAlertOnCheckout) {
        setIsSuccessAlertVisible(true);
        alertTimer = setTimeout(() => {
          setIsSuccessAlertVisible(false);
        }, 3000);
      }
    }, 1500);

    return () => {
      clearTimeout(skeletonTimer);
      if (alertTimer) {
        clearTimeout(alertTimer);
      }
    };
  }, [checkoutTransitionRequested, consumeCheckoutTransition, showSuccessAlertOnCheckout]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeItem="reservations" activeChild="overview" />

      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--palette-neutral-50)' }}>
          {/* Hero Header */}
          <div style={{ backgroundColor: 'var(--palette-neutral-700)', padding: 'var(--space-6)', marginTop: '40px' }}>
            <p style={{ fontSize: '14px', color: 'var(--palette-neutral-white)', marginBottom: '4px' }}>
              <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => router.push('/reservations')}>Overview</span>
              <span style={{ color: 'var(--text-secondary-on-dark)' }}> / {reservationId}</span>
            </p>
            <h1 style={{ fontSize: 'var(--size-h2)', lineHeight: 'var(--leading-h2)', fontWeight: 'var(--weight-semibold)', color: 'var(--palette-neutral-white)', fontFamily: 'var(--font-body)', margin: 0 }}>
              Make a reservation
            </h1>
          </div>

          {/* Content */}
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{ maxWidth: '1136px', display: 'flex', gap: '24px' }}>
              {/* Left Column */}
              <div style={{ width: '400px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <EventInfoCard
                  title={state.selectedEvent?.name}
                  venue={state.selectedEvent?.venue}
                  address={state.selectedEvent?.address}
                  thumbnail={state.selectedEvent?.thumbnail}
                  fallbackName="LIV Golf Chicago 2025 - General Admission"
                  fallbackVenue="Bolingbrook Golf Club"
                  fallbackAddress="1220 Rowell Rd, Bolingbrook, IL"
                  fallbackThumbnail={EVENT_PROFILES[0].thumbnail}
                />

                {/* Cart Component - SAME AS OTHER PAGES */}
                <Cart
                  title="Purchase details"
                  collapsible={true}
                  defaultCollapsed={false}
                  showOriginalPricesCheckbox={true}
                  originalPricesChecked={showOriginalPrices}
                  onOriginalPricesChange={setShowOriginalPrices}
                  dateGroups={cartDateGroups}
                  breakdown={breakdown}
                />

                {/* Promo Code Card */}
                <div
                  style={{
                    backgroundColor: 'var(--background-main-default)',
                    border: '1px solid var(--border-main-default)',
                    borderRadius: '8px',
                    padding: 'var(--space-6)',
                    marginTop: 'var(--space-4)',
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main-default)', margin: 0 }}>Promo code</h3>
                </div>
              </div>

              {/* Right Column */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div
                  style={{
                    backgroundColor: 'var(--background-main-default)',
                    border: '1px solid var(--border-main-default)',
                    borderRadius: '16px',
                    padding: 'var(--space-6)',
                    gap: 'var(--space-4)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {isShowingCheckoutSkeleton ? (
                    <CheckoutSkeleton />
                  ) : (
                    <>
                      <Alert
                      title="Please complete the payment to avoid cancellations."
                      description={
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '20px', gap: '4px' }}>
                          <span>
                            <span style={{ fontWeight: 600 }}>Payment deadline:</span> (Event time) Tue, 04 Nov 2025, 10:59 AM (UTC+11).
                          </span>
                          <span>
                            <span style={{ fontWeight: 600 }}>Time left:</span> 3d 4h 3m
                          </span>
                        </div>
                      }
                      sentiment="warning"
                      showCloseButton={false}
                      titleWeight={400}
                    />

                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main-default)', margin: '0 0 var(--space-4) 0' }}>
                      Select your payment method
                    </h3>

                    {/* Payment Method Options */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px' }}>
                      {paymentMethods.map((method) => {
                        const isSelected = paymentMethod === method.id;
                        return (
                          <label
                            key={method.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              padding: '10px 14px',
                              height: '72px',
                              border: `${isSelected ? 2 : 1}px solid ${isSelected ? 'var(--action-border-primary-default, #0079ca)' : 'var(--border-main-default)'}`,
                              borderRadius: '12px',
                              cursor: 'pointer',
                              backgroundColor: 'white',
                              fontSize: '14px',
                              color: 'var(--text-main-default)',
                              gap: '12px',
                              boxSizing: 'border-box',
                            }}
                          >
                            <div
                              style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '999px',
                                border: `2px solid ${isSelected ? 'var(--action-border-primary-default, #0079ca)' : 'var(--border-main-default)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxSizing: 'border-box',
                              }}
                            >
                              {isSelected && (
                                <div
                                  style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '999px',
                                    backgroundColor: 'var(--action-border-primary-default, #0079ca)',
                                  }}
                                />
                              )}
                            </div>

                            <span
                              style={{
                                fontFamily: 'var(--stack/body, "Montserrat:Bold", sans-serif)',
                                fontWeight: 600,
                                lineHeight: 'var(--leading/h6, 18px)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: 1,
                              }}
                            >
                              {method.label}
                            </span>

                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.id}
                              checked={isSelected}
                              onChange={() => setPaymentMethod(method.id)}
                              style={{ display: 'none' }}
                            />
                          </label>
                        );
                      })}
                    </div>

                    {paymentMethod === 'bank_card' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        <p style={{ fontSize: '14px', color: 'var(--text-main-default)', margin: 0 }}>
                          Enter your card details below to complete the payment.
                        </p>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main-default)', margin: 0 }}>Card number</p>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid var(--border-main-default)',
                            borderRadius: '12px',
                            padding: '0 16px',
                            height: '48px',
                            gap: '16px',
                          }}
                        >
                          <IconCreditCard size={20} color="var(--text-subtle-default)" />
                          <input
                            type="text"
                            placeholder="0000 0000 0000 0000"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            style={{
                              flex: 1,
                              border: 'none',
                              outline: 'none',
                              fontSize: '16px',
                              letterSpacing: '2px',
                              color: 'var(--text-main-default)',
                              backgroundColor: 'transparent',
                            }}
                          />
                          <span style={{ fontSize: '14px', color: 'var(--text-subtle-default)' }}>12 / 25</span>
                          <span style={{ fontSize: '14px', color: 'var(--text-subtle-default)' }}>000</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '32px', height: '20px', backgroundColor: '#1a1f71', borderRadius: '3px' }} />
                          <div style={{ width: '32px', height: '20px', backgroundColor: '#eb001b', borderRadius: '3px' }} />
                          <div style={{ width: '32px', height: '20px', backgroundColor: '#016fd0', borderRadius: '3px' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <IconLock size={12} />
                          <span style={{ fontSize: '12px', color: 'var(--text-subtle-default)' }}>Your payment info is stored securely</span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--action-text-primary-default)' }}>
                          <a href="#" style={{ textDecoration: 'underline' }}>Terms and conditions of use</a>
                          <a href="#" style={{ textDecoration: 'underline' }}>Privacy policy</a>
                        </div>
                      </div>
                    )}

                    {paymentMethod !== 'bank_card' && PAYMENT_DESCRIPTIONS[paymentMethod] && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: '14px',
                          color: '#0b2b3f',
                          fontWeight: 400,
                        }}
                      >
                        {PAYMENT_DESCRIPTIONS[paymentMethod]}
                      </p>
                    )}

                    {paymentMethod === 'business_balance' && (
                      <div
                        style={{
                          backgroundColor: '#f4f6fb',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          border: '1px solid #ccd2d8',
                          marginTop: 'var(--space-3)',
                        }}
                      >
                        <p style={{ fontSize: '12px', color: '#536b75', margin: 0 }}>Business available balance</p>
                        <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main-default)', margin: '4px 0 0' }}>
                          {formattedBalance}
                        </p>
                      </div>
                    )}

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: 'var(--space-4)' }}>
                        <Button
                          variant="secondary"
                          size="lg"
                          onClick={() => router.push(`/reservations/${reservationId}`)}
                        >
                          Pay later & continue
                        </Button>
                        <Button variant="primary" size="lg" onClick={handlePayment}>
                          {primaryActionLabel}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer style={{ backgroundColor: 'var(--palette-neutral-700)', padding: '32px 28px', marginTop: 'auto' }}>
            <div style={{ maxWidth: '1136px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <span style={{ fontSize: '32px', fontWeight: 700, color: 'white', fontStyle: 'italic' }}>fever</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '96px', marginBottom: '24px' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: '0 0 8px 0' }}>How fever works</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary-on-dark)', margin: '0 0 4px 0' }}>How to view the status of my plans</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary-on-dark)', margin: '0 0 4px 0' }}>Billing Manual</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary-on-dark)', margin: 0 }}>How to validate tickets</p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: '0 0 8px 0' }}>Support Contact</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary-on-dark)', margin: '0 0 4px 0' }}>+34 911 87 66 36</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary-on-dark)', margin: '0 0 4px 0' }}>Monday to Friday (09:30 to 18:30)</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary-on-dark)', margin: 0 }}>Send us a message</p>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--text-secondary-on-dark)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary-on-dark)' }}>©2019 - Fever l Made in Madrid & NYC</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary-on-dark)' }}>v 0.00001</span>
              </div>
            </div>
          </footer>
        </main>
        <ToastAlert
          title="Reservation created successfully"
          sentiment="positive"
          visible={isSuccessAlertVisible}
          onClose={() => setIsSuccessAlertVisible(false)}
          autoDismissMs={3000}
        />
      </div>
    </div>
  );
}
