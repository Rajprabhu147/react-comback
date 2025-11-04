import React from "react";
import TicketItem from "./TicketItem";

// TicketList component displays a list of tickets or a fallback message if none exist
export default function TicketList({ tickets, onUpdate, onDelete }) {
  // If there are no tickets after filtering, show a friendly message
  if (!tickets.length) return <p>No tickets matched your filter.</p>;

  return (
    // Render a list without default bullet styling
    <ul style={{ listStyle: "none", padding: 0 }}>
      {/* Map over the tickets array and render a TicketItem for each ticket */}
      {tickets.map((t) => (
        <TicketItem
          key={t.id} // Unique key helps React efficiently re-render lists
          ticket={t} // Pass the ticket data as a prop
          onUpdate={onUpdate} // Pass down the update handler to child
          onDelete={() => onDelete(t.id)} // Wrap onDelete to pass the current ticket ID
        />
      ))}
    </ul>
  );
}
