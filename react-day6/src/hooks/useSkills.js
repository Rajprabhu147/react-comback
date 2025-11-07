import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import { useUser } from "../context/UserContext";

export function useSkills() {
  const { user } = useUser();
  return useQuery(
    ["skills", user?.id],
    async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    { enabled: !!user }
  );
}

export function useAddSkill() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  return useMutation(
    async (skill) => {
      const { data, error } = await supabase
        .from("skills")
        .insert([{ ...skill, user_id: user.id }]);
      if (error) throw error;
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
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(["skills", user?.id]),
    }
  );
}
