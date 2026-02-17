'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Alert, Sidebar, Cart, IconButton, DateTile, TimeTile, Tile } from '@/ui';
import EventInfoCard from '../components/EventInfoCard';
import type { CartDateGroup } from '@/ui';
import { useReservationWizard, Ticket } from '@/contexts/ReservationWizardContext';
import { getEventTicketOptions, TicketOption } from '@/domain/mockReservations';
import ReservationWizardHeader from '../components/ReservationWizardHeader';



// Mock data
const mockDates = [
  { day: 'Fri', date: '8 Aug', value: '2025-08-08' },
  { day: 'Sat', date: '9 Aug', value: '2025-08-09' },
  { day: 'Sun', date: '10 Aug', value: '2025-08-10' },
];

const mockTimeSlots = [
  { label: 'Morning', range: '7:00 a 14:59', times: ['10:00', '11:00', '12:00'] },
];

const mockCategories = ['Fanstand', 'Birdie Shack', 'Birdie Shack Loge Box', 'Club 54', 'LIV Premium'];
const BOOKING_FEE_RATE = 0.09;
const calculateBookingFee = (price: number) => parseFloat((price * BOOKING_FEE_RATE).toFixed(2));

const mockEventDescription = `🍷 Wine Tasting bring the magic of a live, multi-sensory musical experience beyond Los Angeles. Get your tickets now to discover the music of Luis Miguel at Vertigo Event Venue under the gentle glow of candlelight.`;

const mockEventDetails = [
  { icon: '📍', text: 'Venue: Bodega Event Venue' },
  { icon: '📅', text: 'Dates and times: select your dates/times directly in the ticket selector' },
  { icon: '⏱', text: 'Duration: 65 minutes (doors open 45 mins prior to the start time and late entry is not permitted)' },
  { icon: '👤', text: 'Age requirement: 8 years old or older. Anyone under the age of 16 must be accompanied by an adult' },
  { icon: '♿', text: 'Accessibility: this venue is ADA compliant' },
  { icon: '❓', text: 'View the FAQs for this event', link: '#' },
  { icon: '💺', text: 'Seating is assigned on a first come first served basis in each zone' },
  { icon: '🎉', text: 'If you would like to book a private concert (min 40+ people), please click', link: '#' },
  { icon: '🎵', text: 'Check out all the Candlelight concerts in Los Angeles', link: '#' },
];

const buildTicketTemplate = (catalog: TicketOption[]): Ticket[] =>
  catalog.map((ticket) => ({
    ticketTypeId: ticket.id,
    title: ticket.title,
    price: ticket.price,
    availability: ticket.availability,
    quantity: 0,
  }));

// Type for storing tickets grouped by date/time/category
type TicketSelection = {
  dateValue: string;
  dateLabel: string;
  time: string;
  category: string;
  tickets: Ticket[];
};

export default function TicketsSelectionPage() {
  const router = useRouter();
  const { state, updateTickets, updateDateTime } = useReservationWizard();

  const eventTicketCatalog = useMemo(
    () => getEventTicketOptions(state.selectedEvent?.id),
    [state.selectedEvent?.id]
  );

  const [selectedDate, setSelectedDate] = useState<string>(mockDates[0].value);
  const [selectedTime, setSelectedTime] = useState<string>(mockTimeSlots[0].times[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>(mockCategories[0]);

  // Current tickets being edited (for the selected date/time/category)
  const [currentTickets, setCurrentTickets] = useState<Ticket[]>(
    () => buildTicketTemplate(eventTicketCatalog)
  );
  
  // All selections across different dates/times
  const [allSelections, setAllSelections] = useState<TicketSelection[]>([]);

  useEffect(() => {
    setCurrentTickets(buildTicketTemplate(eventTicketCatalog));
    setAllSelections([]);
    setSelectedDate(mockDates[0].value);
    setSelectedTime(mockTimeSlots[0].times[0]);
    setSelectedCategory(mockCategories[0]);
  }, [eventTicketCatalog]);
  
  // Track empty cart continue attempts (1=alert, 2=red border, 3+=flash)
  const [emptyCartAttempts, setEmptyCartAttempts] = useState(0);
  const [cartBorderFlash, setCartBorderFlash] = useState(false);

  // Get the current selection key
  const getCurrentKey = () => `${selectedDate}-${selectedTime}-${selectedCategory}`;
  
  // Get date label for display
  const getDateLabel = (dateValue: string, time: string) => {
    const dateInfo = mockDates.find(d => d.value === dateValue);
    return dateInfo ? `${dateInfo.date} 2025 ${time}` : '';
  };

  // Save current selection to allSelections when changing date/time/category
  const saveCurrentSelection = () => {
    const ticketsWithQty = currentTickets.filter(t => t.quantity > 0);
    if (ticketsWithQty.length === 0) return;
    
    const key = getCurrentKey();
    const dateLabel = getDateLabel(selectedDate, selectedTime);
    
    setAllSelections(prev => {
      // Check if this date/time/category already exists
      const existingIndex = prev.findIndex(
        s => s.dateValue === selectedDate && s.time === selectedTime && s.category === selectedCategory
      );
      
      if (existingIndex >= 0) {
        // Update existing
        const updated = [...prev];
        updated[existingIndex] = {
          dateValue: selectedDate,
          dateLabel,
          time: selectedTime,
          category: selectedCategory,
          tickets: ticketsWithQty,
        };
        return updated;
      } else {
        // Add new
        return [...prev, {
          dateValue: selectedDate,
          dateLabel,
          time: selectedTime,
          category: selectedCategory,
          tickets: ticketsWithQty,
        }];
      }
    });
  };

  // Load selection when changing date/time/category
  const loadSelection = (date: string, time: string, category: string) => {
    const existing = allSelections.find(
      s => s.dateValue === date && s.time === time && s.category === category
    );
    
    const template = buildTicketTemplate(eventTicketCatalog);
    if (existing) {
      // Restore quantities from saved selection
      setCurrentTickets(
        template.map((t) => {
          const saved = existing.tickets.find((st) => st.ticketTypeId === t.ticketTypeId);
          return saved ? { ...t, quantity: saved.quantity } : { ...t, quantity: 0 };
        })
      );
    } else {
      // Reset to zero
      setCurrentTickets(template);
    }
  };

  // Handle date change
  const handleDateChange = (newDate: string) => {
    saveCurrentSelection();
    setSelectedDate(newDate);
    loadSelection(newDate, selectedTime, selectedCategory);
  };

  // Handle time change
  const handleTimeChange = (newTime: string) => {
    saveCurrentSelection();
    setSelectedTime(newTime);
    loadSelection(selectedDate, newTime, selectedCategory);
  };

  // Handle category change
  const handleCategoryChange = (newCategory: string) => {
    saveCurrentSelection();
    setSelectedCategory(newCategory);
    loadSelection(selectedDate, selectedTime, newCategory);
  };

  // Calculate totals across all selections + current
  const { cartTotal, cartItemCount, cartDateGroups } = useMemo(() => {
    // First, save current tickets to a temporary combined list
    const currentWithQty = currentTickets.filter(t => t.quantity > 0);
    const currentDateLabel = getDateLabel(selectedDate, selectedTime);
    
    // Build a map of all selections, updating the current one
    const selectionsMap = new Map<string, TicketSelection>();
    
    // Add all saved selections
    allSelections.forEach(s => {
      const key = `${s.dateValue}-${s.time}-${s.category}`;
      selectionsMap.set(key, s);
    });
    
    // Update/add current selection
    if (currentWithQty.length > 0) {
      const currentKey = getCurrentKey();
      selectionsMap.set(currentKey, {
        dateValue: selectedDate,
        dateLabel: currentDateLabel,
        time: selectedTime,
        category: selectedCategory,
        tickets: currentWithQty,
      });
    }
    
    // Calculate totals
    let total = 0;
    let feeTotal = 0;
    let count = 0;
    
    selectionsMap.forEach(selection => {
      selection.tickets.forEach(ticket => {
        const feePerTicket = calculateBookingFee(ticket.price);
        total += ticket.price * ticket.quantity;
        feeTotal += feePerTicket * ticket.quantity;
        count += ticket.quantity;
      });
    });
    
    // Build cart date groups - group by date+time
    const groupsByDateTime = new Map<string, { dateLabel: string; items: CartDateGroup['items'] }>();
    
    selectionsMap.forEach(selection => {
      const groupKey = `${selection.dateValue}-${selection.time}`;
      const existing = groupsByDateTime.get(groupKey);
      
      const items = selection.tickets.map(ticket => {
        const feePerTicket = parseFloat((ticket.price * BOOKING_FEE_RATE).toFixed(2));
        const feeTotal = parseFloat((feePerTicket * ticket.quantity).toFixed(2));
        return {
          id: `${selection.category}-${ticket.ticketTypeId}`,
          quantity: ticket.quantity,
          title: `${selection.category} | ${ticket.title}`,
          price: ticket.price * ticket.quantity,
          feePerTicket,
          feeTotal,
        };
      });
      
      if (existing) {
        existing.items.push(...items);
      } else {
        groupsByDateTime.set(groupKey, {
          dateLabel: selection.dateLabel,
          items,
        });
      }
    });
    
    // Convert to array and sort by date
    const groups: CartDateGroup[] = Array.from(groupsByDateTime.entries())
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([, value]) => ({
        date: value.dateLabel,
        items: value.items,
      }));
    
    return { cartTotal: total + feeTotal, cartItemCount: count, cartDateGroups: groups };
  }, [currentTickets, allSelections, selectedDate, selectedTime, selectedCategory]);

  const handleQuantityChange = (ticketTypeId: string, newQuantity: number) => {
    setCurrentTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.ticketTypeId === ticketTypeId) {
          const qty = Math.max(0, Math.min(ticket.availability, newQuantity));
          return { ...ticket, quantity: qty };
        }
        return ticket;
      })
    );
    // Reset attempts when user adds tickets
    if (newQuantity > 0) {
      setEmptyCartAttempts(0);
    }
  };

  const handleClearAll = () => {
    setCurrentTickets(prev => prev.map(t => ({ ...t, quantity: 0 })));
    setAllSelections([]);
  };

  const handleContinue = () => {
    // Save current selection first
    saveCurrentSelection();
    
    if (cartItemCount === 0) {
      const newAttempts = emptyCartAttempts + 1;
      setEmptyCartAttempts(newAttempts);
      
      // From 3rd attempt onwards, flash the border
      if (newAttempts >= 3) {
        setCartBorderFlash(true);
        setTimeout(() => setCartBorderFlash(false), 300);
      }
      return;
    }
    
    // Reset attempts if successful
    setEmptyCartAttempts(0);
    
    // Collect all tickets from all selections
    const allTickets: Ticket[] = [];
    
    // Add from saved selections
    allSelections.forEach(selection => {
      selection.tickets.forEach(ticket => {
        allTickets.push(ticket);
      });
    });
    
    // Add current tickets if not already saved
    const currentWithQty = currentTickets.filter(t => t.quantity > 0);
    currentWithQty.forEach(ticket => {
      // Check if not already in allTickets
      const exists = allTickets.some(t => 
        t.ticketTypeId === ticket.ticketTypeId && 
        allSelections.some(s => 
          s.dateValue === selectedDate && 
          s.time === selectedTime && 
          s.category === selectedCategory
        )
      );
      if (!exists) {
        allTickets.push(ticket);
      }
    });
    
    updateTickets(allTickets);
    updateDateTime(`${selectedDate}T${selectedTime}:00`);
    router.push('/reservations/new/contact');
  };

  const handleBack = () => {
    router.push('/reservations/new/event');
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
              onNavigate: handleBack,
            },
            { label: 'Tickets' },
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
                />

                {/* Cart Component */}
                <Cart
                  title="Purchase details"
                  collapsible={false}
                  dateGroups={cartDateGroups}
                  emptyState={{
                    title: 'No tickets selected',
                    description: 'Choose event dates and tickets to build the new reservation.',
                    hasError: emptyCartAttempts >= 2,
                    isFlashing: cartBorderFlash,
                  }}
                  totalAmount={cartTotal}
                  totalLabel="Total"
                  onClearAll={cartItemCount > 0 ? handleClearAll : undefined}
                />

                {/* Event Description */}
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <p
                    style={{
                      fontSize: 'var(--size-small)',
                      lineHeight: 'var(--leading-small)',
                      color: 'var(--text-main-default)',
                      fontStyle: 'italic',
                      margin: 0,
                    }}
                  >
                    {mockEventDescription}
                  </p>
                  <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {mockEventDetails.map((detail, i) => (
                      <p
                        key={i}
                        style={{
                          fontSize: 'var(--size-small)',
                          lineHeight: 'var(--leading-small)',
                          color: 'var(--text-main-default)',
                          margin: 0,
                        }}
                      >
                        {detail.icon} {detail.text}
                        {detail.link && (
                          <a
                            href={detail.link}
                            style={{
                              color: 'var(--action-text-primary-default)',
                              marginLeft: '4px',
                            }}
                          >
                            here
                          </a>
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Ticket Selector */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Date & Time Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Date block */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3
                      style={{
                        fontSize: '16px',
                        lineHeight: '20px',
                        fontWeight: 600,
                        color: '#031419',
                        margin: 0,
                        fontFamily: 'var(--font-body), Montserrat, sans-serif',
                      }}
                    >
                      Date &amp; time
                    </h3>

                    {/* Date Tiles */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {mockDates.map((d) => (
                        <DateTile
                          key={d.value}
                          day={d.day}
                          date={d.date}
                          selected={selectedDate === d.value}
                          onClick={() => handleDateChange(d.value)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Time Slots */}
                  {mockTimeSlots.map((slot) => (
                    <div key={slot.label} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            fontSize: '14px',
                            lineHeight: '18px',
                            fontWeight: 600,
                            color: '#536b75',
                            fontFamily: 'var(--font-body), Montserrat, sans-serif',
                          }}
                        >
                          {slot.label}
                        </span>
                        <span
                          style={{
                            fontSize: '16px',
                            lineHeight: '24px',
                            fontWeight: 400,
                            color: '#536b75',
                            fontFamily: 'var(--font-body), Montserrat, sans-serif',
                          }}
                        >
                          {slot.range}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {slot.times.map((time) => (
                          <TimeTile
                            key={time}
                            time={time}
                            selected={selectedTime === time}
                            onClick={() => handleTimeChange(time)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div style={{ paddingTop: '16px' }}>
                  <div style={{ height: '1px', backgroundColor: '#ccd2d8' }} />
                </div>

                {/* Choose your tickets title */}
                <h3
                  style={{
                    fontSize: '16px',
                    lineHeight: '20px',
                    fontWeight: 600,
                    color: '#031419',
                    margin: 0,
                    fontFamily: 'var(--font-body), Montserrat, sans-serif',
                  }}
                >
                  Choose your tickets
                </h3>

                {/* Category Tiles */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {mockCategories.map((cat) => (
                    <Tile
                      key={cat}
                      label={cat}
                      selected={selectedCategory === cat}
                      onClick={() => handleCategoryChange(cat)}
                      autoWidth
                    />
                  ))}
                </div>

                {/* Ticket List Container */}
                <div
                  style={{
                    border: '1px solid #ccd2d8',
                    borderRadius: '8px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                  }}
                >
                  {currentTickets.map((ticket) => {
                    const feePerTicket = calculateBookingFee(ticket.price);
                    return (
                      <div
                        key={ticket.ticketTypeId}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '24px',
                        }}
                      >
                        {/* Ticket info */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span
                            style={{
                              fontSize: '16px',
                              lineHeight: '24px',
                              fontWeight: 400,
                              color: '#031419',
                              fontFamily: 'var(--font-body), Montserrat, sans-serif',
                            }}
                          >
                            {ticket.title}
                          </span>
                          <span
                            style={{
                              fontSize: '12px',
                              lineHeight: '16px',
                              fontWeight: 400,
                              color: '#536b75',
                              fontFamily: 'var(--font-body), Montserrat, sans-serif',
                            }}
                          >
                            {ticket.availability} available tickets left
                          </span>
                          <span
                            style={{
                              fontSize: '12px',
                              lineHeight: '16px',
                              fontWeight: 400,
                              color: '#536b75',
                              fontFamily: 'var(--font-body), Montserrat, sans-serif',
                            }}
                          >
                            Booking fee per ticket: ${feePerTicket.toFixed(2)}
                          </span>
                        </div>

                        {/* Price */}
                        <span
                          style={{
                            fontSize: '16px',
                            lineHeight: '24px',
                            fontWeight: 400,
                            color: '#031419',
                            fontFamily: 'var(--font-body), Montserrat, sans-serif',
                          }}
                        >
                          ${ticket.price.toFixed(2)}
                        </span>

                        {/* Quantity Selector */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <IconButton
                            icon="minus"
                            size="large"
                            sentiment="secondary"
                            disabled={ticket.quantity === 0}
                            onClick={() => handleQuantityChange(ticket.ticketTypeId, ticket.quantity - 1)}
                            aria-label="Decrease quantity"
                          />
                          <input
                            type="text"
                            value={ticket.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              if (!isNaN(val)) {
                                handleQuantityChange(ticket.ticketTypeId, val);
                              }
                            }}
                            style={{
                              width: '72px',
                              height: '56px',
                              textAlign: 'center',
                              border: '1px solid #ccd2d8',
                              borderRadius: '8px',
                              fontSize: '16px',
                              lineHeight: '24px',
                              fontWeight: 400,
                              color: '#536b75',
                              fontFamily: 'var(--font-body), Montserrat, sans-serif',
                              outline: 'none',
                            }}
                          />
                          <IconButton
                            icon="plus"
                            size="large"
                            sentiment="primary"
                            disabled={ticket.quantity >= ticket.availability}
                            onClick={() => handleQuantityChange(ticket.ticketTypeId, ticket.quantity + 1)}
                            aria-label="Increase quantity"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Warning Alert - shows from 1st attempt onwards */}
                {emptyCartAttempts >= 1 && cartItemCount === 0 && (
                  <Alert
                    title="The cart is empty. Please select at least one ticket to continue with the reservation."
                    sentiment="warning"
                    showCloseButton={false}
                    titleWeight={400}
                  />
                )}

                {/* Buttons */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 'var(--space-4)',
                  }}
                >
                  <Button variant="secondary" size="lg" onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleContinue}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
