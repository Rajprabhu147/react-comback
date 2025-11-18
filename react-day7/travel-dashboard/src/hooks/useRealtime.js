import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";

// =================================================================
// 🔵 useRealtimeSubscription Hook
// -----------------------------------------------------------------
// This hook listens to ALL Realtime events (INSERT, UPDATE, DELETE)
// happening in the "items" table in Supabase PostgreSQL.
//
// Whenever something changes in the database, the UI updates
// instantly by modifying the React Query cache.
//
// This creates **live-sync** across all clients.
// =================================================================
export const useRealtimeSubscription = () => {
  const queryClient = useQueryClient(); // Access to React Query cache

  useEffect(() => {
    // -----------------------------------------------------------
    // 🌐 Create realtime channel
    //   - Listens for Postgres row-level changes
    //   - On table: "items"
    // -----------------------------------------------------------
    const channel = supabase
      .channel("items-changes") // Name the realtime channel
      .on(
        "postgres_changess", // Type of realtime event
        {
          event: "*", // Listen to ALL events: INSERT, UPDATE, DELETE
          schema: "public",
          table: "items",
        },

        // =======================================================
        // 🎯 Event Handler
        // Triggered on INSERT, UPDATE, DELETE
        // =======================================================
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;

          switch (eventType) {
            // ---------------------------------------------------
            // 🟢 Row INSERTED into "items"
            // ---------------------------------------------------
            case "INSERT":
              queryClient.setQueryData(["items"], (old = []) => {
                // Prevent duplicate records
                if (old.some((item) => item.id === newRecord.id)) {
                  return old;
                }
                // Add new item at the top
                return [newRecord, ...old];
              });
              break;

            // ---------------------------------------------------
            // 🟡 Row UPDATED in "items"
            // ---------------------------------------------------
            case "UPDATE":
              queryClient.setQueryData(["items"], (old = []) =>
                old.map((item) => (item.id === newRecord.id ? newRecord : item))
              );
              break;

            // ---------------------------------------------------
            // 🔴 Row DELETED from "items"
            // ---------------------------------------------------
            case "DELETE":
              queryClient.setQueryData(["items"], (old = []) =>
                old.filter((item) => item.id !== oldRecord.id)
              );
              break;

            // ---------------------------------------------------
            // 🔄 Unknown event — fallback to invalidate
            // ---------------------------------------------------
            default:
              queryClient.invalidateQueries({ queryKey: ["items"] });
          }

          // Stats change whenever data changes, so always refetch
          queryClient.invalidateQueries({ queryKey: ["stats"] });
        }
      )
      .subscribe(); // Connect to realtime backend

    // ----------------------------------------------------------
    // ❌ Clean up subscription on unmount
    // ----------------------------------------------------------
    return () => {
      channel.unsubscribe();
    };
  }, [queryClient]); // React Query client is a dependency
};
