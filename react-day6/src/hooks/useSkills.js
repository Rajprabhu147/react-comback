import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "../context/UserContext";

/**
 * Fetch skills for current user
 */
export function useSkills() {
  const { user } = useUser();
  const userId = user?.id ?? null;

  return useQuery(
    ["skills", userId],
    async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    {
      // only run when we actually have a user id
      enabled: !!userId,
      // optional: staleTime, refetchOnWindowFocus, etc.
    }
  );
}

/**
 * Add a skill (optimistic update)
 * mutation input: { name: string, ...otherFields }
 */
export function useAddSkill() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const userId = user?.id ?? null;

  return useMutation(
    // mutationFn
    async (skill) => {
      if (!userId) throw new Error("Not authenticated");
      const payload = { ...skill, user_id: userId };
      // ask supabase to return the inserted row with .select()
      const { data, error } = await supabase
        .from("skills")
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return data; // single inserted row
    },
    {
      // optimistic update
      onMutate: async (newSkill) => {
        if (!userId) return;
        await queryClient.cancelQueries(["skills", userId]);

        const previous = queryClient.getQueryData(["skills", userId]);

        // create a temporary optimistic item (id may be missing)
        const optimisticItem = {
          id: `temp-${Date.now()}`,
          user_id: userId,
          ...newSkill,
          created_at: new Date().toISOString(),
        };

        queryClient.setQueryData(["skills", userId], (old = []) => [
          optimisticItem,
          ...old,
        ]);

        return { previous, optimisticItem };
      },
      onError: (err, newSkill, context) => {
        // rollback
        if (context?.previous) {
          queryClient.setQueryData(["skills", user?.id], context.previous);
        }
      },
      onSettled: () => {
        // re-sync with server
        queryClient.invalidateQueries(["skills", userId]);
      },
    }
  );
}

/**
 * Delete a skill by id (optimistic)
 * mutation input: id
 */
export function useDeleteSkill() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const userId = user?.id ?? null;

  return useMutation(
    async (id) => {
      if (!id) throw new Error("Missing id");
      const { data, error } = await supabase
        .from("skills")
        .delete()
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    {
      onMutate: async (id) => {
        if (!userId) return;
        await queryClient.cancelQueries(["skills", userId]);
        const previous = queryClient.getQueryData(["skills", userId]);

        // optimistically remove the item
        queryClient.setQueryData(["skills", userId], (old = []) =>
          old.filter((s) => s.id !== id)
        );

        return { previous };
      },
      onError: (err, id, context) => {
        // rollback
        if (context?.previous) {
          queryClient.setQueryData(["skills", user?.id], context.previous);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(["skills", userId]);
      },
    }
  );
}
