import { useState, useEffect } from "react";
import { CreateBrowserClient } from "@/lib/supabase/client";
import { Question } from "@/shared/components/typing";

export function useFetchQuestions(refreshTrigger: boolean) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      const database = CreateBrowserClient();
      const { data, error } = await database.from("questions").select("*").order("category").order("id");
      if (error) setError(error.message);
      else if (data) setQuestions(data);
      setLoading(false);
    }

    fetchQuestions();
  }, [refreshTrigger]);

  return { questions, loading, error };
}
