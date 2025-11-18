import React from "react";
// Import the TicketManager component which contains the main ticket logic and fetching
import TicketManager from "../components/TicketManager"; // Importing TicketManager component from components folder

// TicketsPage is a page-level component responsible for displaying the tickets section
export default function TicketsPage() {
  return (
    <div>
      {/* Page heading */}
      <h2>Tickets</h2>
      {/* Render the TicketManager component which handles data fetching and ticket operations */}
      <TicketManager />
    </div>
  );
}
