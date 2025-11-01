// useQuery - to fetch/read data and cache it
// useMutation - to perform CRUD like POST/PATCH/DELETE
// useQueryClient - gives access to QueryClient instance so you can read/write/invalidate cache

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Adapter: Get posts from jsonPlaceholder and convert into ticket model:
 * { id, title, description, priority, status, assignee }
 * We simulate priority/status/assignee locally.
 */

// URL for mock API
const API_URL = "https://jsonplaceholder.typicode.com/posts?_limit=8";

// Utility: returns random item from array
const randomForm = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const fetchTickets = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch tickets");
  const data = await res.json();

  const priorities = ["low", "medium", "high"];
  const statuses = ["open", "in-progress", "closed"];
  const assignees = ["Alice", "Bob", "Charlie"];

  return data.map((d) => ({
    id: String(d.id),
    title: d.title,
    description: d.body,
    priority: randomForm(priorities),
    status: randomForm(statuses),
    assignee: randomForm(assignees),
  }));
};

// ---- CRUD API functions ----

// Create
export const addTicketApi = async (ticket) => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(ticket),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to add ticket");
  const data = await res.json();
  return { ...ticket, id: String(data.id) };
};

// Update
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

// Delete
export const deleteTicketApi = async (id) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete failed");
  return id;
};

//
// ─── REACT QUERY HOOKS ─────────────────────────────────────────────
//

// ✅ 1️⃣ Read / Fetch tickets
export const useTicketsQuery = () => {
  return useQuery({
    queryKey: ["tickets"], // unique cache key
    queryFn: fetchTickets, // function that fetches data
    staleTime: 1000 * 60, // 1 minute: data considered fresh
  });
};

// ✅ 2️⃣ Add ticket (Create)
export const useAddTicket = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: addTicketApi, // function that performs POST

    // Optimistic Update Pattern
    onMutate: async (newTicket) => {
      await qc.cancelQueries({ queryKey: ["tickets"] });
      const previous = qc.getQueryData(["tickets"]) || [];

      // Immediate UI feedback
      qc.setQueryData(["tickets"], (old = []) => [
        { ...newTicket, id: "temp-" + Date.now() },
        ...old,
      ]);

      return { previous };
    },

    onError: (err, newTicket, context) => {
      // Rollback to previous state if fails
      qc.setQueryData(["tickets"], context.previous);
    },

    onSettled: () => {
      // Refetch to sync with server
      qc.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

// ✅ 3️⃣ Update ticket
export const useUpdateTicket = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateTicketApi,

    onMutate: async (updated) => {
      await qc.cancelQueries({ queryKey: ["tickets"] });
      const previous = qc.getQueryData(["tickets"]);

      // Optimistically update cache
      qc.setQueryData(["tickets"], (old = []) =>
        old.map((t) => (t.id === updated.id ? updated : t))
      );

      return { previous };
    },

    onError: (err, vars, context) => {
      qc.setQueryData(["tickets"], context.previous);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

// ✅ 4️⃣ Delete ticket
export const useDeleteTicket = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteTicketApi,

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["tickets"] });
      const previous = qc.getQueryData(["tickets"]);

      // Optimistic removal
      qc.setQueryData(["tickets"], (old = []) =>
        old.filter((t) => t.id !== id)
      );

      return { previous };
    },

    onError: (err, id, context) => {
      qc.setQueryData(["tickets"], context.previous);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};
