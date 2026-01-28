# Reservations - States

This document defines the reservation UI states and the allowed transitions between them. It is intended to be product- and engineering-friendly and reflects the user-facing status model only.

## 1. UI Statuses (only)

The Reservation UI status is one of:
- **Paid**
- **To be paid**
- **Cancelled**
- **Expired**

No other statuses should be introduced in the UI.

## 2. State Definitions (meaning + invariants)

### 2.1 To be paid

Meaning:
- A reservation exists and inventory is held.
- Payment has not been completed.

Invariants:
- An expiration policy/time must exist.
- Payment actions may be available (pay now, payment link).
- Inventory is reserved until cancellation or expiration.

### 2.2 Paid

Meaning:
- Payment completed successfully for the reservation.

Invariants:
- Tickets/QRs can be issued (if applicable).
- No further payment is required for the reservation in the normal flow.

### 2.3 Cancelled

Meaning:
- The reservation has been cancelled by a user action.

Invariants:
- Read-only record in the normal flow.
- No payment actions are allowed.
- Inventory is released.

### 2.4 Expired

Meaning:
- The reservation was not paid in time and expired due to the expiration policy.

Invariants:
- Read-only record in the normal flow.
- No payment actions are allowed.
- Inventory is released.

## 3. State Machine (transitions + triggers)

### 3.1 Allowed transitions

- **To be paid → Paid**
  - Trigger: payment success (card, balance, payment link completion).
- **To be paid → Cancelled**
  - Trigger: user cancels reservation.
- **To be paid → Expired**
  - Trigger: expiration timer reaches deadline.

No other transitions are allowed in the normal flow.

### 3.2 Terminal states

Terminal states (no outgoing transitions in the normal flow):
- **Cancelled**
- **Expired**
- **Paid** (treated as terminal for the standard flow)

## 4. Guardrails

- A reservation in **Expired** or **Cancelled** cannot be paid.
- A reservation in **Paid** cannot return to **To be paid** in the normal flow.
- Creating a reservation without a valid expiration policy is not allowed if it would become **To be paid**.

## 5. Events that cause transitions

- **Payment success** → `To be paid` becomes `Paid`.
- **Cancel action** → `To be paid` becomes `Cancelled`.
- **Expiration timer** → `To be paid` becomes `Expired`.

## 6. Note on "Order"

The internal "Order" concept maps to the UI status **Paid** and must not be introduced as a separate UI state.

## 7. Payment-triggered transitions

- **To be paid → Paid** (Card / Balance / Mark as paid / Payment link paid successfully)
- **To be paid → Expired** (expiration deadline reached)
