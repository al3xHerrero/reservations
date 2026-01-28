'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ReservationStatus } from '@/domain/reservation';
import { getAllReservations } from '@/domain/mockReservations';
import {
  Badge,
  Button,
  FieldSelect,
  FieldInput,
  FieldSearch,
  Sidebar,
  TopBar,
} from '@/ui';

// Icons
const iconCalendar = '/icons/calendar.svg';
const iconChevronDown = '/icons/chevron-down.svg';
const iconExport = '/icons/sidebar/orders.svg';

export default function ReservationsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('paid,to_be_paid');
  const [cityFilter, setCityFilter] = useState<string>('');
  const [eventFilter, setEventFilter] = useState<string>('');
  const [venueFilter, setVenueFilter] = useState<string>('');
  const [businessTypeFilter, setBusinessTypeFilter] = useState<string>('');

  const reservations = useMemo(() => {
    try {
      const allReservations = getAllReservations();
      let filtered = allReservations;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (res) =>
            res.customerName.toLowerCase().includes(query) ||
            res.customerEmail.toLowerCase().includes(query) ||
            res.id.toLowerCase().includes(query)
        );
      }

      if (statusFilter && statusFilter !== 'all') {
        const statuses = statusFilter.split(',');
        filtered = filtered.filter((res) => {
          if (statuses.includes('paid') && res.status === ReservationStatus.PAID) return true;
          if (statuses.includes('to_be_paid') && res.status === ReservationStatus.TO_BE_PAID) return true;
          if (statuses.includes('cancelled') && res.status === ReservationStatus.CANCELLED) return true;
          if (statuses.includes('expired') && res.status === ReservationStatus.EXPIRED) return true;
          return false;
        });
      }

      return filtered;
    } catch {
      return [];
    }
  }, [searchQuery, statusFilter]);

  const getStatusBadge = (status: ReservationStatus) => {
    if (status === ReservationStatus.PAID) {
      return { label: 'Paid', variant: 'success' as const };
    }
    if (status === ReservationStatus.TO_BE_PAID) {
      return { label: 'To be paid', variant: 'warning' as const };
    }
    if (status === ReservationStatus.CANCELLED) {
      return { label: 'Cancelled', variant: 'neutral' as const };
    }
    return { label: 'Expired', variant: 'neutral' as const };
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }) + 'h';
  };

  const handleConfirmArrival = (reservationId: string) => {
    console.log('Confirm arrival for reservation:', reservationId);
  };

  const cityOptions = [
    { value: '', label: 'City' },
    { value: 'barcelona', label: 'Barcelona' },
    { value: 'madrid', label: 'Madrid' },
    { value: 'new-york', label: 'New York' },
  ];

  const eventOptions = [
    { value: '', label: 'Select a city and search for an event' },
    { value: 'sensas', label: 'SENSAS - A sensory experience' },
    { value: 'candlelight', label: 'Candlelight Concert' },
  ];

  const venueOptions = [
    { value: '', label: 'Venue' },
    { value: 'sensas-barcelona', label: 'SENSAS Barcelona' },
    { value: 'palau-musica', label: 'Palau de la Música' },
  ];

  const statusOptions = [
    { value: 'paid,to_be_paid', label: 'Paid, To be paid' },
    { value: 'paid', label: 'Paid' },
    { value: 'to_be_paid', label: 'To be paid' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'all', label: 'All Statuses' },
  ];

  const businessTypeOptions = [
    { value: '', label: 'Select option(s)' },
    { value: 'partner', label: 'Partner' },
    { value: 'business', label: 'Business' },
  ];

  return (
    <div className="flex h-screen overflow-hidden font-[Montserrat,sans-serif]">
      {/* Sidebar */}
      <Sidebar activeItem="reservations" activeChild="overview" />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar userName="SO Test" onCreateEvent={() => router.push('/events/new')} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[var(--palette-neutral-100)]">
          {/* Hero Header Section - Dark Background */}
          <div
            className="flex flex-col gap-4 p-6"
            style={{ backgroundColor: '#06232c' }}
          >
            {/* Title */}
            <div className="flex items-center gap-1">
              <h1
                className="font-semibold"
                style={{
                  fontSize: '24px',
                  lineHeight: '28px',
                  color: '#ffffff',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Reservations
              </h1>
            </div>

            {/* Filters Row */}
            <div className="flex items-center gap-6">
              {/* City Select - Fixed width 240px */}
              <div className="w-[240px] shrink-0">
                <FieldSelect
                  label="City"
                  placeholder="All cities"
                  value={cityFilter}
                  onChange={(v) => setCityFilter(v as string)}
                  options={cityOptions}
                />
              </div>

              {/* Event Search/Select - Flex 1, takes remaining space */}
              <div className="flex-1 min-w-0">
                <FieldSelect
                  label="Search or type event"
                  placeholder="All events"
                  value={eventFilter}
                  onChange={(v) => setEventFilter(v as string)}
                  options={eventOptions}
                />
              </div>

              {/* Venue Select - Fixed width 320px */}
              <div className="w-[320px] shrink-0">
                <FieldSelect
                  label="Venue"
                  placeholder="All venues"
                  value={venueFilter}
                  onChange={(v) => setVenueFilter(v as string)}
                  options={venueOptions}
                />
              </div>

              {/* Show Button - Secondary style with white text on dark bg */}
              <button
                className="shrink-0 flex items-center justify-center font-semibold transition-colors hover:bg-white/10"
                style={{
                  height: '48px',
                  minWidth: '112px',
                  paddingLeft: '24px',
                  paddingRight: '24px',
                  borderRadius: '64px',
                  border: '2px solid #ccd2d8',
                  color: '#ffffff',
                  fontSize: '16px',
                  lineHeight: '24px',
                  fontFamily: 'Montserrat, sans-serif',
                  backgroundColor: 'transparent',
                }}
              >
                Show
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-6">
            {/* White Card Container */}
            <div className="rounded-[var(--dimensions-radii)] border border-[var(--border-main-default)] bg-[var(--background-main-default)]">
              {/* Card Header */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--border-main-default)]">
                <h2 className="text-[length:var(--size-h3)] font-[var(--weight-semibold)] leading-[var(--leading-h3)] text-[var(--text-main-default)]">
                  Reservations Overview
                </h2>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => router.push('/reservations/new/business')}
                >
                  Make a reservation
                </Button>
              </div>

              {/* Filters Section */}
              <div className="p-6">
                {/* Secondary Filters */}
                <div className="flex items-end gap-3 mb-4">
                  {/* Date Pill Button */}
                  <button
                    className="flex items-center gap-[var(--button-gap)] h-[56px] px-[var(--pills-padding-inline)] rounded-[var(--pills-radii)] border border-[var(--border-main-default)] bg-[var(--background-main-default)] text-[length:var(--size-small)] font-[var(--weight-semibold)] text-[var(--text-main-default)] hover:border-[var(--select-border-hover)] transition-colors"
                  >
                    <img alt="" src={iconCalendar} className="h-[18px] w-[18px] opacity-70" />
                    <span>Date</span>
                    <img alt="" src={iconChevronDown} className="h-4 w-4 opacity-50" />
                  </button>

                  {/* Search Input */}
                  <div className="flex-1 max-w-[380px]">
                    <FieldSearch
                      label="Reservation ID, Recipient or Business"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      showClearButton
                      onClear={() => setSearchQuery('')}
                    />
                  </div>

                  {/* Status Select */}
                  <div className="w-[180px]">
                    <FieldSelect
                      label="Status"
                      value={statusFilter}
                      onChange={(v) => setStatusFilter(v as string)}
                      options={statusOptions}
                    />
                  </div>

                  {/* Business Type Select */}
                  <div className="w-[180px]">
                    <FieldSelect
                      label="Business type"
                      placeholder="Select option(s)"
                      value={businessTypeFilter}
                      onChange={(v) => setBusinessTypeFilter(v as string)}
                      options={businessTypeOptions}
                    />
                  </div>
                </div>

                {/* Results count */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[length:var(--size-small)] font-[var(--weight-semibold)] text-[var(--text-main-default)]">
                    {reservations.length}
                  </span>
                  <span className="text-[length:var(--size-small)] text-[var(--text-subtle-default)]">
                    reservation{reservations.length !== 1 ? 's' : ''} with the filters applied
                  </span>
                  <button
                    className="ml-1 flex h-7 w-7 items-center justify-center rounded-[var(--tag-radii)] border border-[var(--border-main-default)] bg-[var(--background-main-default)] hover:bg-[var(--palette-neutral-100)] transition-colors"
                  >
                    <img alt="Export" src={iconExport} className="h-4 w-4 opacity-60" />
                  </button>
                </div>

                {/* Reservations Table */}
                {reservations.length > 0 && (
                  <div className="overflow-x-auto -mx-6">
                    <table className="w-full min-w-[900px]">
                      <thead>
                        <tr className="border-y border-[var(--border-main-default)] bg-[var(--palette-neutral-50)]">
                          <th className="px-6 py-3 text-left text-[length:var(--size-caption)] font-[var(--weight-semibold)] text-[var(--text-subtle-default)]">
                            Event Date <span className="opacity-50">↑↓</span>
                          </th>
                          <th className="px-4 py-3 text-left text-[length:var(--size-caption)] font-[var(--weight-semibold)] text-[var(--text-subtle-default)]">
                            Booking Agent
                          </th>
                          <th className="px-4 py-3 text-left text-[length:var(--size-caption)] font-[var(--weight-semibold)] text-[var(--text-subtle-default)]">
                            Event <span className="opacity-50">↑↓</span>
                          </th>
                          <th className="px-4 py-3 text-left text-[length:var(--size-caption)] font-[var(--weight-semibold)] text-[var(--text-subtle-default)]">
                            Reservation ID
                          </th>
                          <th className="px-4 py-3 text-left text-[length:var(--size-caption)] font-[var(--weight-semibold)] text-[var(--text-subtle-default)]">
                            Contact info <span className="opacity-50">↑↓</span>
                          </th>
                          <th className="px-4 py-3 text-center text-[length:var(--size-caption)] font-[var(--weight-semibold)] text-[var(--text-subtle-default)]">
                            #Tickets
                          </th>
                          <th className="px-4 py-3 text-right text-[length:var(--size-caption)] font-[var(--weight-semibold)] text-[var(--text-subtle-default)]">
                            Total
                          </th>
                          <th className="px-4 py-3 text-left text-[length:var(--size-caption)] font-[var(--weight-semibold)] text-[var(--text-subtle-default)]">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-[length:var(--size-caption)] font-[var(--weight-semibold)] text-[var(--text-subtle-default)]">
                            Attendance
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations.map((reservation) => {
                          const statusBadge = getStatusBadge(reservation.status);
                          const eventDate = reservation.dateTime
                            ? new Date(reservation.dateTime)
                            : reservation.checkInDate;
                          const eventName = reservation.eventName || reservation.experienceName;
                          const numberOfTickets = reservation.numberOfTickets || reservation.numberOfGuests;
                          const bookingAgent = reservation.bookingAgentName || 'N/A';
                          const bookingAgentEmail = reservation.customerEmail;
                          const bookingAgentPhone = reservation.customerPhone;
                          const bookingAgentType = reservation.bookingAgentType;

                          return (
                            <tr
                              key={reservation.id}
                              className="border-b border-[var(--border-main-default)] cursor-pointer transition-colors hover:bg-[var(--palette-neutral-100)]"
                              onClick={() => router.push(`/reservations/${reservation.id}`)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-[length:var(--size-small)] font-[var(--weight-regular)] text-[var(--text-main-default)]">
                                  {formatDate(eventDate)}
                                </div>
                                <div className="text-[length:var(--size-caption)] text-[var(--text-subtle-default)]">
                                  {formatTime(eventDate)}
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                {bookingAgentType && (
                                  <span
                                    className="inline-block mb-1 px-[var(--tag-padding-inline)] py-0.5 rounded-[var(--tag-radii)] text-[length:var(--size-caption)] font-[var(--weight-semibold)] border"
                                    style={{
                                      color: 'var(--tag-info-fg)',
                                      borderColor: 'var(--tag-info-border)',
                                      backgroundColor: 'transparent',
                                    }}
                                  >
                                    {bookingAgentType}
                                  </span>
                                )}
                                <div className="text-[length:var(--size-small)] font-[var(--weight-semibold)] text-[var(--text-main-default)]">
                                  {bookingAgent}
                                </div>
                                <div className="text-[length:var(--size-caption)] text-[var(--action-primary)]">
                                  {bookingAgentEmail}
                                </div>
                                {bookingAgentPhone && (
                                  <div className="text-[length:var(--size-caption)] text-[var(--text-subtle-default)]">
                                    {bookingAgentPhone}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-4 max-w-[160px]">
                                <div className="line-clamp-2 text-[length:var(--size-small)] text-[var(--text-main-default)]">
                                  {eventName}
                                </div>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <span className="text-[length:var(--size-small)] font-mono text-[var(--text-subtle-default)]">
                                  {reservation.id}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <div className="text-[length:var(--size-caption)] text-[var(--action-primary)]">
                                  {reservation.customerEmail}
                                </div>
                              </td>
                              <td className="px-4 py-4 text-center">
                                <span className="text-[length:var(--size-small)] text-[var(--text-main-default)]">
                                  {numberOfTickets}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-right whitespace-nowrap">
                                <span className="text-[length:var(--size-small)] font-[var(--weight-regular)] text-[var(--text-main-default)]">
                                  ${reservation.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <Badge variant={statusBadge.variant} badgeStyle="dot">
                                  {statusBadge.label}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                {reservation.status === ReservationStatus.PAID && !reservation.attendanceConfirmed && (
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleConfirmArrival(reservation.id);
                                    }}
                                  >
                                    Confirm arrival
                                  </Button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Empty State */}
                {reservations.length === 0 && (
                  <div className="py-12 text-center">
                    <h3 className="text-[length:var(--size-base)] font-[var(--weight-semibold)] text-[var(--text-main-default)]">
                      No reservations found
                    </h3>
                    <p className="mt-2 text-[length:var(--size-small)] text-[var(--text-subtle-default)]">
                      Try adjusting your search or filter criteria.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
