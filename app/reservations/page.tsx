'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ReservationStatus } from '@/domain/reservation';
import { EVENT_PROFILES, getAllReservations } from '@/domain/mockReservations';
import {
  Button,
  FieldSelect,
  FieldSearch,
  Sidebar,
  Tag,
  IconCircleCheck,
  IconCircleExclamation,
  IconCalendar,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconXmark,
  IconClipboardList,
} from '@/ui';
import { TOPBAR_HEIGHT } from '@/ui/TopBar';

// Status options for multi-select
const STATUS_OPTIONS = [
  { value: 'to_be_paid', label: 'To be paid' },
  { value: 'paid', label: 'Paid' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'expired', label: 'Expired' },
];

// Business type options for multi-select
const BUSINESS_TYPE_OPTIONS = [
  { value: 'agency', label: 'Agency' },
  { value: 'educational', label: 'Educational' },
  { value: 'guide', label: 'Guide' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'large_group', label: 'Large Group' },
  { value: 'premium_services', label: 'Premium Services' },
  { value: 'sales_representative', label: 'Sales Representative' },
  { value: 'internal_operations', label: 'Internal Operations' },
  { value: 'partnerships', label: 'Partnerships' },
  { value: 'internal_comps', label: 'Internal Comps' },
  { value: 'invitations', label: 'Invitations' },
];

// =============================================================================
// Date Picker Modal Component
// =============================================================================

type QuickFilter = 'today' | 'this_month' | 'next_3_months' | null;

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateRange: DateRange;
  quickFilter: QuickFilter;
  onApply: (range: DateRange, quick: QuickFilter) => void;
}

function DatePickerModal({ isOpen, onClose, dateRange, quickFilter, onApply }: DatePickerModalProps) {
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<QuickFilter>(quickFilter);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const quickFilters: { value: QuickFilter; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: 'this_month', label: 'This month' },
    { value: 'next_3_months', label: 'Next 3 months' },
  ];

  // Week starts on Sunday
  const getMonthDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // Sunday = 0

    const days: (Date | null)[] = [];
    
    // Add empty slots for days before the first day
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleQuickFilterClick = (filter: QuickFilter) => {
    setSelectedQuickFilter(filter);
  };

  const handleShowResults = () => {
    // Calculate date range based on quick filter
    let range: DateRange = { start: null, end: null };
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (selectedQuickFilter === 'today') {
      range = { start: now, end: now };
    } else if (selectedQuickFilter === 'this_month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      range = { start, end };
    } else if (selectedQuickFilter === 'next_3_months') {
      const start = now;
      const end = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
      range = { start, end };
    }

    onApply(range, selectedQuickFilter);
    onClose();
  };

  const handleClearDates = () => {
    onApply({ start: null, end: null }, null);
    onClose();
  };

  if (!isOpen) return null;

  // Weekday labels starting with Sunday
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const renderCalendarMonth = (monthDate: Date, showLeftNav: boolean, showRightNav: boolean) => {
    const days = getMonthDays(monthDate.getFullYear(), monthDate.getMonth());
    // Pad days to always have 6 rows (42 cells)
    while (days.length < 42) {
      days.push(null);
    }

    return (
      <div style={{ flex: 1 }}>
        {/* Month Header with Navigation */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: '8px 0',
            marginBottom: '0',
          }}
        >
          {/* Left navigation (only on first month) */}
          {showLeftNav ? (
            <button
              onClick={handlePrevMonth}
              className="flex items-center justify-center transition-colors"
              style={{
                width: '20px',
                height: '20px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
              }}
            >
              <IconChevronLeft size={14} color="var(--text-main-default)" />
            </button>
          ) : (
            <div style={{ width: '20px' }} />
          )}

          {/* Month Title */}
          <span
            style={{
              fontSize: 'var(--size-small)',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--text-main-default)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {formatMonthYear(monthDate)}
          </span>

          {/* Right navigation (only on second month) */}
          {showRightNav ? (
            <button
              onClick={handleNextMonth}
              className="flex items-center justify-center transition-colors"
              style={{
                width: '20px',
                height: '20px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
              }}
            >
              <IconChevronRight size={14} color="var(--text-main-default)" />
            </button>
          ) : (
            <div style={{ width: '20px' }} />
          )}
        </div>

        {/* Week Days Header */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: '8px',
            borderTop: '1px solid var(--border-main-default)',
            borderBottom: '1px solid var(--border-main-default)',
          }}
        >
          {weekDays.map((day, i) => (
            <div
              key={i}
              className="flex items-center justify-center"
              style={{
                width: '40px',
                fontSize: '10px',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--text-subtle-default)',
                fontFamily: 'var(--font-body)',
                textTransform: 'uppercase',
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
            padding: '16px 8px',
          }}
        >
          {days.map((day, i) => {
            const isTodayDate = day && isToday(day);
            
            return (
              <div
                key={i}
                className="flex items-center justify-center"
                style={{
                  width: '45px',
                  height: '48px',
                  borderRadius: '4px',
                  fontSize: 'var(--size-base)',
                  fontWeight: 'var(--weight-semibold)',
                  color: day
                    ? isTodayDate
                      ? 'var(--palette-neutral-white)'
                      : 'var(--text-main-default)'
                    : 'transparent',
                  backgroundColor: isTodayDate
                    ? 'var(--palette-neutral-700)'
                    : 'transparent',
                  fontFamily: 'var(--font-body)',
                  cursor: day ? 'pointer' : 'default',
                  opacity: day ? 1 : 0,
                }}
              >
                {day?.getDate() || ''}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
      onClick={onClose}
    >
      <div
        className="flex flex-col"
        style={{
          width: '846px',
          backgroundColor: 'var(--background-main-default)',
          borderRadius: 'var(--dimensions-radii)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.16)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: '24px',
            borderBottom: '1px solid var(--border-main-default)',
          }}
        >
          <span
            style={{
              fontSize: 'var(--size-h4)',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--text-main-default)',
              fontFamily: 'var(--font-body)',
              marginLeft: '8px',
            }}
          >
            Date
          </span>
          <button
            onClick={onClose}
            className="flex items-center justify-center transition-colors"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
          >
            <IconXmark size={20} color="var(--text-subtle-default)" />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '16px 24px 24px' }}>
          {/* Quick Filters */}
          <div
            className="flex items-center"
            style={{
              gap: '8px',
              marginBottom: '24px',
            }}
          >
            {quickFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => handleQuickFilterClick(filter.value)}
                style={{
                  padding: '6px 12px',
                  height: '32px',
                  borderRadius: '64px',
                  border: '1px solid var(--border-main-default)',
                  backgroundColor:
                    selectedQuickFilter === filter.value
                      ? 'var(--palette-neutral-700)'
                      : 'var(--background-main-default)',
                  color:
                    selectedQuickFilter === filter.value
                      ? 'var(--palette-neutral-white)'
                      : 'var(--text-main-default)',
                  fontSize: 'var(--size-small)',
                  fontWeight: 'var(--weight-semibold)',
                  fontFamily: 'var(--font-body)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Calendars */}
          <div
            className="flex"
            style={{
              gap: '40px',
              paddingBottom: '24px',
              borderBottom: '1px solid var(--border-main-default)',
            }}
          >
            {/* Month 1 - with left navigation */}
            {renderCalendarMonth(currentMonth, true, false)}

            {/* Month 2 - with right navigation */}
            {renderCalendarMonth(nextMonth, false, true)}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: '24px',
          }}
        >
          <Button
            variant="secondary"
            size="lg"
            onClick={handleClearDates}
          >
            <span className="flex items-center" style={{ gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 2V1H10.5V2H14V3H2V2H5.5ZM3 4H13L12.5 14H3.5L3 4ZM6 6V12H7V6H6ZM9 6V12H10V6H9Z" fill="currentColor"/>
              </svg>
              Clear dates
            </span>
          </Button>
          <Button variant="primary" size="lg" onClick={handleShowResults}>
            Show results
          </Button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Main Page Component
// =============================================================================

export default function ReservationsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>(['to_be_paid', 'paid']);
  const [cityFilter, setCityFilter] = useState<string>('');
  const [eventFilter, setEventFilter] = useState<string>('');
  const [venueFilter, setVenueFilter] = useState<string>('');
  const [businessTypeFilter, setBusinessTypeFilter] = useState<string[]>([]);
  
  // Date filter state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [quickDateFilter, setQuickDateFilter] = useState<QuickFilter>('next_3_months');

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

      if (statusFilter.length > 0) {
        filtered = filtered.filter((res) => {
          if (statusFilter.includes('paid') && res.status === ReservationStatus.PAID) return true;
          if (statusFilter.includes('to_be_paid') && res.status === ReservationStatus.TO_BE_PAID) return true;
          if (statusFilter.includes('cancelled') && res.status === ReservationStatus.CANCELLED) return true;
          if (statusFilter.includes('expired') && res.status === ReservationStatus.EXPIRED) return true;
          return false;
        });
      }

      // Date filter
      if (dateRange.start && dateRange.end) {
        filtered = filtered.filter((res) => {
          const eventDate = res.dateTime ? new Date(res.dateTime) : res.checkInDate;
          const d = new Date(eventDate);
          d.setHours(0, 0, 0, 0);
          return d >= dateRange.start! && d <= dateRange.end!;
        });
      }

      // Business type filter (multi-select)
      if (businessTypeFilter.length > 0) {
        filtered = filtered.filter((res) => {
          // Normalize the reservation's business type
          const resType = res.bookingAgentType?.toLowerCase().replace(/\s+/g, '_') || '';
          // Check if it matches any of the selected filters
          return businessTypeFilter.some((filterType) => {
            const normalizedFilter = filterType.toLowerCase().replace(/\s+/g, '_');
            return resType === normalizedFilter;
          });
        });
      }

      // City filter
      if (cityFilter && cityFilter !== '') {
        filtered = filtered.filter((res) => res.city === cityFilter);
      }

      // Event filter
      if (eventFilter && eventFilter !== '') {
        filtered = filtered.filter((res) => (res.eventName || res.experienceName) === eventFilter);
      }

      // Venue filter
      if (venueFilter && venueFilter !== '') {
        filtered = filtered.filter((res) => res.venue === venueFilter);
      }

      return filtered;
    } catch {
      return [];
    }
  }, [searchQuery, statusFilter, dateRange, businessTypeFilter, cityFilter, eventFilter, venueFilter]);

  const getStatusTag = (status: ReservationStatus): { 
    label: string; 
    sentiment: 'positive' | 'warning' | 'danger' | 'disabled';
    icon: React.ReactNode;
  } => {
    if (status === ReservationStatus.PAID) {
      return { 
        label: 'Paid', 
        sentiment: 'positive',
        icon: <IconCircleCheck color="#ffffff" />,
      };
    }
    if (status === ReservationStatus.TO_BE_PAID) {
      return { 
        label: 'To be paid', 
        sentiment: 'warning',
        icon: <IconCircleExclamation color="#ffffff" />,
      };
    }
    if (status === ReservationStatus.CANCELLED) {
      return { 
        label: 'Cancelled', 
        sentiment: 'disabled',
        icon: null,
      };
    }
    return { 
      label: 'Expired', 
      sentiment: 'disabled',
      icon: null,
    };
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

  const handleDateApply = (range: DateRange, quick: QuickFilter) => {
    setDateRange(range);
    setQuickDateFilter(quick);
  };

  const getDateButtonLabel = () => {
    if (quickDateFilter === 'today') return 'Today';
    if (quickDateFilter === 'this_month') return 'This month';
    if (quickDateFilter === 'next_3_months') return 'Next 3 months';
    return 'Dates';
  };

  const cityOptions = useMemo(() => {
    const cities = Array.from(new Set(EVENT_PROFILES.map((profile) => profile.city)));
    return [{ value: '', label: 'City' }, ...cities.map((city) => ({ value: city, label: city }))];
  }, []);

  const buildEventOptions = (targetCity: string) => {
    const baseOption = { value: '', label: 'Select a city and search for an event' };
    if (!targetCity) return [baseOption];

    const allReservations = getAllReservations();
    const eventsInCity = allReservations
      .filter((r) => r.city === targetCity)
      .map((r) => r.eventName || r.experienceName)
      .filter((name, index, self) => self.indexOf(name) === index); // unique

    return [
      baseOption,
      ...eventsInCity.map((name) => ({ value: name, label: name })),
    ];
  };

  const buildVenueOptions = (targetCity: string, targetEvent: string) => {
    const baseOption = { value: '', label: 'Venue' };
    if (!targetCity) return [baseOption];

    const allReservations = getAllReservations();
    let filtered = allReservations.filter((r) => r.city === targetCity);

    if (targetEvent) {
      filtered = filtered.filter((r) => (r.eventName || r.experienceName) === targetEvent);
    }

    const venues = filtered
      .map((r) => r.venue)
      .filter((v): v is string => !!v)
      .filter((name, index, self) => self.indexOf(name) === index); // unique

    return [
      baseOption,
      ...venues.map((name) => ({ value: name, label: name })),
    ];
  };

  // Event options based on selected city
  const eventOptions = useMemo(() => buildEventOptions(cityFilter), [cityFilter]);

  // Venue options based on selected city and event
  const venueOptions = useMemo(() => buildVenueOptions(cityFilter, eventFilter), [cityFilter, eventFilter]);


  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeItem="reservations" activeChild="overview" />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--palette-neutral-100)' }}>
          {/* Hero Header Section - Dark Background */}
          <div
            className="flex flex-col p-6"
            style={{
              backgroundColor: 'var(--palette-neutral-700)',
              gap: 'var(--leading-base)',
              marginTop: '40px',
            }}
          >
            {/* Title */}
            <h1
              style={{
                fontSize: 'var(--size-h2)',
                lineHeight: 'var(--leading-h2)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--palette-neutral-white)',
                fontFamily: 'var(--font-body)',
                margin: 0,
              }}
            >
              Reservations
            </h1>

            {/* Filters Row */}
            <div className="flex items-center" style={{ gap: 'var(--leading-base)' }}>
              {/* City Select - Fixed width */}
              <div style={{ width: '120px', flexShrink: 0 }}>
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

              {/* Event Select - Flex 1 */}
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

              {/* Venue Select - Fixed width */}
              <div style={{ width: '160px', flexShrink: 0 }}>
                <FieldSelect
                  label="Venue"
                  placeholder="Venue"
                  value={venueFilter}
                  onChange={(v) => setVenueFilter(v as string)}
                  options={venueOptions}
                />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div style={{ padding: 'var(--leading-base)' }}>
            {/* White Card Container */}
            <div
              style={{
                borderRadius: 'var(--dimensions-radii)',
                border: '1px solid var(--border-main-default)',
                backgroundColor: 'var(--background-main-default)',
              }}
            >
              {/* Card Header */}
              <div
                className="flex items-center justify-between"
                style={{
                  padding: 'var(--leading-base)',
                  borderBottom: '1px solid var(--border-main-default)',
                }}
              >
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
              <div style={{ padding: 'var(--leading-base)' }}>
                {/* Secondary Filters */}
                <div
                  className="flex items-center"
                  style={{ gap: 'var(--space-3)', marginBottom: 'var(--leading-caption)' }}
                >
                  {/* Date Pill Button */}
                  <button
                    onClick={() => setIsDatePickerOpen(true)}
                    className="flex items-center transition-colors"
                    style={{
                      gap: 'var(--dimensions-gap)',
                      height: '40px',
                      paddingLeft: 'var(--space-3)',
                      paddingRight: 'var(--space-3)',
                      borderRadius: '64px',
                      border: quickDateFilter
                        ? '1px solid var(--action-border-primary-default)'
                        : '1px solid var(--border-main-default)',
                      backgroundColor: quickDateFilter
                        ? 'var(--palette-primary-100)'
                        : 'var(--background-main-default)',
                      fontSize: 'var(--size-small)',
                      fontWeight: 'var(--weight-semibold)',
                      color: 'var(--text-main-default)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    <IconCalendar size={18} color="var(--text-subtle-default)" />
                    <span>{getDateButtonLabel()}</span>
                    <IconChevronDown size={16} color="var(--text-subtle-default)" />
                  </button>

                  {/* Search Input */}
                  <div className="flex-1" style={{ maxWidth: '380px' }}>
                    <FieldSearch
                      label="Reservation ID, Recipient or Business"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      showClearButton
                      onClear={() => setSearchQuery('')}
                    />
                  </div>

                  {/* Status Multi-Select */}
                  <div className="flex-1 min-w-0">
                    <FieldSelect
                      label="Status"
                      placeholder="All statuses"
                      value={statusFilter}
                      onChange={(v) => setStatusFilter(Array.isArray(v) ? v : [v])}
                      options={STATUS_OPTIONS}
                      multiple
                      displayValue={
                        statusFilter.length === 0 || statusFilter.length === STATUS_OPTIONS.length
                          ? 'All statuses'
                          : undefined
                      }
                    />
                  </div>

                  {/* Business Type Multi-Select */}
                  <div className="flex-1 min-w-0">
                    <FieldSelect
                      label="Business type"
                      placeholder="All business types"
                      value={businessTypeFilter}
                      onChange={(v) => setBusinessTypeFilter(Array.isArray(v) ? v : [v])}
                      options={BUSINESS_TYPE_OPTIONS}
                      multiple
                      displayValue={
                        businessTypeFilter.length === 0 || businessTypeFilter.length === BUSINESS_TYPE_OPTIONS.length
                          ? 'All business types'
                          : undefined
                      }
                    />
                  </div>
                </div>

                {/* Results count */}
                <div
                  className="flex items-center"
                  style={{ gap: 'var(--space-2)', marginBottom: 'var(--leading-caption)' }}
                >
                  <span
                    style={{
                      fontSize: 'var(--size-small)',
                      fontWeight: 'var(--weight-semibold)',
                      color: 'var(--text-main-default)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {reservations.length}
                  </span>
                  <span
                    style={{
                      fontSize: 'var(--size-small)',
                      fontWeight: 'var(--weight-regular)',
                      color: 'var(--text-subtle-default)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    reservation{reservations.length !== 1 ? 's' : ''} with the filters applied
                  </span>
                  <button
                    className="flex items-center justify-center transition-colors"
                    style={{
                      marginLeft: '4px',
                      width: '28px',
                      height: '28px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-main-default)',
                      backgroundColor: 'var(--background-main-default)',
                    }}
                  >
                    <IconClipboardList size={16} color="var(--text-subtle-default)" />
                  </button>
                </div>

                {/* Reservations Table */}
                {reservations.length > 0 && (
                  <div className="overflow-x-auto" style={{ marginLeft: '-24px', marginRight: '-24px' }}>
                    <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr
                          style={{
                            borderTop: '1px solid var(--border-main-default)',
                            borderBottom: '1px solid var(--border-main-default)',
                            backgroundColor: 'var(--palette-neutral-50)',
                          }}
                        >
                          <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: 'var(--size-caption)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-subtle-default)', fontFamily: 'var(--font-body)' }}>
                            Event Date <span style={{ opacity: 0.5 }}>↑↓</span>
                          </th>
                          <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 'var(--size-caption)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-subtle-default)', fontFamily: 'var(--font-body)' }}>
                            Business
                          </th>
                          <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 'var(--size-caption)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-subtle-default)', fontFamily: 'var(--font-body)' }}>
                            Event
                          </th>
                          <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 'var(--size-caption)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-subtle-default)', fontFamily: 'var(--font-body)' }}>
                            Reservation ID
                          </th>
                          <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 'var(--size-caption)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-subtle-default)', fontFamily: 'var(--font-body)' }}>
                            Contact info
                          </th>
                          <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 'var(--size-caption)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-subtle-default)', fontFamily: 'var(--font-body)' }}>
                            # Tickets
                          </th>
                          <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 'var(--size-caption)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-subtle-default)', fontFamily: 'var(--font-body)' }}>
                            Total
                          </th>
                          <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 'var(--size-caption)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-subtle-default)', fontFamily: 'var(--font-body)' }}>
                            Status <span style={{ opacity: 0.5 }}>↑↓</span>
                          </th>
                          <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: 'var(--size-caption)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-subtle-default)', fontFamily: 'var(--font-body)' }}>
                            Attendance
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations.map((reservation) => {
                          const statusTag = getStatusTag(reservation.status);
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
                              className="cursor-pointer transition-colors"
                              style={{ borderBottom: '1px solid var(--border-main-default)' }}
                              onClick={() => router.push(`/reservations/${reservation.id}`)}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--palette-neutral-100)')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                                <div style={{ fontSize: 'var(--size-small)', fontWeight: 'var(--weight-regular)', color: 'var(--text-main-default)', fontFamily: 'var(--font-body)' }}>
                                  {formatDate(eventDate)}
                                </div>
                                <div style={{ fontSize: 'var(--size-caption)', fontWeight: 'var(--weight-regular)', color: 'var(--text-subtle-default)', fontFamily: 'var(--font-body)' }}>
                                  {formatTime(eventDate)}
                                </div>
                              </td>
                              <td style={{ padding: '16px' }}>
                                {bookingAgentType && (
                                  <span
                                    style={{
                                      display: 'inline-block',
                                      marginBottom: '4px',
                                      padding: '2px 4px',
                                      borderRadius: '4px',
                                      fontSize: 'var(--size-caption)',
                                      fontWeight: 'var(--weight-semibold)',
                                      fontFamily: 'var(--font-body)',
                                      color: 'var(--action-text-primary-default)',
                                      border: '1px solid var(--palette-primary-500)',
                                      backgroundColor: 'transparent',
                                    }}
                                  >
                                    {bookingAgentType}
                                  </span>
                                )}
                                <div style={{ fontSize: 'var(--size-small)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-main-default)', fontFamily: 'var(--font-body)' }}>
                                  {bookingAgent}
                                </div>
                                <div style={{ fontSize: 'var(--size-caption)', color: 'var(--action-text-primary-default)', fontFamily: 'var(--font-body)' }}>
                                  {bookingAgentEmail}
                                </div>
                                {bookingAgentPhone && (
                                  <div style={{ fontSize: 'var(--size-caption)', color: 'var(--text-subtle-default)', fontFamily: 'var(--font-body)' }}>
                                    {bookingAgentPhone}
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: '16px' }}>
                                <div className="flex items-center" style={{ gap: '12px' }}>
                                  {/* Event Image */}
                                  {reservation.eventImage && (
                                    <img
                                      src={reservation.eventImage}
                                      alt={eventName}
                                      style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '4px',
                                        objectFit: 'cover',
                                        flexShrink: 0,
                                      }}
                                    />
                                  )}
                                  {/* Event Name */}
                                  <div className="line-clamp-2" style={{ fontSize: 'var(--size-small)', fontWeight: 'var(--weight-regular)', color: 'var(--text-main-default)', fontFamily: 'var(--font-body)' }}>
                                    {eventName}
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                                <span style={{ fontSize: 'var(--size-small)', fontFamily: 'monospace', color: 'var(--text-subtle-default)' }}>
                                  {reservation.id}
                                </span>
                              </td>
                              <td style={{ padding: '16px' }}>
                                <div style={{ fontSize: 'var(--size-caption)', color: 'var(--action-text-primary-default)', fontFamily: 'var(--font-body)' }}>
                                  {reservation.customerEmail}
                                </div>
                              </td>
                              <td style={{ padding: '16px', textAlign: 'center' }}>
                                <span style={{ fontSize: 'var(--size-small)', fontWeight: 'var(--weight-regular)', color: 'var(--text-main-default)', fontFamily: 'var(--font-body)' }}>
                                  {numberOfTickets}
                                </span>
                              </td>
                              <td style={{ padding: '16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                <span style={{ fontSize: 'var(--size-small)', fontWeight: 'var(--weight-regular)', color: 'var(--text-main-default)', fontFamily: 'var(--font-body)' }}>
                                  ${reservation.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                              </td>
                              <td style={{ padding: '16px' }}>
                                <Tag 
                                  sentiment={statusTag.sentiment} 
                                  tagStyle="solid"
                                  startIcon={statusTag.icon}
                                >
                                  {statusTag.label}
                                </Tag>
                              </td>
                              <td style={{ padding: '16px 24px' }}>
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
                  <div
                    className="flex flex-col items-center justify-center py-16"
                    style={{ gap: '12px' }}
                  >
                    <IconClipboardList size={48} color="var(--text-subtle-default)" />
                    <p
                      style={{
                        fontSize: 'var(--size-small)',
                        color: 'var(--text-subtle-default)',
                        fontFamily: 'var(--font-body)',
                        textAlign: 'center',
                        margin: 0,
                      }}
                    >
                      Sorry, we couldn't find reservations with your search criteria. Please change the filters and try again.
                    </p>
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => {
                        // Clear all filters except city and event
                        setSearchQuery('');
                        setStatusFilter([]); // All statuses
                        setVenueFilter('');
                        setBusinessTypeFilter([]);
                        setDateRange({ start: null, end: null });
                        setQuickDateFilter(null);
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Date Picker Modal */}
      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        dateRange={dateRange}
        quickFilter={quickDateFilter}
        onApply={handleDateApply}
      />
    </div>
  );
}
