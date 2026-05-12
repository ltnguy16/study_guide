import { CreateBrowserClient } from "@/lib/supabase/client";

export async function InsertEmptyQuestion() {
  const database = await CreateBrowserClient();
  const { data, error } = await database
    .from("questions")
    .insert({ question: "", me: "", partner: "", important: null, category: null })
    .select();

  if (error) {
    console.error("Failed to insert empty question:", error.message);
    throw error;
  }
  return data;
}
