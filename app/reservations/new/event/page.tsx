'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, FieldSelect, Tag, Sidebar } from '@/ui';
import { useReservationWizard } from '@/contexts/ReservationWizardContext';
import { EVENT_PROFILES, EventProfile } from '@/domain/mockReservations';
import ReservationWizardHeader from '../components/ReservationWizardHeader';

const getCityOptions = (events: EventProfile[]) => [
  { value: '', label: 'City' },
  ...Array.from(new Set(events.map((event) => event.city))).map((city) => ({
    value: city,
    label: city,
  })),
];

const buildEventOptions = (events: EventProfile[], targetCity: string) => {
  const baseLabel = targetCity ? 'Select an event' : 'Select a city and search for an event';
  const available = events.filter((event) => !targetCity || event.city === targetCity);
  const uniqueNames = Array.from(new Set(available.map((event) => event.name)));
  return [
    { value: '', label: baseLabel },
    ...uniqueNames.map((name) => ({ value: name, label: name })),
  ];
};

const buildVenueOptions = (events: EventProfile[], targetCity: string, targetEvent: string) => {
  const baseLabel = 'Venue';
  let available = events.filter((event) => event.city === targetCity);
  if (targetEvent) {
    available = available.filter((event) => event.name === targetEvent);
  }
  const uniqueVenues = Array.from(new Set(available.map((event) => event.venue)));
  return [
    { value: '', label: baseLabel },
    ...uniqueVenues.map((venue) => ({ value: venue, label: venue })),
  ];
};

export default function EventSelectionPage() {
  const router = useRouter();
  const { updateEvent } = useReservationWizard();
  const events = EVENT_PROFILES;
  const [cityFilter, setCityFilter] = useState<string>('');
  const [eventFilter, setEventFilter] = useState<string>('');
  const [venueFilter, setVenueFilter] = useState<string>('');

  const cityOptions = useMemo(() => getCityOptions(events), [events]);
  const eventOptions = useMemo(() => buildEventOptions(events, cityFilter), [events, cityFilter]);
  const venueOptions = useMemo(
    () => buildVenueOptions(events, cityFilter, eventFilter),
    [events, cityFilter, eventFilter]
  );

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (cityFilter && event.city !== cityFilter) return false;
      if (eventFilter && event.name !== eventFilter) return false;
      if (venueFilter && event.venue !== venueFilter) return false;
      return true;
    });
  }, [events, cityFilter, eventFilter, venueFilter]);

  const handleEventSelect = (event: EventProfile) => {
    updateEvent({
      id: event.id,
      name: event.name,
      venue: event.venue,
      address: event.venueAddress,
      city: event.city,
      dates: [event.startDate],
      state: event.state ?? 'active',
      thumbnail: event.thumbnail,
    });
    router.push('/reservations/new/tickets');
  };

  const handleBack = () => {
    router.push('/reservations/new/business');
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
            {
              label: 'Business',
              onNavigate: handleBack,
            },
            { label: 'Event' },
          ]}
        >
          <div
            className="flex items-end"
            style={{ gap: 'var(--space-4)' }}
          >
            {/* City Select */}
            <div style={{ width: '140px', flexShrink: 0 }}>
              <FieldSelect
                label="City"
                placeholder="City"
                value={cityFilter}
                onChange={(v) => {
                  const next = v as string;
                  setCityFilter(next);
                  setEventFilter('');
                  setVenueFilter('');
                }}
                options={cityOptions}
              />
            </div>

            {/* Event Select */}
            <div className="flex-1 min-w-0">
              <FieldSelect
                label="Select a city and search for an event"
                placeholder="Select a city and search for an event"
                value={eventFilter}
                onChange={(v) => {
                  const next = v as string;
                  setEventFilter(next);
                  setVenueFilter('');
                }}
                options={eventOptions}
              />
            </div>

            {/* Venue Select */}
            <div style={{ width: '200px', flexShrink: 0 }}>
              <FieldSelect
                label="Venue"
                placeholder="Venue"
                value={venueFilter}
                onChange={(v) => setVenueFilter(v as string)}
                options={venueOptions}
              />
            </div>
          </div>
        </ReservationWizardHeader>

          {/* Card Container */}
          <div style={{ padding: 'var(--space-6)' }}>
            <div
              style={{
                maxWidth: '1136px',
                backgroundColor: 'var(--background-main-default)',
                border: '1px solid var(--border-main-default)',
                borderRadius: '8px',
                padding: 'var(--space-6)',
              }}
            >
              {/* Header */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <h2
                  style={{
                    fontSize: 'var(--size-h2)',
                    lineHeight: 'var(--leading-h2)',
                    fontWeight: 'var(--weight-semibold)',
                    color: 'var(--text-main-default)',
                    fontFamily: 'var(--font-body)',
                    margin: 0,
                  }}
                >
                  Available events
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
                  Select an available event and start a new reservation
                </p>
              </div>

              {/* Results count */}
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <span
                  style={{
                    fontSize: 'var(--size-small)',
                    fontWeight: 'var(--weight-semibold)',
                    color: 'var(--action-text-primary-default)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {filteredEvents.length}
                </span>
                <span
                  style={{
                    fontSize: 'var(--size-small)',
                    fontWeight: 'var(--weight-regular)',
                    color: 'var(--text-subtle-default)',
                    fontFamily: 'var(--font-body)',
                    marginLeft: '4px',
                  }}
                >
                  events with the filters applied
                </span>
              </div>

              {/* Events Table */}
              <div style={{ marginLeft: '-24px', marginRight: '-24px' }}>
                {/* Table Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 24px',
                    borderTop: '1px solid var(--border-main-default)',
                    borderBottom: '1px solid var(--border-main-default)',
                    backgroundColor: 'var(--palette-neutral-50)',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: 'var(--size-caption)',
                        fontWeight: 'var(--weight-semibold)',
                        color: 'var(--text-subtle-default)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      Event <span style={{ opacity: 0.5 }}>↑↓</span>
                    </span>
                  </div>
                  <div style={{ width: '140px', flexShrink: 0, textAlign: 'left' }}>
                    <span
                      style={{
                        fontSize: 'var(--size-caption)',
                        fontWeight: 'var(--weight-semibold)',
                        color: 'var(--text-subtle-default)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      Dates <span style={{ opacity: 0.5 }}>↑↓</span>
                    </span>
                  </div>
                  <div style={{ width: '100px', flexShrink: 0, textAlign: 'left' }}>
                    <span
                      style={{
                        fontSize: 'var(--size-caption)',
                        fontWeight: 'var(--weight-semibold)',
                        color: 'var(--text-subtle-default)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      State <span style={{ opacity: 0.5 }}>↑↓</span>
                    </span>
                  </div>
                </div>

                {/* Table Body */}
                {filteredEvents.length === 0 ? (
                  <div
                    style={{
                      padding: '48px 24px',
                      textAlign: 'center',
                      color: 'var(--text-subtle-default)',
                    }}
                  >
                    No events found
                  </div>
                ) : (
                  filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="cursor-pointer transition-colors"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px 24px',
                        borderBottom: '1px solid var(--border-main-default)',
                      }}
                      onClick={() => handleEventSelect(event)}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = 'var(--palette-neutral-100)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                      }
                    >
                      {/* Event info */}
                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                        }}
                      >
                        {/* Event image */}
                        <div
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            flexShrink: 0,
                            backgroundColor: 'var(--palette-neutral-100)',
                          }}
                        >
                          <img
                            src={event.thumbnail}
                            alt={event.name}
                            loading="lazy"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                        </div>

                        {/* Event details */}
                        <div style={{ minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: 'var(--size-h6)',
                              lineHeight: 'var(--leading-h6)',
                              fontWeight: 'var(--weight-semibold)',
                              color: 'var(--text-main-default)',
                              fontFamily: 'var(--font-body)',
                              margin: 0,
                            }}
                          >
                            {event.name}
                          </p>

                          {event.venue && (
                            <>
                              <p
                                style={{
                                  fontSize: 'var(--size-caption)',
                                  lineHeight: 'var(--leading-caption)',
                                  color: 'var(--text-subtle-default)',
                                  fontFamily: 'var(--font-body)',
                                  margin: '2px 0 0 0',
                                }}
                              >
                                {event.city} - {event.venue}
                              </p>
                              <p
                                style={{
                                  fontSize: 'var(--size-caption)',
                                  lineHeight: 'var(--leading-caption)',
                                  color: 'var(--text-subtle-default)',
                                  fontFamily: 'var(--font-body)',
                                  margin: '0',
                                }}
                              >
                              {event.venueAddress}
                              </p>
                            </>
                          )}

                        </div>
                      </div>

                      {/* Dates */}
                      <div style={{ width: '140px', flexShrink: 0 }}>
                        <p
                          style={{
                            fontSize: 'var(--size-small)',
                            lineHeight: 'var(--leading-small)',
                            color: 'var(--text-main-default)',
                            fontFamily: 'var(--font-body)',
                            margin: 0,
                          }}
                        >
                          {event.startDate}
                        </p>
                        <p
                          style={{
                            fontSize: 'var(--size-small)',
                            lineHeight: 'var(--leading-small)',
                            color: 'var(--text-main-default)',
                            fontFamily: 'var(--font-body)',
                            margin: 0,
                          }}
                        >
                          {event.endDate}
                        </p>
                      </div>

                      {/* State */}
                      <div style={{ width: '100px', flexShrink: 0 }}>
                        <Tag
                          sentiment={event.state === 'active' ? 'positive' : 'disabled'}
                          tagStyle="outline"
                        >
                          {event.state === 'active' ? 'Active' : 'Inactive'}
                        </Tag>
                      </div>
                    </div>
                  ))
                )}

                {/* End of list */}
                <div
                  style={{
                    padding: '16px 24px',
                    textAlign: 'center',
                    borderBottom: '1px solid var(--border-main-default)',
                  }}
                >
                  <span
                    style={{
                      fontSize: 'var(--size-caption)',
                      color: 'var(--text-subtle-default)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    End of the list
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
