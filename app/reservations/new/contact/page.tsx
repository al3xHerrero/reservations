'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Cart,
  Sidebar,
  FieldInput,
  FieldCheckbox,
  Alert,
  Modal,
} from '@/ui';
import type { CartDateGroup, CartBreakdown } from '@/ui';
import { useReservationWizard } from '@/contexts/ReservationWizardContext';
import { EVENT_PROFILES } from '@/domain/mockReservations';
import EventInfoCard from '../components/EventInfoCard';
import ReservationWizardHeader from '../components/ReservationWizardHeader';

export default function ContactDetailsPage() {
  const router = useRouter();
  const { state, updateContactInfo, updateOverride, requestCheckoutTransition } = useReservationWizard();
  
  // Contact form state
  const [email, setEmail] = useState(state.contactInfo.email || '');
  const [firstName, setFirstName] = useState(state.contactInfo.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(state.contactInfo.name?.split(' ').slice(1).join(' ') || '');
  const [acceptContact, setAcceptContact] = useState(false);
  const [emailError, setEmailError] = useState('');
  
  // Override state
  const [showOriginalPrices, setShowOriginalPrices] = useState(false);
  const [overrideEnabled, setOverrideEnabled] = useState(state.override?.enabled || false);
  const [overrideMode, setOverrideMode] = useState<'fixed' | 'percentage'>(
    state.override?.mode || 'fixed'
  );
  const [overrideAction, setOverrideAction] = useState<'add' | 'reduce' | 'set_final'>(
    state.override?.action || 'reduce'
  );
  const [overrideValue, setOverrideValue] = useState<string>(
    state.override?.value?.toString() || ''
  );
  const [overrideConcept, setOverrideConcept] = useState(state.override?.concept || '');
  const [overrideError, setOverrideError] = useState('');
  
  // Modal state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  // Breakdown expansion state
  const [isBreakdownExpanded, setIsBreakdownExpanded] = useState(true);

  // Calculate cart totals
  const cartTotal = useMemo(() => {
    return state.selectedTickets.reduce(
      (sum, ticket) => sum + ticket.price * ticket.quantity,
      0
    );
  }, [state.selectedTickets]);

  const cartDateLabel = state.selectedDateTime
    ? new Date(state.selectedDateTime).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).replace(',', ' -')
    : '8 Aug 2025 - 10:00';

  // Check if override has a valid amount
  const hasValidOverrideAmount = overrideEnabled && overrideValue && parseFloat(overrideValue) > 0;

  // Build cart date groups
  const cartDateGroups: CartDateGroup[] = useMemo(() => {
    if (state.selectedTickets.length === 0) return [];
    
    return [{
      date: cartDateLabel,
      items: state.selectedTickets.map((ticket) => ({
        id: ticket.ticketTypeId,
        quantity: ticket.quantity,
        title: `Parque | ${ticket.title}`,
        price: ticket.price * ticket.quantity,
        // Only include originalPrice when there's a valid override amount
        originalPrice: hasValidOverrideAmount ? ticket.price * ticket.quantity * 1.5 : undefined,
        feePerTicket: 0,
        feeTotal: 0,
      })),
    }];
  }, [state.selectedTickets, cartDateLabel, hasValidOverrideAmount]);

  // Calculate final total with override
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
          if (overrideAction === 'add') total += (total * value) / 100;
          else if (overrideAction === 'reduce') total -= (total * value) / 100;
          else if (overrideAction === 'set_final') total = (total * value) / 100;
        }
      }
    }
    return Math.max(0, total);
  };

  const finalTotal = calculateFinalTotal();
  const adjustmentAmount = overrideEnabled && overrideValue ? parseFloat(overrideValue) || 0 : 0;
  
  // Calculate rounding (small adjustment for display purposes)
  const rounding = overrideEnabled ? -0.01 : 0;

  // Build breakdown
  const breakdown: CartBreakdown | undefined = useMemo(() => {
    // When no override, show simple total only (no expandable breakdown)
    if (!overrideEnabled) {
      return {
        reservationValue: cartTotal,
        totalToPay: cartTotal,
        totalLabel: 'Total to pay',
      };
    }
    
    // With override, show expandable breakdown
    return {
      reservationValue: cartTotal,
      override: overrideValue ? {
        label: 'Override price',
        value: -adjustmentAmount,
        description: overrideConcept || 'Concept',
      } : undefined,
      totalToPay: finalTotal,
      totalLabel: 'Total to pay',
      isExpanded: isBreakdownExpanded,
      onToggleExpanded: () => setIsBreakdownExpanded((prev) => !prev),
    };
  }, [cartTotal, overrideEnabled, overrideValue, overrideConcept, adjustmentAmount, finalTotal, isBreakdownExpanded]);

  // Check if date is in the future
  const isDateInFuture = useMemo(() => {
    if (!state.selectedDateTime) return true;
    return new Date(state.selectedDateTime) > new Date();
  }, [state.selectedDateTime]);

  const handleClearAll = () => {
    // Clear all selections - would need to update context
  };

  const validateAndContinue = () => {
    // Validate email
    if (isDateInFuture && !email.trim()) {
      setEmailError('This field is mandatory');
      return false;
    }
    setEmailError('');
    if (overrideEnabled && !overrideValue.trim()) {
      setOverrideError('This field is mandatory');
      return false;
    }
    setOverrideError('');
    return true;
  };

  const persistAndContinue = () => {
    updateContactInfo({
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone: state.contactInfo.phone,
    });

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

    requestCheckoutTransition();
    router.push('/reservations/new/checkout');
  };

  const handleContinue = () => {
    if (!validateAndContinue()) return;

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
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeItem="reservations" activeChild="overview" />

      <div className="flex flex-1 flex-col overflow-hidden">

        <main
          className="flex-1 overflow-y-auto"
          style={{ backgroundColor: 'var(--palette-neutral-50)' }}
        >
          <ReservationWizardHeader
            title="Make a Reservation"
            crumbs={[
              {
                label: 'Overview',
                onNavigate: () => router.push('/reservations'),
              },
              {
                label: 'Business',
                onNavigate: () => router.push('/reservations/new/business'),
              },
              {
                label: 'Event',
                onNavigate: () => router.push('/reservations/new/event'),
              },
              {
                label: 'Tickets',
                onNavigate: handleBack,
              },
              { label: 'Contact' },
            ]}
          />

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
                  fallbackName="LIV Golf Chicago 2025 - Hospitality"
                  fallbackVenue="Bolingbrook Golf Club"
                  fallbackAddress="12..."
                  fallbackThumbnail={EVENT_PROFILES[0].thumbnail}
                />

                {/* Cart with Override */}
                <Cart
                  title="Purchase details"
                  collapsible={false}
                  showOriginalPricesCheckbox={true}
                  originalPricesChecked={hasValidOverrideAmount ? showOriginalPrices : false}
                  onOriginalPricesChange={setShowOriginalPrices}
                  dateGroups={cartDateGroups}
                  emptyState={{
                    title: 'No tickets selected',
                    description: 'Choose event dates and tickets to build the new reservation.',
                  }}
                  overrideConfig={{
                    enabled: overrideEnabled,
                    onToggle: () =>
                      setOverrideEnabled((prev) => {
                        const next = !prev;
                        if (!next) {
                          setOverrideError('');
                        }
                        return next;
                      }),
                    mode: overrideMode,
                    onModeChange: setOverrideMode,
                    action: overrideAction,
                    onActionChange: setOverrideAction,
                    amount: overrideValue,
                    onAmountChange: (value) => {
                      setOverrideValue(value);
                      if (overrideError && value.trim()) {
                        setOverrideError('');
                      }
                    },
                    concept: overrideConcept,
                    onConceptChange: setOverrideConcept,
                    errors: overrideError ? { amount: overrideError } : undefined,
                  }}
                  breakdown={breakdown}
                  onClearAll={handleClearAll}
                />
              </div>

              {/* Right Column - Contact Information */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    backgroundColor: 'var(--background-main-default)',
                    border: '1px solid var(--border-main-default)',
                    borderRadius: '8px',
                    padding: 'var(--space-6)',
                  }}
                >
                  <h2
                    style={{
                      fontSize: 'var(--size-h4)',
                      lineHeight: 'var(--leading-h4)',
                      fontWeight: 'var(--weight-semibold)',
                      color: 'var(--text-main-default)',
                      margin: '0 0 var(--space-6) 0',
                    }}
                  >
                    Contact information
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    {/* Email Field */}
                    <div>
                      <div style={{ marginBottom: '4px' }}>
                        <span
                          style={{
                            fontSize: 'var(--size-small)',
                            fontWeight: 'var(--weight-semibold)',
                            color: 'var(--text-main-default)',
                          }}
                        >
                          Email
                        </span>
                        <span style={{ color: 'var(--text-danger-default)', marginLeft: '2px' }}>*</span>
                      </div>
                      <p
                        style={{
                          fontSize: 'var(--size-caption)',
                          color: 'var(--text-subtle-default)',
                          margin: '0 0 8px 0',
                        }}
                      >
                        Mandatory if tickets are bought for a future date.
                      </p>
                      <FieldInput
                        type="email"
                        placeholder="contact@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError('');
                        }}
                        error={emailError}
                      />
                    </div>

                    {/* First Name Field */}
                    <div>
                      <div style={{ marginBottom: '8px' }}>
                        <span
                          style={{
                            fontSize: 'var(--size-small)',
                            fontWeight: 'var(--weight-semibold)',
                            color: 'var(--text-main-default)',
                          }}
                        >
                          First name
                        </span>
                        <span
                          style={{
                            fontSize: 'var(--size-small)',
                            color: 'var(--text-subtle-default)',
                            marginLeft: '8px',
                          }}
                        >
                          Optional
                        </span>
                      </div>
                      <FieldInput
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>

                    {/* Last Name Field */}
                    <div>
                      <div style={{ marginBottom: '8px' }}>
                        <span
                          style={{
                            fontSize: 'var(--size-small)',
                            fontWeight: 'var(--weight-semibold)',
                            color: 'var(--text-main-default)',
                          }}
                        >
                          Last name
                        </span>
                        <span
                          style={{
                            fontSize: 'var(--size-small)',
                            color: 'var(--text-subtle-default)',
                            marginLeft: '8px',
                          }}
                        >
                          Optional
                        </span>
                      </div>
                      <FieldInput
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>

                    {/* Accept Contact Checkbox */}
                    <FieldCheckbox
                      checked={acceptContact}
                      onChange={setAcceptContact}
                      label="I accept to be contacted for operational issues, to be provided access to digital tickets via the Fever app and to receive a satisfaction survey"
                    />

                    {/* Warning Alert for Modified Price */}
                    {overrideEnabled && overrideValue && (
                      <Alert
                        title="This reservation has a modified price"
                        description={`This reservation has a final price of €${finalTotal.toFixed(2)}`}
                        sentiment="warning"
                        showCloseButton={false}
                        titleWeight={400}
                      />
                    )}

                    {/* Navigation Buttons */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 'var(--space-4)',
                        paddingTop: 'var(--space-4)',
                      }}
                    >
                      <Button variant="secondary" size="lg" onClick={handleBack}>
                        Back
                      </Button>
                      <Button variant="primary" size="lg" onClick={handleContinue}>
                        Continue
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Confirm changes"
        footer={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Alert
            title="This reservation has a modified price"
            sentiment="warning"
            showCloseButton={false}
            titleWeight={400}
          />
          <div>
            <p
              style={{
                fontSize: 'var(--size-caption)',
                color: 'var(--text-subtle-default)',
                margin: 0,
              }}
            >
              Final price
            </p>
            <p
              style={{
                fontSize: 'var(--size-h3)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--text-main-default)',
                margin: '4px 0 0 0',
              }}
            >
              €{finalTotal.toFixed(2)}
            </p>
          </div>
          <div
            style={{
              paddingTop: 'var(--space-4)',
              borderTop: '1px solid var(--border-main-default)',
            }}
          >
            <p
              style={{
                fontSize: 'var(--size-small)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--text-main-default)',
                margin: '0 0 var(--space-2) 0',
              }}
            >
              Price breakdown
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: 'var(--size-small)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-subtle-default)' }}>Reservation value</span>
                <span style={{ color: 'var(--text-main-default)' }}>€{cartTotal.toFixed(2)}</span>
              </div>
              {overrideConcept && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-subtle-default)' }}>"{overrideConcept}"</span>
                  <span style={{ color: 'var(--text-main-default)' }}>-€{adjustmentAmount.toFixed(2)}</span>
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '4px',
                  borderTop: '1px solid var(--border-main-default)',
                  fontWeight: 'var(--weight-semibold)',
                }}
              >
                <span style={{ color: 'var(--text-main-default)' }}>Final total</span>
                <span style={{ color: 'var(--text-main-default)' }}>€{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
