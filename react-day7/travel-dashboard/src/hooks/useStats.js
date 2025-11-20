import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";

/* =====================================================================
   🔵 useStatusStats()
   ---------------------------------------------------------------------
   Fetches the count of items grouped by STATUS (e.g., todo, doing, done)
   from a Supabase RPC function: stats_count_by_status(user_uuid)

   This runs only for the logged-in user and returns their statistics.
   Cached for 60 seconds to reduce database load.
===================================================================== */
export const useStatusStats = () => {
  return useQuery({
    // React Query cache key → unique ID for this query
    queryKey: ["stats", "status"],

    // Function that fetches data
    queryFn: async () => {
      // Get logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Call a Supabase Postgres RPC (stored procedure)
      const { data, error } = await supabase.rpc("stats_count_by_status", {
        user_uuid: user.id,
      });

      if (error) throw error;

      // If RPC returns null, return empty array instead
      return data || [];
    },

    staleTime: 60000, // Data stays "fresh" for 1 minute
  });
};

/* =====================================================================
   🟡 usePriorityStats()
   ---------------------------------------------------------------------
   Fetches count of items grouped by PRIORITY (low, medium, high, etc.)
   using RPC: stats_count_by_priority(user_uuid)

   Ideal for charts or dashboard cards. Cached for 1 minute.
===================================================================== */
export const usePriorityStats = () => {
  return useQuery({
    queryKey: ["stats", "priority"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // RPC calculates priority-based statistics
      const { data, error } = await supabase.rpc("stats_count_by_priority", {
        user_uuid: user.id,
      });

      if (error) throw error;
      return data || [];
    },

    staleTime: 60000,
  });
};

/* =====================================================================
   🔴 useEventsTimeSeries()
   ---------------------------------------------------------------------
   Fetches time-series event data (last 7 days)
   via RPC: stats_events_last_7_days(user_uuid)

   Useful for charts, graphs, activity timeline, analytics dashboard.
   Example output:
     [
       { date: "2025-01-10", count: 4 },
       { date: "2025-01-11", count: 7 }
     ]

   Cached for 1 minute to avoid repetitive DB calls.
===================================================================== */
export const useEventsTimeSeries = () => {
  return useQuery({
    queryKey: ["stats", "events"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // RPC to fetch event counts over time
      const { data, error } = await supabase.rpc("stats_events_last_7_days", {
        user_uuid: user.id,
      });

      if (error) throw error;
      return data || [];
    },

    staleTime: 60000,
  });
};
