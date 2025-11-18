// src/hooks/useSkills.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "../context/UserContext";

const TIMESTAMP_COL = "inserted_at"; // change to "created_at" if your table uses that

export function useSkills() {
  const { user } = useUser();

  return useQuery({
    queryKey: ["skills", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("user_id", user.id)
        .order(TIMESTAMP_COL, { ascending: false });
      if (error) {
        console.error("useSkills fetch error:", error);
        throw error;
      }
      return data ?? [];
    },
    enabled: !!user,
    retry: false,
    onError: (err) => {
      console.error("useSkills onError:", err);
    },
  });
}

export function useAddSkill() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (skill) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills", user?.id] });
    },
    onError: (err) => {
      console.error("useAddSkill onError:", err);
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (id) => {
      if (!user?.id) throw new Error("Not signed in");
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills", user?.id] });
    },
    onError: (err) => {
      console.error("useDeleteSkill onError:", err);
    },
  });
}
