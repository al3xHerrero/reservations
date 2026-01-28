'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, Card, Button, FieldSelect, FlowHeader } from '@/ui';
import { useReservationWizard } from '@/contexts/ReservationWizardContext';

// Mock businesses
const mockBusinesses = [
  {
    id: '1',
    name: 'Business A',
    email: 'businessa@example.com',
    bookingAgentType: 'Internal',
    balanceAllowed: true,
  },
  {
    id: '2',
    name: 'Business B',
    email: 'businessb@example.com',
    bookingAgentType: 'External',
    balanceAllowed: false,
  },
  {
    id: '3',
    name: 'Business C',
    email: 'businessc@example.com',
    bookingAgentType: 'Internal',
    balanceAllowed: true,
  },
];

export default function BusinessSelectionPage() {
  const router = useRouter();
  const { state, updateBusiness } = useReservationWizard();
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(
    state.selectedBusiness?.id || ''
  );
  const [error, setError] = useState<string>('');

  const selectedBusiness = mockBusinesses.find((b) => b.id === selectedBusinessId);

  const businessOptions = mockBusinesses.map((b) => ({ value: b.id, label: b.name }));

  const handleContinue = () => {
    if (!selectedBusiness) {
      setError('Please select a business to continue');
      return;
    }
    updateBusiness(selectedBusiness);
    router.push('/reservations/new/event');
  };

  const handleBack = () => {
    router.push('/reservations');
  };

  return (
    <AppShell className="bg-[var(--bg-page)]" mainClassName="p-0">
      <FlowHeader
        breadcrumb={[{ label: 'Reservations', href: '/reservations', underline: true }]}
        title="Make a reservation"
      />
      <div className="px-6 py-6">
        <div className="mx-auto w-full max-w-[1136px]">
          <Card>
            <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-text">Select a business</h2>
              <p className="text-sm text-muted">
                In order to create a reservation, you must select a business.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div className="space-y-5">
                <FieldSelect
                  id="business"
                  label="Business name"
                  placeholder="Select a business..."
                  value={selectedBusinessId}
                  onChange={(nextValue) => {
                    setSelectedBusinessId(nextValue as string);
                    setError('');
                  }}
                  options={businessOptions}
                  error={error}
                />

                {selectedBusiness && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-semibold text-muted uppercase">
                        Business email
                      </span>
                      <p className="text-text">{selectedBusiness.email}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-muted uppercase">
                        Booking agent type
                      </span>
                      <p className="text-text capitalize">{selectedBusiness.bookingAgentType}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-muted uppercase">
                        Balance allowed
                      </span>
                      <p className="text-text">{selectedBusiness.balanceAllowed ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden lg:flex items-center justify-center">
                <div className="w-40 h-40 rounded-full bg-surface flex items-center justify-center">
                  <img
                    src="/illustrations/torso.svg"
                    alt="Person illustration"
                    className="w-28 h-28"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button variant="secondary" onClick={handleBack}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleContinue}
                disabled={!selectedBusiness}
              >
                Select business
              </Button>
            </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
