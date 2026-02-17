'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Business {
  id: string;
  name: string;
  email: string;
  bookingAgentType: string;
  balanceAllowed: boolean;
}

export interface Event {
  id: string;
  name: string;
  venue: string;
  address: string;
  city: string;
  dates: string[];
  state: 'active' | 'not_for_sale';
  thumbnail?: string;
}

export interface Ticket {
  ticketTypeId: string;
  title: string;
  price: number;
  availability: number;
  quantity: number;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
}

export interface Override {
  enabled: boolean;
  mode: 'fixed' | 'percentage';
  action: 'add' | 'reduce' | 'set_final';
  value: number;
  concept: string;
}

export interface DepositChoice {
  type: 'full' | 'deposit';
  termsAccepted?: boolean;
}

export interface ReservationWizardState {
  selectedBusiness: Business | null;
  selectedEvent: Event | null;
  selectedTickets: Ticket[];
  selectedDateTime: string | null;
  contactInfo: ContactInfo;
  override: Override | null;
  depositChoice: DepositChoice | null;
}

const initialState: ReservationWizardState = {
  selectedBusiness: null,
  selectedEvent: null,
  selectedTickets: [],
  selectedDateTime: null,
  contactInfo: {
    name: '',
    email: '',
    phone: '',
  },
  override: null,
  depositChoice: null,
};

interface ReservationWizardContextType {
  state: ReservationWizardState;
  updateBusiness: (business: Business | null) => void;
  updateEvent: (event: Event | null) => void;
  updateTickets: (tickets: Ticket[]) => void;
  updateDateTime: (dateTime: string | null) => void;
  updateContactInfo: (contactInfo: Partial<ContactInfo>) => void;
  updateOverride: (override: Override | null) => void;
  updateDepositChoice: (choice: DepositChoice | null) => void;
  reset: () => void;
  checkoutTransitionRequested: boolean;
  showSuccessAlertOnCheckout: boolean;
  requestCheckoutTransition: (showAlert?: boolean) => void;
  consumeCheckoutTransition: () => void;
}

const ReservationWizardContext = createContext<ReservationWizardContextType | undefined>(undefined);

export function ReservationWizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ReservationWizardState>(initialState);
  const [checkoutTransitionRequested, setCheckoutTransitionRequested] = useState(false);
  const [showSuccessAlertOnCheckout, setShowSuccessAlertOnCheckout] = useState(false);

  const updateBusiness = (business: Business | null) => {
    setState((prev) => ({ ...prev, selectedBusiness: business }));
  };

  const updateEvent = (event: Event | null) => {
    setState((prev) => ({ ...prev, selectedEvent: event }));
  };

  const updateTickets = (tickets: Ticket[]) => {
    setState((prev) => ({ ...prev, selectedTickets: tickets }));
  };

  const updateDateTime = (dateTime: string | null) => {
    setState((prev) => ({ ...prev, selectedDateTime: dateTime }));
  };

  const updateContactInfo = (contactInfo: Partial<ContactInfo>) => {
    setState((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, ...contactInfo },
    }));
  };

  const updateOverride = (override: Override | null) => {
    setState((prev) => ({ ...prev, override }));
  };

  const updateDepositChoice = (choice: DepositChoice | null) => {
    setState((prev) => ({ ...prev, depositChoice: choice }));
  };

  const reset = () => {
    setState(initialState);
    setCheckoutTransitionRequested(false);
    setShowSuccessAlertOnCheckout(false);
  };

  const requestCheckoutTransition = (showAlert = true) => {
    setCheckoutTransitionRequested(true);
    setShowSuccessAlertOnCheckout(showAlert);
  };

  const consumeCheckoutTransition = () => {
    setCheckoutTransitionRequested(false);
  };

  return (
    <ReservationWizardContext.Provider
      value={{
        state,
        updateBusiness,
        updateEvent,
        updateTickets,
        updateDateTime,
        updateContactInfo,
        updateOverride,
        updateDepositChoice,
        reset,
        checkoutTransitionRequested,
        showSuccessAlertOnCheckout,
        requestCheckoutTransition,
        consumeCheckoutTransition,
      }}
    >
      {children}
    </ReservationWizardContext.Provider>
  );
}

export function useReservationWizard() {
  const context = useContext(ReservationWizardContext);
  if (context === undefined) {
    throw new Error('useReservationWizard must be used within a ReservationWizardProvider');
  }
  return context;
}
