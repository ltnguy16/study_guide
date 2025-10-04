import { CreateBrowserClient } from "@/lib/supabase/client";
import { Question } from "../../components/question-page-content";

export async function UpdateQuestion(question: Question) {
    if (!question.id) {
        throw new Error("Missing id for update");
    }

    const database = await CreateBrowserClient();

    const { data, error } = await database
        .from("questions")
        .update({
            question: question.question,
            loi: question.loi,
            my: question.my,
            important: question.important ?? null,
            category: question.category ?? null,
        })
        .eq("id", question.id)
        .select();

    if (error) {
        console.error("Failed to update question:", error.message);
        throw error;
    }
    return data;
}
