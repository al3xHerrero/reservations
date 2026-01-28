'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  AppShell,
  Card,
  Button,
  Cart,
  FlowHeader,
  FieldRadioGroup,
  FieldInput,
  FieldSelect,
  FieldTextarea,
} from '@/ui';
import { useReservationWizard } from '@/contexts/ReservationWizardContext';
import { PaymentStatus, ReservationStatus } from '@/domain/reservation';
import { markReservationPaid, upsertReservation } from '@/domain/mockReservations';

export default function CheckoutPage() {
  const router = useRouter();
  const { state, updateDepositChoice } = useReservationWizard();
  const [paymentMethod, setPaymentMethod] = useState('business_balance');
  const reservationId = useMemo(() => `L3${Date.now().toString().slice(-6)}`, []);
  const [businessBalance, setBusinessBalance] = useState(() => {
    if (typeof window === 'undefined') return 2332.25;
    const stored = window.localStorage.getItem('business_balance_v1');
    const parsed = stored ? Number(stored) : 2332.25;
    return Number.isFinite(parsed) ? parsed : 2332.25;
  });
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
  });
  const [manualPaymentType, setManualPaymentType] = useState('credit_balance');
  const [manualPaymentNote, setManualPaymentNote] = useState('');
  const [boxOfficeCollection, setBoxOfficeCollection] = useState('terminal');

  const isPartner = state.selectedBusiness?.bookingAgentType?.toLowerCase() === 'external';
  const isBalanceAllowed = state.selectedBusiness?.balanceAllowed ?? false;
  const paymentOptions = useMemo(
    () => [
      { id: 'payment_link', label: 'Payment link', available: true },
      { id: 'bank_card', label: 'Bank card', available: true },
      { id: 'business_balance', label: 'Business balance', available: isBalanceAllowed },
      { id: 'pay_at_box_office', label: 'Pay at the box office', available: isPartner },
      { id: 'mark_as_paid', label: 'Mark as paid', available: isPartner },
    ],
    [isPartner, isBalanceAllowed]
  );

  useEffect(() => {
    const selected = paymentOptions.find((option) => option.id === paymentMethod);
    if (selected?.available) return;
    const firstAvailable = paymentOptions.find((option) => option.available);
    if (firstAvailable && firstAvailable.id !== paymentMethod) {
      setPaymentMethod(firstAvailable.id);
    }
  }, [paymentOptions, paymentMethod]);

  const paymentRadioOptions = useMemo(
    () =>
      paymentOptions.map((option) => ({
        value: option.id,
        label: option.available ? option.label : `${option.label} (Not available)`,
        disabled: !option.available,
      })),
    [paymentOptions]
  );

  const paymentLink = useMemo(
    () => `https://feverup.com/reservations/${reservationId}`,
    [reservationId]
  );

  const calculateFinalTotal = () => {
    let total = state.selectedTickets.reduce(
      (sum, ticket) => sum + ticket.price * ticket.quantity,
      0
    );
    if (state.override?.enabled && state.override.value) {
      const value = state.override.value;
      if (state.override.mode === 'fixed') {
        if (state.override.action === 'add') total += value;
        else if (state.override.action === 'reduce') total -= value;
        else if (state.override.action === 'set_final') total = value;
      } else {
        // percentage
        if (state.override.action === 'add') total += (total * value) / 100;
        else if (state.override.action === 'reduce') total -= (total * value) / 100;
        else if (state.override.action === 'set_final') total = (total * value) / 100;
      }
    }
    return Math.max(0, total);
  };

  const finalTotal = useMemo(() => calculateFinalTotal(), [state.selectedTickets, state.override]);

  // Mock: deposit enabled for demonstration
  const depositEnabled = false;
  const depositAmount = useMemo(() => {
    return finalTotal * 0.3; // 30% deposit
  }, [finalTotal]);

  const remainingAmount = finalTotal - depositAmount;

  const [depositChoice, setDepositChoice] = useState<'full' | 'deposit'>(
    state.depositChoice?.type || 'full'
  );
  const [termsAccepted, setTermsAccepted] = useState(
    state.depositChoice?.termsAccepted || false
  );

  const handlePayment = () => {
    updateDepositChoice({
      type: depositChoice,
      termsAccepted: depositChoice === 'deposit' ? termsAccepted : undefined,
    });
    // TODO: Replace this mock with real payment API integration.
    if (paymentMethod === 'business_balance') {
      const updatedBalance = Math.max(0, businessBalance - finalTotal);
      setBusinessBalance(updatedBalance);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('business_balance_v1', updatedBalance.toFixed(2));
      }
    }
    const ticketCount = state.selectedTickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
    const eventDateTime = state.selectedDateTime || new Date().toISOString();
    const now = new Date();
    upsertReservation({
      id: reservationId,
      customerName: state.contactInfo.name || 'Unknown customer',
      customerEmail: state.contactInfo.email || 'unknown@example.com',
      customerPhone: state.contactInfo.phone || undefined,
      experienceName: state.selectedEvent?.name || 'Reservation',
      dateTime: eventDateTime,
      status: ReservationStatus.TO_BE_PAID,
      totalAmount: finalTotal,
      currency: 'USD',
      paymentStatus: 'to_be_paid',
      depositEnabled,
      depositAmount: depositChoice === 'deposit' ? depositAmount : 0,
      remainingAmount: depositChoice === 'deposit' ? remainingAmount : finalTotal,
      reservationDate: now,
      checkInDate: new Date(eventDateTime),
      checkOutDate: new Date(eventDateTime),
      payment: {
        id: `pay-${reservationId}`,
        amount: finalTotal,
        currency: 'USD',
        status: PaymentStatus.PENDING,
        method: paymentMethod,
      },
      deposit: {
        id: `dep-${reservationId}`,
        amount: depositChoice === 'deposit' ? depositAmount : 0,
        currency: 'USD',
        required: depositChoice === 'deposit',
        paid: false,
        refunded: false,
      },
      numberOfGuests: Math.max(ticketCount, 1),
      bookingAgentName: state.selectedBusiness?.name,
      bookingAgentType: state.selectedBusiness?.bookingAgentType,
      eventName: state.selectedEvent?.name,
      numberOfTickets: ticketCount,
      attendanceConfirmed: false,
      createdAt: now,
      updatedAt: now,
    });

    markReservationPaid(reservationId);
    router.push(`/reservations/${reservationId}`);
  };

  const handleBack = () => {
    router.push('/reservations/new/contact');
  };

  const cartDateLabel = state.selectedDateTime
    ? new Date(state.selectedDateTime).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

  const cartItems = state.selectedTickets.map((ticket) => ({
    id: ticket.ticketTypeId,
    quantity: ticket.quantity,
    title: ticket.title,
    price: ticket.price * ticket.quantity,
  }));

  return (
    <AppShell className="bg-[var(--bg-page)]" mainClassName="p-0">
      <FlowHeader
        breadcrumb={[
          { label: 'Reservations', href: '/reservations', underline: true },
          { label: reservationId },
        ]}
        title="Reservation payment"
      />
      <div className="px-6 py-6">
        <div className="mx-auto w-full max-w-[1136px]">
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
          {/* Left column */}
          <div className="space-y-4">
            <Card>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-surface flex items-center justify-center text-2xl">
                  🎟️
                </div>
                <div>
                  <p className="text-sm text-muted">Event</p>
                  <p className="font-semibold text-text">
                    {state.selectedEvent?.name || 'LIV Golf Chicago 2026'}
                  </p>
                  <p className="text-sm text-muted">
                    {state.selectedEvent?.venue || 'Bolingbrook Golf Club'}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Reservation ID</p>
                  <p className="text-text font-mono text-sm">{reservationId}</p>
                </div>
                <Button variant="secondary" size="sm">
                  Copy
                </Button>
              </div>
            </Card>

            <Cart
              title="Purchase details"
              dateLabel={cartDateLabel}
              items={cartItems}
              emptyState={{
                title: 'No tickets selected',
                description: 'Choose event dates and tickets to build the new reservation.',
              }}
              totalAmount={finalTotal}
            />

            <Card>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-text">Promo code</p>
                <span className="text-muted">▾</span>
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div>
            <Card>
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-text">Complete your reservation</h2>
                  <p className="text-sm text-muted">
                    Complete the payment to finalize the reservation and issue the tickets.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted">Total to pay</p>
                  <p className="text-2xl font-semibold text-text">${finalTotal.toFixed(2)}</p>
                </div>

                <div className="flex gap-3 p-4 rounded-lg bg-warning/10 border border-warning">
                  <div className="text-warning">⚠️</div>
                  <div className="text-sm text-warning">
                    <p className="font-medium">Please, secure your reservation before the deadline to avoid cancellation.</p>
                    <p>
                      Deadline (Event time): Tue, 04 Nov 2025, 10:59 AM (UTC+11).
                    </p>
                    <p>Time left: 23h 3m</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-text mb-3">Payment method</p>
                  <FieldRadioGroup
                    value={paymentMethod}
                    onChange={setPaymentMethod}
                    options={paymentRadioOptions}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  />
                  <p className="mt-2 text-xs text-muted">
                    Partners can use all payment options. Businesses are limited to card, payment link,
                    and balance when enabled.
                  </p>
                </div>

                {paymentMethod === 'payment_link' && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted">
                      Generate a secure link to pay the remaining amount. Anyone with the link and a
                      valid login can complete the checkout, and the payer will be recorded in the order.
                    </p>
                    <FieldInput value={paymentLink} readOnly aria-label="Payment link" />
                    <div className="flex flex-wrap items-center gap-3">
                      <Button variant="secondary">Copy link</Button>
                      <Button variant="secondary" disabled={!state.contactInfo.email}>
                        Send to {state.contactInfo.email || 'contact email'}
                      </Button>
                    </div>
                    <p className="text-xs text-muted">
                      Send uses the reservation contact email. Whitelabels can customize the email template.
                    </p>
                  </div>
                )}

                {paymentMethod === 'bank_card' && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted">
                      Process a direct payment by entering a valid card PAN, expiration date, and CVV.
                      This is useful for phone sales and immediately converts the reservation into an order.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-3">
                      <FieldInput
                        placeholder="Card number"
                        inputMode="numeric"
                        value={cardDetails.number}
                        onChange={(event) =>
                          setCardDetails((prev) => ({ ...prev, number: event.target.value }))
                        }
                      />
                      <FieldInput
                        placeholder="MM/YY"
                        inputMode="numeric"
                        value={cardDetails.expiry}
                        onChange={(event) =>
                          setCardDetails((prev) => ({ ...prev, expiry: event.target.value }))
                        }
                      />
                      <FieldInput
                        placeholder="CVV"
                        inputMode="numeric"
                        value={cardDetails.cvv}
                        onChange={(event) =>
                          setCardDetails((prev) => ({ ...prev, cvv: event.target.value }))
                        }
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'business_balance' && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted">
                      Use the assigned balance to pay without direct transactions. The amount is discounted
                      from the business balance configured by the partner.
                    </p>
                    <div className="p-3 rounded-lg bg-surface text-sm">
                      <p className="text-muted">Business available balance</p>
                      <p className="text-text font-medium">${businessBalance.toFixed(2)}</p>
                    </div>
                  </div>
                )}

                {paymentMethod === 'pay_at_box_office' && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted">
                      Activate payment at the box office so the reservation can be paid on-site using a
                      configured terminal or cash at the register.
                    </p>
                    <FieldSelect
                      id="box-office-collection"
                      label="Collection method"
                      value={boxOfficeCollection}
                      onChange={(value) => setBoxOfficeCollection(value as string)}
                      options={[
                        { value: 'terminal', label: 'Fever terminal' },
                        { value: 'cash', label: 'Cash at register' },
                      ]}
                    />
                    <p className="text-xs text-muted">
                      Fever collects the money when a Fever terminal is used. Cash collection is handled by
                      the partner.
                    </p>
                  </div>
                )}

                {paymentMethod === 'mark_as_paid' && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted">
                      Mark the reservation as paid manually when payment is collected outside Fever.
                      Record the method and add a reference for reconciliation.
                    </p>
                    <FieldSelect
                      id="manual-payment-type"
                      label="Manual payment method"
                      value={manualPaymentType}
                      onChange={(value) => setManualPaymentType(value as string)}
                      options={[
                        { value: 'credit_balance', label: 'Credit / Balance' },
                        { value: 'other', label: 'Other' },
                      ]}
                    />
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted uppercase">Payment note</p>
                      <FieldTextarea
                        id="manual-payment-note"
                        placeholder="Add a reference, e.g. bank transfer or cash receipt."
                        value={manualPaymentNote}
                        onChange={(event) => setManualPaymentNote(event.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted">
                      Bank transfers are not supported directly, so add details here if used.
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
                  <Button variant="secondary" onClick={handleBack}>
                    Back
                  </Button>
                  <div className="flex gap-3">
                    <Button variant="secondary">
                      Pay later & continue
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handlePayment}
                      disabled={depositChoice === 'deposit' && !termsAccepted}
                    >
                      Pay
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
