import { CreateBrowserClient } from "@/lib/supabase/client";

export async function DeleteQuestion(id: number) {
    const database = CreateBrowserClient();
    const { error } = await database
        .from('questions')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(`Failed to delete question: ${error.message}`);
    }
}