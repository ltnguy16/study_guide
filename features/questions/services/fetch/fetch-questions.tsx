import { useState, useEffect } from "react";
import { CreateBrowserClient } from "@/lib/supabase/client";
import { Question } from "../../components/question-page-content";

export function useFetchQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      const database = CreateBrowserClient();
      const { data, error } = await database.from("questions").select("*");

      if (error) setError(error.message);
      else if (data) setQuestions(data);

      setLoading(false);
    }

    fetchQuestions();
  }, []);

  return { questions, loading, error };
}
