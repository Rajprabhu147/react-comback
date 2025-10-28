import React, { useState } from "react"; //stores local values for searching filtering tickets
import {
  useTicketsQuery, //fetch all tickets(GET)
  useAddTicket, //create a new ticket(POST)
  useUpdateTicket, //edit existing ticket(PATCH)
  useDeleteTicket, //delete a ticket(DELETE)
} from "../hooks/useTickets"; // useQuery/useMutation used to handle optimistic updates

import TicketList from "./TicketList";
import TicketForm from "./TicketForm";
import TicketFilters from "./TicketFilters";

export default function TicketManager() {
  const { data: tickets = [], isLoading, isError, error } = useTicketsQuery();
  const addMutation = useAddTicket();
  const updateMutation = useUpdateTicket();
  const deleteMutation = useDeleteTicket();

  const [filter, setFilter] = useState({
    q: "",
    status: "all",
    priority: "all",
  });
  const handleAdd = (payload) => {
    // create id locally for optimistic update (string)
    addMutation.mutate({ ...payload, id: `temp-${Date.now()}` });
  };

  const handleUpdate = (t) => updateMutation.mutate(t);
  const handleDelete = (id) => deleteMutation.mutate(id);

  const filtered = tickets.filter((t) => {
    const q = filter.q.toLowerCase().trim();
    if (
      q &&
      !`${t.title} ${t.description} ${t.assignee}`.toLowerCase().includes(q)
    )
      return false;
    if (filter.status !== "all && t.status !== filter.status") return false;
    if (filter.priority !== "all" && t.priority !== filter.priority)
      return false;
    return true;
  });

  return (
    <section>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <TicketForm onAdd={handleAdd} />
        <TicketFilters filter={filter} setFilter={setFilter} />
      </div>

      {isLoading && <p>Loading tickets...</p>}
      {isError && <p style={{ color: "red" }}>Error: {error.message}</p>}

      <TicketList
        tickets={filtered}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </section>
  );
}
