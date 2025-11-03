import React, { useState } from "react"; //stores local values for searching filtering tickets
import {
  useTicketsQuery, //fetch all tickets(GET)
  useAddTicket, //create a new ticket(POST)
  useUpdateTicket, //edit existing ticket(PATCH)
  useDeleteTicket, //delete a ticket(DELETE)
} from "../hooks/useTickets"; // useQuery/useMutation used to handle optimistic updates
import toast from "react-hot-toast"; // import toast from hot toast
import TicketList from "./TicketList"; // displays all tickets
import TicketForm from "./TicketForm"; // allows adding a new ticket
import TicketFilters from "./TicketFilters"; // allows filtering/searching tickets by text, status or priority

export default function TicketManager() {
  const { data: tickets = [], isLoading, isError, error } = useTicketsQuery();
  // calls the hook to fetch tickets data[tickets] array of the tickets, isLoading-true, isError-techError
  //initializes mutations for CRUD
  const addMutation = useAddTicket(); //triggers a POST (add)
  const updateMutation = useUpdateTicket(); //triggers a PATCH
  const deleteMutation = useDeleteTicket(); //triggers a DELETE

  const [filter, setFilter] = useState({
    q: "", //search text(query)
    status: "all", //show all tickets by default without status filtering
    priority: "all", //show all tickets by default (no priority filtering)
  });
  //setFilter is the setter function to update this state passed to TicketFilters
  const handleAdd = (payload) => {
    //is the event handler is called when user submits a new ticket
    // create id locally for optimistic update (string)
    addMutation.mutate({ ...payload, id: `temp-${Date.now()}` }),
      // add a temp id so the optimistic update can display the new ticket before the server responds
      //.mutate will trigger the add API call POST via react query
      {
        onSuccess: () => toast.success(" 🎟️ Ticket added successfully!"),
        onError: () =>
          toast.error(" ❌ Failed to add Ticket. please try again"),
      };
  };

  const handleUpdate = (t) =>
    updateMutation.mutate(t, {
      onSuccess: () => toast.success(" 📝 Ticket update!"),
      onError: () => toast.error(" ⚠️ Update failed"),
    });
  // by calling mutate willUpdate existing ticket
  const handleDelete = (id) => {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("🗑️ Ticket deleted!"),
      onError: () => toast.error("❌ Failed to delete ticket."),
    });
  };
  //deletes a ticket by ID using the delete mutation
  // these functions are passed down to TicketList so the child components can trigger these actions

  // this is a local in memory filter applied to all tickets
  const filtered = tickets.filter((t) => {
    //loops through each ticket to decide if it should be shown
    const q = filter.q.toLowerCase().trim();
    //normalize the search text
    if (
      q &&
      !`${t.title} ${t.description} ${t.assignee}`.toLowerCase().includes(q)
    )
      //if search query exist only include tickets with title,desc,assign
      return false;
    if (filter.status !== "all" && t.status !== filter.status) return false;
    //only if matches
    if (filter.priority !== "all" && t.priority !== filter.priority)
      //return false-same for priority filter
      return false;
    return true; //if all checks pass include the ticket in the filtered list
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
      {/*shows loading tickets
      shows error message in red */}
      {isError && <p style={{ color: "red" }}>Error: {error.message}</p>}

      <TicketList
        tickets={filtered} //filtered array
        onUpdate={handleUpdate} //function to edit a ticket
        onDelete={handleDelete} //function to delete a ticket
      />
    </section>
  );
}
