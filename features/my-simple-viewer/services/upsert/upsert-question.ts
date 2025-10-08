import { CreateBrowserClient } from "@/lib/supabase/client";
import { Question } from "@/shared/components/typing";

export async function UpsertQuestion(question: Question) {
  const database = await CreateBrowserClient();
  const { data, error } = await database
    .from("questions")
    .upsert({
      id: question.id,
      question: question.question,
      loi: question.loi,
      my: question.my,
      important: question.important ?? null,
      category: question.category ?? null,
    })
    .select();

  if (error) {
    console.error("Failed to upsert question:", error.message);
    throw error;
  }
  return data;
}
