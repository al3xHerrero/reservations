'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, Card, Button, Input, Select, Badge, FlowHeader } from '@/ui';
import { useReservationWizard } from '@/contexts/ReservationWizardContext';

// Mock events
const mockEvents = [
  {
    id: '1',
    name: 'Jazz Night',
    venue: 'Blue Note',
    address: '123 Music St',
    city: 'New York',
    dates: ['2024-12-20T20:00:00', '2024-12-21T20:00:00'],
    state: 'active' as const,
  },
  {
    id: '2',
    name: 'Rock Concert',
    venue: 'Madison Square Garden',
    address: '4 Pennsylvania Plaza',
    city: 'New York',
    dates: ['2024-12-25T19:00:00'],
    state: 'active' as const,
  },
  {
    id: '3',
    name: 'Classical Evening',
    venue: 'Carnegie Hall',
    address: '881 7th Ave',
    city: 'New York',
    dates: ['2024-12-18T19:30:00'],
    state: 'not_for_sale' as const,
  },
  {
    id: '4',
    name: 'Comedy Show',
    venue: 'Comedy Cellar',
    address: '117 MacDougal St',
    city: 'New York',
    dates: ['2024-12-22T21:00:00'],
    state: 'active' as const,
  },
];

export default function EventSelectionPage() {
  const router = useRouter();
  const { state, updateEvent } = useReservationWizard();
  const [cityFilter, setCityFilter] = useState<string>('');
  const [venueFilter, setVenueFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const cities = Array.from(new Set(mockEvents.map((e) => e.city)));
  const venues = Array.from(new Set(mockEvents.map((e) => e.venue)));

  const filteredEvents = mockEvents.filter((event) => {
    const matchesCity = !cityFilter || event.city === cityFilter;
    const matchesVenue = !venueFilter || event.venue === venueFilter;
    const matchesSearch =
      !searchQuery ||
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesVenue && matchesSearch;
  });

  const handleEventSelect = (event: typeof mockEvents[0]) => {
    updateEvent(event);
    router.push('/reservations/new/tickets');
  };

  const handleBack = () => {
    router.push('/reservations/new/business');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
            {state.selectedBusiness && (
              <Card title="Business">
                <div className="space-y-2">
                  <p className="text-text font-medium">{state.selectedBusiness.name}</p>
                  <p className="text-sm text-muted">{state.selectedBusiness.email}</p>
                </div>
              </Card>
            )}
          </div>

          {/* Right column - Main form */}
          <div className="lg:col-span-2">
            <Card title="Select Event">
              <div className="space-y-4">
                {/* Filter bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                    id="city"
                    label="City"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    options={[
                      { value: '', label: 'All Cities' },
                      ...cities.map((city) => ({ value: city, label: city })),
                    ]}
                  />
                  <Select
                    id="venue"
                    label="Venue"
                    value={venueFilter}
                    onChange={(e) => setVenueFilter(e.target.value)}
                    options={[
                      { value: '', label: 'All Venues' },
                      ...venues.map((venue) => ({ value: venue, label: venue })),
                    ]}
                  />
                  <Input
                    id="search"
                    label="Search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events..."
                  />
                </div>

                {/* Events list */}
                <div className="space-y-3 mt-6">
                  {filteredEvents.length === 0 ? (
                    <p className="text-center text-muted py-8">No events found</p>
                  ) : (
                    filteredEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-4 border border-border rounded-lg hover:bg-surface cursor-pointer transition-colors"
                        onClick={() => handleEventSelect(event)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-surface rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">🎵</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold text-text">{event.name}</h3>
                              <Badge
                                variant={event.state === 'active' ? 'success' : 'warning'}
                              >
                                {event.state === 'active' ? 'Active' : 'Not for sale'}
                              </Badge>
                            </div>
                            <p className="text-sm text-text">
                              {event.venue} • {event.address}
                            </p>
                            <div className="mt-2 space-y-1">
                              {event.dates.map((date, idx) => (
                                <p key={idx} className="text-sm text-muted">
                                  {formatDate(date)}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <Button variant="secondary" onClick={handleBack}>
                    Back
                  </Button>
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
