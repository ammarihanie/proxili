import { create } from 'zustand';

export const useAppStore = create((set) => ({
  selectedEventId: null,
  searchQuery: '',
  setSelectedEventId: (selectedEventId) => set({ selectedEventId }),
  setSearchQuery: (searchQuery) => set({ searchQuery })
}));
