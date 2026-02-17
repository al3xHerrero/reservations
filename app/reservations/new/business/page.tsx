'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, FieldSelect, Sidebar } from '@/ui';
import { useReservationWizard } from '@/contexts/ReservationWizardContext';
import { BUSINESS_PROFILES } from '@/domain/mockReservations';
import ReservationWizardHeader from '../components/ReservationWizardHeader';

// Illustration component - Person with laptop from Figma
const PersonIllustration = () => (
  <img
    src="/illustrations/person-laptop.png"
    alt=""
    style={{
      width: '225px',
      height: 'auto',
    }}
  />
);

export default function BusinessSelectionPage() {
  const router = useRouter();
  const { state, updateBusiness } = useReservationWizard();
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(
    state.selectedBusiness?.id || ''
  );
  const [error, setError] = useState<string>('');

  const selectedBusiness = BUSINESS_PROFILES.find((b) => b.id === selectedBusinessId);

  const businessOptions = [
    { value: '', label: 'Business name' },
    ...BUSINESS_PROFILES.map((b) => ({ value: b.id, label: b.name })),
  ];

  const handleContinue = () => {
    if (!selectedBusiness) {
      setError('This field is mandatory');
      return;
    }
    updateBusiness(selectedBusiness);
    router.push('/reservations/new/event');
  };

  const handleCancel = () => {
    router.push('/reservations');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeItem="reservations" activeChild="overview" />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Page content */}
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
              { label: 'Business' },
            ]}
          />

          {/* Card Container */}
          <div style={{ padding: 'var(--space-6)' }}>
            <div
              style={{
                maxWidth: '1136px',
                position: 'relative',
                backgroundColor: 'var(--background-main-default)',
                border: '1px solid var(--border-main-default)',
                borderRadius: '8px',
                padding: '16px 16px 16px 24px',
                minHeight: '469px',
              }}
            >
              {/* Header */}
              <div style={{ marginBottom: '24px' }}>
                <h2
                  style={{
                    fontSize: 'var(--size-h3)',
                    lineHeight: 'var(--leading-h3)',
                    fontWeight: 'var(--weight-semibold)',
                    color: 'var(--text-main-default)',
                    fontFamily: 'var(--font-body)',
                    margin: 0,
                  }}
                >
                  Select a business
                </h2>
                <p
                  style={{
                    fontSize: 'var(--size-base)',
                    lineHeight: 'var(--leading-base)',
                    fontWeight: 'var(--weight-regular)',
                    color: 'var(--text-subtle-default)',
                    fontFamily: 'var(--font-body)',
                    margin: '4px 0 0 0',
                  }}
                >
                  In order to create a reservation, you must select a business.
                </p>
              </div>

              {/* Content - Two columns */}
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                {/* Left column - Form */}
                <div style={{ width: '530px', flexShrink: 0 }}>
                  <FieldSelect
                    label="Business name"
                    placeholder="Business name"
                    value={selectedBusinessId}
                    onChange={(nextValue) => {
                      setSelectedBusinessId(nextValue as string);
                      setError('');
                    }}
                    options={businessOptions}
                    error={error}
                  />

                  {/* Show business details when selected */}
                  {selectedBusiness && (
                    <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <span
                          style={{
                            fontSize: 'var(--size-caption)',
                            fontWeight: 'var(--weight-semibold)',
                            color: 'var(--text-subtle-default)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          Business email
                        </span>
                        <p
                          style={{
                            fontSize: 'var(--size-base)',
                            color: 'var(--text-main-default)',
                            margin: '4px 0 0 0',
                          }}
                        >
                          {selectedBusiness.email}
                        </p>
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: 'var(--size-caption)',
                            fontWeight: 'var(--weight-semibold)',
                            color: 'var(--text-subtle-default)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          Booking agent type
                        </span>
                        <p
                          style={{
                            fontSize: 'var(--size-base)',
                            color: 'var(--text-main-default)',
                            margin: '4px 0 0 0',
                          }}
                        >
                          {selectedBusiness.bookingAgentType}
                        </p>
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: 'var(--size-caption)',
                            fontWeight: 'var(--weight-semibold)',
                            color: 'var(--text-subtle-default)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          Balance allowed
                        </span>
                        <p
                          style={{
                            fontSize: 'var(--size-base)',
                            color: 'var(--text-main-default)',
                            margin: '4px 0 0 0',
                          }}
                        >
                          {selectedBusiness.balanceAllowed ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right column - Illustration */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '300px',
                  }}
                >
                  <PersonIllustration />
                </div>
              </div>

              {/* Buttons - Bottom right */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '15px',
                  right: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-6)',
                }}
              >
                <Button variant="secondary" size="lg" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleContinue}
                >
                  Select business
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
