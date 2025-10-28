// useQuery - to fetch/read data and cache it
//useMutation - to perform CRUD like POST/PATCH/DELETE
//useQueryClient - gives access to QueryClient instance so you read/write/invalidate

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
/**
 * Adapter: get posts from jsonPlaceholder and convert into ticket model:
 * { id, title, description, priority, status, assignee }
 * We simulate priority/status/assignee locally.
 */
// url to fet api data
const API_URL = "https://jsonplaceholder.typicode.com/posts?_limit=8";

//this is used to return random item from an array
const randomForm = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const fetchTickets = async () => {
  const res = await fetch(API_URL); //fetches raw posts from api url
  if (!res.ok) throw new Error("Failed to fetch tickets"); //returns error if network issue
  const data = await res.json(); //converts the json data into UI ticket model
  const priorities = ["low", "medium", "high"]; //object priorities
  const statuses = ["open", "in-progress", "closed"];
  const assignees = ["Alice", "Bob", "closed"];
  // transform id to string for consistent id type
  return data.map((d) => ({
    id: String(d.id),
    title: d.title,
    description: d.body,
    priority: randomForm(priorities),
    status: randomForm(statuses),
    assignee: randomForm(assignees),
  }));
};

// for demo we call jsonPlaceholder endpoints but they dont persist - its okay

export const addTicketApi = async (ticket) => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST", //sends tickets to jsonPlaceholder via POST
    body: JSON.stringify(ticket),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.of) throw new Error("Failed to add ticket"); //Error if response not ok
  const data = await res.json();
  return { ...ticket, id: String(data.id) }; //returns ticket with new id
};

export const updateTicketApi = async (ticket) => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${ticket.id}`,
    {
      method: "PATCH", // sends a Patch to update by id
      body: JSON.stringify(ticket),
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok) throw new Error("Update failed");
  return ticket; //returns the ticket object back
};
export const deleteTicketApi = async (id) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: "DELETE", // calls delete for given id , throws on non-ok and return id when successful
  });
  if (!res.ok) throw new Error("Delete failed");
  return id;
};

//React Query hooks

export const useTicketQuery = () => {
  return useQuery(["tickets", fetchTickets, { staleTime: 1000 * 60 }]); //registers query with key "tickets"
}; // runs fetch ticket to catch results and stale time is for 1 minute  react query will avoid refetching while fresh
export const useAddTicket = () => {
  const qc = useQueryClient();
  return useMutation(addTicketApi, {
    // runs addTicketApi when you call mutate
    //optimistic update
    onMutate: async (newTicket) => {
      await qc.cancelQueries(["tickets"]); //stop any infight fetch for "tickets" so we dont fight opt update
      const previous = qc.getQueryData(["tickets"]) || []; // read current cached tickets so if error we can rollback
      qc.setQueryData(["tickets"], (old = []) => [{ ...newTicket }, ...old]);
      //immediately add the new ticket->top of cached list so UI reflects instantly with tempId
      return { previous };
      //returned object becomes context in onError so you can restore state
    },
    //restore previous cache from context if mutation failed
    onError: (err, newTicket, context) => {
      //onError - restores previous cache from context if mutation failed
      qc.setQueryData(["tickets"], context.previous);
    },
    onSettled: () => qc.invalidateQueries(["tickets"]),
    //after success or error, invalidate ["tickets"]so react query refetches
    //authoritative data from server
  });
};

export const useUpdateTicket = () => {
  const qc = useQueryClient();
  return useMutation(updateTicketApi, {
    onMutate: async (updated) => {
      await qc.cancelQueries(["tickets"]); // cancel inflight ticket queries
      const previous = qc.getQueryData(["tickets"]); // save previous - rollback
      qc.setQueryData(
        ["tickets"],
        (old = []) => old.map((t) => (t.id === updated.i ? updated : t))
        //replace the object with updated obj
      );
      return { previous };
    },
    onError: (err, vars, context) => {
      //on error restore precious cache
      qc.setQueryData(["tickets"], context.previous);
    },
    onSettled: () => qc.invalidateQueries(["tickets"]),
    //this invalidate to ensure server state is refetched
  });
};

export const useDeleteTicket = () => {
  const qc = useQueryClient();
  return useMutation(deleteTicketApi, {
    onMutate: async (id) => {
      await qc.cancelQueries(["tickets"]);
      const previous = qc.getQueryData(["tickets"]);
      qc.setQueryData(
        ["tickets"],
        (old = []) => old.filter((t) => t.id !== id)
        //filter out deleted tickets, rollback on error & refetched when settled
        // this makes delete feel instant in UI
      );
      return { previous };
    },
    onError: (err, id, context) => {
      qc.setQueryData(["tickets"], context.previous);
    },
    onSettled: () => qc.invalidateQueries(["tickets"]),
  });
};
