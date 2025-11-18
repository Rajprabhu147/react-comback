import { create } from "zustand";

export const useUIStore = create((set) => ({
  // Filters
  searchQuery: "",
  statusFilter: "all",
  priorityFilter: "all",

  // UI State
  isEditing: false,
  selectedItem: null,
  sidebarOpen: true,

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority }),
  setSelectedItem: (item) => set({ selectedItem: item, isEditing: !!item }),
  clearSelection: () => set({ selectedItem: null, isEditing: false }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Reset all filters
  resetFilters: () =>
    set({
      searchQuery: "",
      statusFilter: "all",
      priorityFilter: "all",
    }),
}));
