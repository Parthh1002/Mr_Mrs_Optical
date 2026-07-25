'use client';

import { create } from 'zustand';

interface BookingModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useBookingModal = create<BookingModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
