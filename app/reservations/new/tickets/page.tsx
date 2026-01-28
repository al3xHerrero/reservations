'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, Card, Button, Cart, FlowHeader } from '@/ui';
import { useReservationWizard, Ticket } from '@/contexts/ReservationWizardContext';

// Mock ticket types
const mockTicketTypes: Ticket[] = [
  {
    ticketTypeId: '1',
    title: 'General Admission',
    price: 50,
    availability: 100,
    quantity: 0,
  },
  {
    ticketTypeId: '2',
    title: 'VIP',
    price: 150,
    availability: 20,
    quantity: 0,
  },
  {
    ticketTypeId: '3',
    title: 'Premium',
    price: 100,
    availability: 50,
    quantity: 0,
  },
];

export default function TicketsSelectionPage() {
  const router = useRouter();
  const { state, updateTickets, updateDateTime } = useReservationWizard();
  const [tickets, setTickets] = useState<Ticket[]>(
    state.selectedTickets.length > 0
      ? state.selectedTickets
      : mockTicketTypes.map((t) => ({ ...t, quantity: 0 }))
  );
  const [selectedDateTime, setSelectedDateTime] = useState<string>(
    state.selectedDateTime || (state.selectedEvent?.dates[0] || '')
  );
  const [error, setError] = useState<string>('');

  const availableDates = state.selectedEvent?.dates || [];

  const cartTotal = useMemo(() => {
    return tickets.reduce((sum, ticket) => sum + ticket.price * ticket.quantity, 0);
  }, [tickets]);

  const cartItemCount = useMemo(() => {
    return tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
  }, [tickets]);

  const cartDateLabel = selectedDateTime
    ? new Date(selectedDateTime).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : undefined;

  const cartItems = tickets
    .filter((ticket) => ticket.quantity > 0)
    .map((ticket) => ({
      id: ticket.ticketTypeId,
      quantity: ticket.quantity,
      title: ticket.title,
      price: ticket.price * ticket.quantity,
    }));

  const handleQuantityChange = (ticketTypeId: string, delta: number) => {
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.ticketTypeId === ticketTypeId) {
          const newQuantity = Math.max(0, Math.min(ticket.availability, ticket.quantity + delta));
          return { ...ticket, quantity: newQuantity };
        }
        return ticket;
      })
    );
    setError('');
  };

  const handleContinue = () => {
    const selectedTickets = tickets.filter((t) => t.quantity > 0);
    if (selectedTickets.length === 0) {
      setError('Please add at least one ticket to continue');
      return;
    }
    if (availableDates.length > 0 && !selectedDateTime) {
      setError('Please select a date and time');
      return;
    }
    updateTickets(selectedTickets);
    updateDateTime(selectedDateTime);
    router.push('/reservations/new/contact');
  };

  const handleBack = () => {
    router.push('/reservations/new/event');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
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
            <Cart
              title="Cart"
              dateLabel={cartDateLabel}
              items={cartItems}
              emptyState={{
                title: 'No tickets selected',
                description: 'Choose event dates and tickets to build the new reservation.',
              }}
              totalLabel="Total"
              totalAmount={cartTotal}
            />

            {state.selectedEvent && (
              <Card title="Event Information">
                <div className="space-y-2">
                  <p className="text-text font-medium">{state.selectedEvent.name}</p>
                  <p className="text-sm text-muted">{state.selectedEvent.venue}</p>
                  <p className="text-sm text-muted">{state.selectedEvent.address}</p>
                </div>
              </Card>
            )}
          </div>

          {/* Right column - Main form */}
          <div className="lg:col-span-2">
            <Card title="Select Tickets">
              <div className="space-y-6">
                {/* Date & Time selector */}
                {availableDates.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-text mb-3">
                      Date & Time
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableDates.map((date) => (
                        <button
                          key={date}
                          onClick={() => {
                            setSelectedDateTime(date);
                            setError('');
                          }}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            selectedDateTime === date
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-bg text-text border-border hover:bg-surface'
                          }`}
                        >
                          {formatDate(date)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ticket category selector */}
                <div>
                  <label className="block text-sm font-medium text-text mb-3">
                    Ticket Categories
                  </label>
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div
                        key={ticket.ticketTypeId}
                        className="p-4 border border-border rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-text">{ticket.title}</h4>
                            <p className="text-sm text-muted">
                              ${ticket.price.toFixed(2)} • {ticket.availability} available
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleQuantityChange(ticket.ticketTypeId, -1)}
                            disabled={ticket.quantity === 0}
                            className="w-8 h-8 rounded border border-border bg-bg text-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface"
                          >
                            −
                          </button>
                          <span className="text-text font-medium min-w-[2rem] text-center">
                            {ticket.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(ticket.ticketTypeId, 1)}
                            disabled={ticket.quantity >= ticket.availability}
                            className="w-8 h-8 rounded border border-border bg-bg text-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {error && <p className="text-sm text-error">{error}</p>}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <Button variant="secondary" onClick={handleBack}>
                    Back
                  </Button>
                  <Button variant="primary" onClick={handleContinue} disabled={cartItemCount === 0}>
                    Continue
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
