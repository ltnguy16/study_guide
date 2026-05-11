"use client";

import React, { useEffect, useState, useCallback } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useFetchQuestions } from "@/features/questions/services/fetch/fetch-questions";
import { ImportantType, Question } from "@/shared/components/typing";
import { InsertEmptyQuestion } from "../services/upsert/insert-empty-question";
import { UpsertQuestion } from "../services/upsert/upsert-question";
import { DeleteQuestion } from "../services/delete/delete-question";
import { Spinner } from "@/shared";
import { Delete } from "lucide-react";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Memoized editable textarea cell
const EditableCell = React.memo(
  ({
    id,
    field,
    val,
    onChange,
  }: {
    id: number;
    field: keyof Question;
    val: any;
    onChange: (id: number, field: keyof Question, value: string | ImportantType | undefined) => void;
  }) => {
    return (
      <TextareaAutosize
        minRows={1}
        maxRows={15}
        value={val}
        onChange={(e) => onChange(id, field, e.target.value)}
        className="w-[400px] max-w-full rounded-md border border-input px-3 py-2 text-sm 
          bg-background text-foreground dark:bg-background dark:text-foreground
          focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition
          scroll-container resize-none overflow-hidden"
        placeholder={field}
        spellCheck={false}
      />
    );
  }
);

export default function SimpleViewerContent() {
  const { questions: initialQuestions, loading, error } = useFetchQuestions(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingRows, setEditingRows] = useState<Record<number, Question>>({} as Record<number, Question>);
  const [savingIds, setSavingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (initialQuestions) {
      setQuestions(initialQuestions);
    }
  }, [initialQuestions]);

  const onFieldChange = useCallback(
    (id: number, field: keyof Question, value: string | ImportantType | undefined) => {
      setEditingRows((prev) => {
        const row = prev[id] ?? questions.find((q) => q.id === id)!;
        const updated = { ...row, [field]: value };
        return { ...prev, [id]: updated };
      });
    },
    [questions]
  );

  const debouncedEditingRows = useDebounce(editingRows, 1000);

  useEffect(() => {
    async function saveRow(id: number, data: Question) {
  setSavingIds((prev) => new Set(prev).add(id));
  try {
    const upsertData = {
      ...data,
      id,
      important:
        data.important === undefined
          ? undefined
          : data.important,
      category:
        data.category === undefined || data.category === ""
          ? "Legal/Immigration"
          : data.category,
    };
    await UpsertQuestion(upsertData);
    setQuestions((prev) => {
      const idx = prev.findIndex((q) => q.id === id);
      if (idx === -1) return prev;
      const existing = prev[idx];
      if (
        existing.question === upsertData.question &&
        existing.loi === upsertData.loi &&
        existing.my === upsertData.my &&
        existing.category === upsertData.category &&
        existing.important === upsertData.important
      ) {
        return prev;
      }
      const newQuestions = [...prev];
      newQuestions[idx] = { ...existing, ...upsertData };
      return newQuestions;
    });
  } catch (e) {
    console.error("Save failed", e);
  } finally {
    setSavingIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    setEditingRows((prev) => {
      const newEdit = { ...prev };
      delete newEdit[id];
      return newEdit;
    });
  }
}

    for (const [idStr, data] of Object.entries(debouncedEditingRows)) {
      const id = parseInt(idStr, 10);
      saveRow(id, data);
    }
  }, [debouncedEditingRows]);

  const deleteRow = async (id: number) => {
    try {
      await DeleteQuestion(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const addNewRow = async () => {
    try {
      const inserted = await InsertEmptyQuestion();
      if (!inserted || inserted.length === 0) throw new Error("Insert failed");
      setQuestions((prev) => [...prev, inserted[0]]);
    } catch (e) {
      console.error("Add New failed", e);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4 max-w-7xl mx-auto bg-background text-foreground dark:text-foreground min-h-screen">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-border rounded-md text-sm table-auto">
          <thead>
            <tr className="bg-muted dark:bg-muted/80">
              <th className="border border-border p-2 text-left w-1/3">Question</th>
              <th className="border border-border p-2 text-left w-1/3">Loi's Answer</th>
              <th className="border border-border p-2 text-left w-1/3">My's Answer</th>
              <th className="border border-border w-10 text-center px-1">Del</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => {
              const id = q.id!;
              const isSaving = savingIds.has(id);
              return (
                <tr
                  key={id}
                  className="bg-muted/70 dark:bg-muted/40 border-b border-border transition-colors align-top"
                >
                  <td className="whitespace-normal break-words max-w-[250px] align-top pt-1">
                    <EditableCell id={id} field="question" val={editingRows[id]?.question ?? q.question} onChange={onFieldChange} />
                  </td>
                  <td className="whitespace-normal break-words max-w-[350px] align-top pt-1">
                    <EditableCell id={id} field="loi" val={editingRows[id]?.loi ?? q.loi} onChange={onFieldChange} />
                  </td>
                  <td className="whitespace-normal break-words max-w-[350px] align-top pt-1">
                    <EditableCell id={id} field="my" val={editingRows[id]?.my ?? q.my} onChange={onFieldChange} />
                  </td>
                  <td className="w-10 align-top text-center flex items-center justify-center pt-1">
                    {isSaving 
                      ? <Spinner/>
                      : (
                        <button
                          onClick={() => deleteRow(id)}
                          aria-label={`Delete question ${id}`}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Delete/>
                        </button>
                      )
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={addNewRow}
        className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
      >
        + Add New
      </button>
      <p className="mt-4 text-xs text-muted-foreground select-none">
        Edit any field inline. Changes autosave after 1 second of inactivity. Add new questions using the button. Delete rows with ×.
      </p>
    </div>
  );
}
