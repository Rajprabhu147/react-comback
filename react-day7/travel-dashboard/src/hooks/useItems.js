import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

// ===============================================================
// 🔵 Fetch All Items Hook
// ===============================================================
export const useItems = () => {
  return useQuery({
    queryKey: ["items"], // Unique key for caching this query
    queryFn: async () => {
      // Fetch items ordered by most recently updated
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;

      return data || [];
    },
    staleTime: 30000, // Cached data remains "fresh" for 30 seconds
  });
};

// ===============================================================
// 🟢 Create Item Hook (INSERT)
// ===============================================================
export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Actual API call to create the item
    mutationFn: async (newItem) => {
      // Get logged-in user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Insert item into DB
      const { data, error } = await supabase
        .from("items")
        .insert([{ ...newItem, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      // Log "created" event into item_events table
      await supabase.from("item_events").insert([
        {
          item_id: data.id,
          user_id: user.id,
          event_type: "created",
          payload: data, // store snapshot of created item
        },
      ]);

      return data;
    },

    // -------------------------- Optimistic Update --------------------------
    onMutate: async (newItem) => {
      // Pause any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["items"] });

      // Store previous items in case mutation fails
      const previousItems = queryClient.getQueryData(["items"]);

      // Update UI instantly: insert a temporary item at top
      queryClient.setQueryData(["items"], (old = []) => [
        {
          id: `temp-${Date.now()}`,
          ...newItem,
          created_at: new Date().toISOString(),
        },
        ...old,
      ]);

      return { previousItems };
    },

    onError: (err, newItem, context) => {
      // Roll back to previous state
      queryClient.setQueryData(["items"], context.previousItems);
      toast.error("Failed to create item");
      console.error("Create error:", err);
    },

    onSuccess: () => {
      toast.success("Item created successfully");
    },

    // Revalidate after mutation completes (success or error)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
};

// ===============================================================
// 🟡 Update Item Hook (UPDATE)
// ===============================================================
export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // API call to update the item
    mutationFn: async (updatedItem) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("items")
        .update(updatedItem)
        .eq("id", updatedItem.id)
        .select()
        .single();

      if (error) throw error;

      // Log event for update
      await supabase.from("item_events").insert([
        {
          item_id: data.id,
          user_id: user.id,
          event_type: "updated",
          payload: data,
        },
      ]);

      return data;
    },
    // -------------------------- Optimistic Update --------------------------
    onMutate: async (updatedItem) => {
      await queryClient.cancelQueries({ queryKey: ["items"] });

      const previousItems = queryClient.getQueryData(["items"]);

      // Apply update instantly in UI
      queryClient.setQueryData(["items"], (old = []) =>
        old.map((item) =>
          item.id === updatedItem.id ? { ...item, ...updatedItem } : item
        )
      );

      return { previousItems };
    },

    onError: (err, updatedItem, context) => {
      // Revert back on error
      queryClient.setQueryData(["items"], context.previousItems);
      toast.error("Failed to update item");
      console.error("Update error:", err);
    },

    onSuccess: () => {
      toast.success("Item updated successfully");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
};

// ===============================================================
// 🔴 Delete Item Hook (DELETE)
// ===============================================================
export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // API call to delete the item
    mutationFn: async (itemId) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Log deletion before deleting actual item
      await supabase.from("item_events").insert([
        {
          item_id: itemId,
          user_id: user.id,
          event_type: "deleted",
          payload: {}, // no data for deleted item
        },
      ]);

      // Delete from DB
      const { error } = await supabase.from("items").delete().eq("id", itemId);

      if (error) throw error;

      return itemId;
    },

    // -------------------------- Optimistic Update --------------------------
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: ["items"] });

      const previousItems = queryClient.getQueryData(["items"]);

      // Instantly remove item from UI
      queryClient.setQueryData(["items"], (old = []) =>
        old.filter((item) => item.id !== itemId)
      );

      return { previousItems };
    },

    onError: (err, itemId, context) => {
      // Revert UI on error
      queryClient.setQueryData(["items"], context.previousItems);
      toast.error("Failed to delete item");
      console.error("Delete error:", err);
    },

    onSuccess: () => {
      toast.success("Item deleted successfully");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
};
