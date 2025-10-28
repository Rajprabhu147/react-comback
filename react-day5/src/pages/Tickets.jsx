import React from "react";
// main logic component that fetches tickets via useTicketQuery
import TicketManager from "../components/TicketManager"; // importing ticket manager component

export default function TicketsPage() {
  return (
    <div>
      <h2>Tickets</h2>
      <TicketManager />
    </div>
  );
}
