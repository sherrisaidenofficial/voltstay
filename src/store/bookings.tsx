"use client";

import { createContext, useCallback, useContext, useMemo, useReducer, useSyncExternalStore, type ReactNode } from "react";

import { actionsFor, applyAction, createBooking, type BookingAction, type BookingRequest, type Role } from "@/domain/booking";
import type { Result } from "@/domain/result";
import type { Booking } from "@/domain/types";

import { seedBookings } from "./seed-bookings";

type Action = { type: "add"; booking: Booking } | { type: "replace"; booking: Booking };

function reducer(state: Booking[], action: Action): Booking[] {
  switch (action.type) {
    case "add":
      return [action.booking, ...state];
    case "replace":
      return state.map((b) => (b.id === action.booking.id ? action.booking : b));
  }
}

interface BookingStore {
  ready: boolean;
  bookings: Booking[];
  create: (request: Omit<BookingRequest, "guest"> & { guest: BookingRequest["guest"] }) => Result<Booking>;
  act: (id: string, action: BookingAction, role: Role) => Result<Booking>;
  actionsFor: (booking: Booking, role: Role) => BookingAction[];
  byGuest: (guestId: string) => Booking[];
  byHost: (hostId: string) => Booking[];
  forListing: (listingId: string) => Booking[];
}

const BookingContext = createContext<BookingStore | null>(null);

const subscribeNoop = () => () => {};
let counter = 0;
const nextId = () => `bk-${Date.now().toString(36)}-${++counter}`;

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, dispatch] = useReducer(reducer, undefined, seedBookings);
  const ready = useSyncExternalStore(subscribeNoop, () => true, () => false);

  const create = useCallback<BookingStore["create"]>(
    (request) => {
      const result = createBooking(request, { existing: bookings, id: nextId });
      if (result.ok) dispatch({ type: "add", booking: result.value });
      return result;
    },
    [bookings],
  );

  const act = useCallback<BookingStore["act"]>(
    (id, action, role) => {
      const booking = bookings.find((b) => b.id === id);
      if (!booking) return { ok: false, errors: { id: "Booking not found." } };
      const result = applyAction(booking, action, role);
      if (result.ok) dispatch({ type: "replace", booking: result.value });
      return result;
    },
    [bookings],
  );

  const value = useMemo<BookingStore>(
    () => ({
      ready,
      bookings,
      create,
      act,
      actionsFor: (booking, role) => actionsFor(booking, role),
      byGuest: (guestId) => bookings.filter((b) => b.guestId === guestId),
      byHost: (hostId) => bookings.filter((b) => b.hostId === hostId),
      forListing: (listingId) => bookings.filter((b) => b.listingId === listingId),
    }),
    [ready, bookings, create, act],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBookings(): BookingStore {
  const store = useContext(BookingContext);
  if (!store) throw new Error("useBookings must be used inside BookingProvider");
  return store;
}
