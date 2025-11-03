// useQuery - to fetch/read data and cache it
// useMutation - to perform CRUD like POST/PATCH/DELETE
// useQueryClient - gives access to QueryClient instance so you can read/write/invalidate cache

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// ^ Import the React Query hooks we need:
//   - useQuery: read/fetch server data and subscribe to cache
//   - useMutation: run POST/PATCH/DELETE actions
//   - useQueryClient: low-level API to read/write/react to the cache

/**
 * Adapter: Get posts from jsonPlaceholder and convert into ticket model:
 * { id, title, description, priority, status, assignee }
 * We simulate priority/status/assignee locally.
 */

// URL for mock API
const API_URL = "https://jsonplaceholder.typicode.com/posts?_limit=8";
// ^ The endpoint we fetch from. Note: jsonplaceholder is a mock API and does NOT persist POSTed data.
//   IMPROVE: For a real app, use your own backend or a mock server (msw) that persists in-memory for dev.

// Utility: returns random item from array
const randomForm = (arr) => arr[Math.floor(Math.random() * arr.length)];
// ^ Simple helper to choose a random priority/status/assignee when transforming mock posts into tickets.

export const fetchTickets = async () => {
  const res = await fetch(API_URL);
  // ^ Fetch raw posts from the mock API.

  if (!res.ok) throw new Error("Failed to fetch tickets");
  // ^ Throw an error if network response is not OK, so React Query marks the query as errored.

  const data = await res.json();
  // ^ Parse JSON body into JS array of posts.

  const priorities = ["low", "medium", "high"];
  const statuses = ["open", "in-progress", "closed"];
  const assignees = ["Alice", "Bob", "Charlie"];
  // ^ Static arrays used to synthesize realistic ticket fields we don't get from jsonplaceholder.

  return data.map((d) => ({
    id: String(d.id),
    title: d.title,
    description: d.body,
    priority: randomForm(priorities),
    status: randomForm(statuses),
    assignee: randomForm(assignees),
  }));
  // ^ Transform each post into our ticket shape:
  //   - cast id to string for consistent id type across app
  //   - assign random priority/status/assignee for demo purposes
};

// ---- CRUD API functions ----

// Create
export const addTicketApi = async (ticket) => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(ticket),
    headers: { "Content-Type": "application/json" },
  });
  // ^ Send POST to jsonplaceholder. It will return a simulated created resource with an id,
  //   but the backend does not actually store it.

  if (!res.ok) throw new Error("Failed to add ticket");
  // ^ Throw on non-ok response.

  const data = await res.json();
  // ^ Response typically contains { id: 101 } for jsonplaceholder.

  return { ...ticket, id: String(data.id) };
  // ^ Return the ticket merged with the server-provided id.
  //   NOTE: For mock APIs this id is fabricated. In production this should be the authoritative id.
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
  // ^ Send a PATCH to update the resource at /posts/:id.
  //   With jsonplaceholder this will respond with 200 but not persist.

  if (!res.ok) throw new Error("Update failed");
  // ^ Throw on failure

  return ticket;
  // ^ Return the ticket we were given. (Optimistic update assumes this matches server)
};

// Delete
export const deleteTicketApi = async (id) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: "DELETE",
  });
  // ^ Send DELETE to mock endpoint.

  if (!res.ok) throw new Error("Delete failed");
  // ^ Throw if delete failed

  return id;
  // ^ Return deleted id so callers can remove from cache optimistically.
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
// ^ Creates and returns a React Query hook instance for fetching tickets.
//   - queryKey: uniquely identifies this data in cache.
//   - queryFn: the async function to fetch data.
//   - staleTime: prevents refetching for 60s while data considered fresh.
//   Usage in component: const { data, isLoading, isError } = useTicketsQuery();

// ✅ 2️⃣ Add ticket (Create)
export const useAddTicket = () => {
  const qc = useQueryClient();
  // ^ get QueryClient so we can read/write cache and cancel/invalidate queries.

  return useMutation({
    mutationFn: addTicketApi, // function that performs POST

    // Optimistic Update Pattern
    onMutate: async (newTicket) => {
      await qc.cancelQueries({ queryKey: ["tickets"] });
      // ^ Cancel ongoing "tickets" queries to avoid race conditions between fetch & optimistic update.

      const previous = qc.getQueryData(["tickets"]) || [];
      // ^ Snapshot the previous tickets cache so we can rollback on error.

      // Immediate UI feedback
      qc.setQueryData(["tickets"], (old = []) => [
        { ...newTicket, id: "temp-" + Date.now() },
        ...old,
      ]);
      // ^ Prepend optimistic ticket to the cached list with a temporary id.
      //   This makes the UI show the new ticket instantly.

      return { previous };
      // ^ Return the snapshot as context for onError to rollback.
    },

    onError: (err, newTicket, context) => {
      // Rollback to previous state if fails
      qc.setQueryData(["tickets"], context.previous);
    },
    // ^ If the mutation fails, restore the previous cache from context.
    // NOTE: onSuccess / onSettled intentionally omitted to avoid refetching mock API.
  });
};
// NOTES:
// - This hook does optimistic update and does NOT invalidate or refetch after success,
//   which is correct for a mock API that doesn't persist. For a real API you'd probably
//   either invalidate the query or merge the server response into cache.

// ✅ 3️⃣ Update ticket
export const useUpdateTicket = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateTicketApi,

    onMutate: async (updated) => {
      await qc.cancelQueries({ queryKey: ["tickets"] });
      const previous = qc.getQueryData(["tickets"]);
      // ^ Snapshot previous tickets.

      // Optimistically update cache
      qc.setQueryData(["tickets"], (old = []) =>
        old.map((t) => (t.id === updated.id ? updated : t))
      );
      // ^ Replace ticket in cache with updated version immediately.

      return { previous };
    },

    onError: (err, vars, context) => {
      qc.setQueryData(["tickets"], context.previous);
      // ^ Rollback on error.
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["tickets"] });
      // ^ After mutation finishes (success or error), refetch tickets.
      //   IMPROVE: If using mock API this will overwrite optimistic updates; for real APIs
      //   invalidation is preferred because server is authoritative.
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
      // ^ Snapshot previous tickets

      // Optimistic removal
      qc.setQueryData(["tickets"], (old = []) =>
        old.filter((t) => t.id !== id)
      );
      // ^ Remove the ticket from cache immediately so UI reflects deletion.

      return { previous };
    },

    onError: (err, id, context) => {
      qc.setQueryData(["tickets"], context.previous);
      // ^ Rollback if delete fails.
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["tickets"] });
      // ^ Re-fetch the tickets list to ensure cache synced with server (server is authoritative).
      //   IMPROVE: For mock APIs that don't actually delete, this will make the deletion "disappear".
    },
  });
};
