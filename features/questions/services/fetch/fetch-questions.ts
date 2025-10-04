import { useState, useEffect } from "react";
import { CreateBrowserClient } from "@/lib/supabase/client";
import { Question } from "../../components/question-page-content";

export function useFetchQuestions(refreshTrigger: boolean) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      const database = CreateBrowserClient();
      const { data, error } = await database.from("questions").select("*");
      if (error) setError(error.message);
      else if (data) setQuestions(data);
      setLoading(false);
    }

    fetchQuestions();
  }, [refreshTrigger]); // dependency added here

  return { questions, loading, error };
}
