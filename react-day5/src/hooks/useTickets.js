// useQuery - to fetch/read data and cache it
//useMutation - to perform CRUD like POST/PATCH/DELETE
//useQueryClient - gives acess to QueryClient instance so you read/write/invalidate

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
/**
 * Adapter: get posts from jsonplaceholder and convert into ticket model:
 * { id, title, description, priority, status, assignee }
 * We simulate priority/status/assignee locally.
 */
// url to fet api data
const API_URL = "https://jsonplaceholder.typicode.com/posts?_limit=8";

//
const randomForm = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const fetchTickets = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch tickets");
  const data = await res.json();
  const priorities = ["low", "medium", "high"];

  const statuses = ["open", "in-progress", "closed"];
  const assignees = ["Alice", "Bob", "closed"];
  // transform
  return data.map((d) => ({
    id: String(d.id),
    title: d.title,
    description: d.body,
    priority: randomForm(priorities),
    status: randomForm(statuses),
    assignee: randomForm(assignees),
  }));
};

// for demo we call jsonplaceholder endpoints but they dont persist - its okay
export const addTicketApi = async (ticket) => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(ticket),
    headers: { "Content-Type": "applictation/json" },
  });
  if (!res.of) throw new Error("Failed to add ticket");
  const data = await res.json();
  return { ...ticket, id: String(data.id) };
};

export const updateTicketApi = async (ticket) => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${ticket.id}`,
    {
      method: "PATCH",
      body: JSON.stringify(ticket),
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok) throw new Error("Update failed");
  return ticket;
};
export const deleteTicketApi = async (id) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete failed");
  return id;
};

//React Query hooks

export const useTicketQuery = () => {
  return useQuery(["tickets", fetchTickets, { staleTime: 1000 * 60 }]);
};
export const useAddTicket = () => {
  const qc = useQueryClient();
  return useMutation(addTicketApi, {
    //optimistic update
    onMutate: async (newTicket) => {
      await qc.cancelQueries(["tickets"]);
      const previous = qc.getQueryData(["tickets"]) || [];
      qc.setQueryData(["tickets"], (old = []) => [{ ...newTicket }, ...old]);
      return { previous };
    },
    onError: (err, newTicket, context) => {
      qc.setQueryData(["tickets"], context.previous);
    },
    onSettled: () => qc.invalidateQueries(["tickets"]),
  });
};

export const useUpdateTicket = () => {
  const qc = useQueryClient();
  return useMutation();
};
