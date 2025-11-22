import React from 'react';
import { useNotificationStore } from '../../store/notificationStore';

/**
 * NotificationFilters
 *
 * Displays filter buttons (All, Unread, Items, System)
 * and updates the active filter in the global notification store.
 *
 * This component helps users quickly sort through notifications by category.
 */
const NotificationFilters = () => {
  // Pull current filter, setter, and notifications list from the global store (Zustand)
  const { filter, setFilter, notifications } = useNotificationStore();

  // Define the available filters dynamically, including counts for each category.
  // Count values are calculated on render using notification list from store.
  const filters = [
    { 
      id: 'all', 
      label: 'All', 
      count: notifications.length 
    },
    {
      id: 'unread',
      label: 'Unread',
      count: notifications.filter((n) => !n.read).length,
    },
    {
      id: 'items',
      label: 'Items',
      count: notifications.filter((n) => n.category === 'items').length,
    },
    {
      id: 'system',
      label: 'System',
      count: notifications.filter((n) => n.category === 'system').length,
    },
  ];

  return (
    // Wrapper for all filter buttons
    <div className="notification-filters">
      {/* Render each filter button */}
      {filters.map((f) => (
        <button
          key={f.id} // unique key for React list rendering
          className={`filter-btn ${filter === f.id ? 'active' : ''}`} // highlight active filter
          onClick={() => setFilter(f.id)} // update filter in global state
        >
          {/* Label text, e.g., "Unread", "System" */}
          <span className="filter-label">{f.label}</span>

          {/* Count badge showing number of matching notifications */}
          <span className="filter-count">{f.count}</span>
        </button>
      ))}
    </div>
  );
};

export default NotificationFilters;

