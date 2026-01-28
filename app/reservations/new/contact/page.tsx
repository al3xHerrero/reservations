'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, Card, Button, Cart, Input, Modal, FlowHeader } from '@/ui';
import { useReservationWizard } from '@/contexts/ReservationWizardContext';

export default function ContactDetailsPage() {
  const router = useRouter();
  const { state, updateContactInfo, updateOverride } = useReservationWizard();
  const [contactInfo, setContactInfo] = useState(state.contactInfo);
  const [overrideEnabled, setOverrideEnabled] = useState(state.override?.enabled || false);
  const [overrideMode, setOverrideMode] = useState<'fixed' | 'percentage'>(
    state.override?.mode || 'fixed'
  );
  const [overrideAction, setOverrideAction] = useState<'add' | 'reduce' | 'set_final'>(
    state.override?.action || 'add'
  );
  const [overrideValue, setOverrideValue] = useState<string>(
    state.override?.value?.toString() || ''
  );
  const [overrideConcept, setOverrideConcept] = useState(state.override?.concept || '');
  const [error, setError] = useState<string>('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const cartTotal = useMemo(() => {
    return state.selectedTickets.reduce(
      (sum, ticket) => sum + ticket.price * ticket.quantity,
      0
    );
  }, [state.selectedTickets]);

  const cartDateLabel = state.selectedDateTime
    ? new Date(state.selectedDateTime).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : undefined;

  const cartItems = state.selectedTickets.map((ticket) => ({
    id: ticket.ticketTypeId,
    quantity: ticket.quantity,
    title: ticket.title,
    price: ticket.price * ticket.quantity,
  }));

  const isDateInFuture = useMemo(() => {
    if (!state.selectedDateTime) return false;
    return new Date(state.selectedDateTime) > new Date();
  }, [state.selectedDateTime]);

  const calculateFinalTotal = () => {
    let total = cartTotal;
    if (overrideEnabled && overrideValue) {
      const value = parseFloat(overrideValue);
      if (!isNaN(value)) {
        if (overrideMode === 'fixed') {
          if (overrideAction === 'add') total += value;
          else if (overrideAction === 'reduce') total -= value;
          else if (overrideAction === 'set_final') total = value;
        } else {
          // percentage
          if (overrideAction === 'add') total += (total * value) / 100;
          else if (overrideAction === 'reduce') total -= (total * value) / 100;
          else if (overrideAction === 'set_final') total = (total * value) / 100;
        }
      }
    }
    return Math.max(0, total);
  };

  const finalTotal = calculateFinalTotal();
  const adjustmentAmount = finalTotal - cartTotal;

  const persistAndContinue = () => {
    // Validation: email required if date is in the future
    if (isDateInFuture && !contactInfo.email.trim()) {
      setError('Email is required for future events');
      return;
    }

    updateContactInfo(contactInfo);

    if (overrideEnabled && overrideValue) {
      updateOverride({
        enabled: true,
        mode: overrideMode,
        action: overrideAction,
        value: parseFloat(overrideValue) || 0,
        concept: overrideConcept,
      });
    } else {
      updateOverride(null);
    }

    router.push('/reservations/new/checkout');
  };

  const handleContinue = () => {
    // Validation: email required if date is in the future
    if (isDateInFuture && !contactInfo.email.trim()) {
      setError('Email is required for future events');
      return;
    }

    if (overrideEnabled) {
      setIsConfirmOpen(true);
      return;
    }

    persistAndContinue();
  };

  const handleBack = () => {
    router.push('/reservations/new/tickets');
  };

  return (
    <AppShell className="bg-[var(--bg-page)]" mainClassName="p-0">
      <FlowHeader
        breadcrumb={[{ label: 'Reservations', href: '/reservations', underline: true }]}
        title="Make a reservation"
      />
      <div className="px-6 py-6">
        <div className="mx-auto w-full max-w-[1136px]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Summary cards */}
          <div className="lg:col-span-1 space-y-4">
            {state.selectedEvent && (
              <Card title="Event">
                <div className="space-y-2">
                  <p className="text-text font-medium">{state.selectedEvent.name}</p>
                  <p className="text-sm text-muted">{state.selectedEvent.venue}</p>
                </div>
              </Card>
            )}

            <Cart
              title="Cart"
              dateLabel={cartDateLabel}
              items={cartItems}
              emptyState={{
                title: 'No tickets selected',
                description: 'Choose event dates and tickets to build the new reservation.',
              }}
              overrideConfig={{
                enabled: overrideEnabled,
                onToggle: () => setOverrideEnabled((value) => !value),
                mode: overrideMode,
                onModeChange: setOverrideMode,
                action: overrideAction,
                onActionChange: setOverrideAction,
                amount: overrideValue,
                onAmountChange: setOverrideValue,
                concept: overrideConcept,
                onConceptChange: setOverrideConcept,
              }}
              breakdown={{
                reservationValue: cartTotal,
                override:
                  overrideEnabled && overrideValue
                    ? {
                        label: overrideConcept ? `"${overrideConcept}"` : 'Adjustment',
                        value: adjustmentAmount,
                        note: overrideConcept || undefined,
                      }
                    : undefined,
                outstandingAmount: finalTotal,
                outstandingLabel: 'Total',
                breakdownLinkLabel: 'Hide breakdown',
              }}
            />
          </div>

          {/* Right column - Main form */}
          <div className="lg:col-span-2">
            <Card title="Contact Details">
              <div className="space-y-6">
                {/* Contact information form */}
                <div className="space-y-4">
                  <Input
                    id="name"
                    label="Name"
                    type="text"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                    placeholder="Enter name"
                  />
                  <Input
                    id="email"
                    label="Email"
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    placeholder="Enter email"
                    required={isDateInFuture}
                    error={isDateInFuture && !contactInfo.email.trim() ? 'Email is required' : undefined}
                  />
                  <Input
                    id="phone"
                    label="Phone (Optional)"
                    type="tel"
                    value={contactInfo.phone || ''}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>

                {overrideEnabled && overrideValue && (
                  <div className="p-3 bg-warning/10 border border-warning rounded-lg">
                    <p className="text-sm text-warning">
                      This reservation has a modified price
                    </p>
                  </div>
                )}

                {error && <p className="text-sm text-error">{error}</p>}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <Button variant="secondary" onClick={handleBack}>
                    Back
                  </Button>
                  <Button variant="primary" onClick={handleContinue}>
                    Continue
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Confirm changes"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsConfirmOpen(false)}>
              Review changes
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setIsConfirmOpen(false);
                persistAndContinue();
              }}
            >
              Confirm changes
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-3 bg-warning/10 border border-warning rounded-lg">
            <p className="text-sm text-warning">
              This reservation has a modified price
            </p>
          </div>
          <div>
            <p className="text-sm text-muted">Final price</p>
            <p className="text-2xl font-semibold text-text">${finalTotal.toFixed(2)}</p>
          </div>
          <div className="pt-2 border-t border-border">
            <p className="text-sm font-medium text-text mb-2">Price breakdown</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Reservation value</span>
                <span className="text-text">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Adjustment</span>
                <span className="text-text">
                  {adjustmentAmount >= 0 ? '+' : '−'}${Math.abs(adjustmentAmount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-border">
                <span className="font-semibold text-text">Final total</span>
                <span className="font-semibold text-text">${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
