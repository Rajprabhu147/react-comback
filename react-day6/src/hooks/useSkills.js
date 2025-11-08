// src/hooks/useSkills.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "../context/UserContext";

/**
 * NOTE:
 * - Make sure your table has `inserted_at` (or change this to your column name).
 * - RLS must allow auth.uid() = user_id for SELECT/INSERT/DELETE (SQL below).
 */

async function getCurrentUserId() {
  // prefer reading from context, but keep an async fallback if needed
  // this helper isn't used directly in this file because we have useUser()
  const { data } = await supabase.auth.getUser();
  return data?.user?.id ?? null;
}

export function useSkills() {
  const { user } = useUser();

  return useQuery(
    ["skills", user?.id],
    async () => {
      // defensive: ensure we have user id
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("user_id", user.id)
        // use the timestamp column you actually created (inserted_at is common)
        .order("inserted_at", { ascending: false });

      if (error) {
        console.error("useSkills fetch error:", error);
        throw error;
      }
      return data ?? [];
    },
    {
      enabled: !!user, // only run after user is known
      retry: false, // make debugging obvious; you can remove this later
    }
  );
}

export function useAddSkill() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation(
    async (skill) => {
      if (!user?.id) throw new Error("Not signed in");

      const { data, error } = await supabase
        .from("skills")
        .insert([{ ...skill, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error("useAddSkill insert error:", error);
        throw error;
      }
      return data;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(["skills", user?.id]),
    }
  );
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation(
    async (id) => {
      if (!user?.id) throw new Error("Not signed in");

      // ensure we also match user_id so RLS will allow the delete and so you don't delete others' rows
      const { error } = await supabase
        .from("skills")
        .delete()
        .match({ id, user_id: user.id });

      if (error) {
        console.error("useDeleteSkill delete error:", error);
        throw error;
      }
      return true;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(["skills", user?.id]),
    }
  );
}
