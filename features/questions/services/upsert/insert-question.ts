import { CreateBrowserClient } from "@/lib/supabase/client";
import { Question } from "@/shared/components/typing";

export async function InsertQuestion(question: Omit<Question, "id">) {
    const database = await CreateBrowserClient();

    const { data, error } = await database
        .from("questions")
        .insert(question)
        .select();

    if (error) {
        console.error("Failed to insert question:", error.message);
        throw error;
    }
    return data;
}
