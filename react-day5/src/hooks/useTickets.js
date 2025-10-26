import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
/**
 * Adapter: get posts from jsonplaceholder and convert into ticket model:
 * { id, title, description, priority, status, assignee }
 * We simulate priority/status/assignee locally.
 */
const API_URL = "https://jsonplaceholder.typicode.com/posts?_limit=8";

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

//
