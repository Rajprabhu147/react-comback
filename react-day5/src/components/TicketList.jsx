import React from "react";
import TicketItem from "./TicketItem";

export default function TicketList({ tickets, onUpdate, onDelete }) {
  if (!tickets.length) return <p>No tickets matched your filter.</p>;
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {tickets.map((t) => (
        <TicketItem
          key={t.id}
          ticket={t}
          onUpdate={onUpdate}
          onDelete={() => onDelete(t.id)}
        />
      ))}
    </ul>
  );
}
