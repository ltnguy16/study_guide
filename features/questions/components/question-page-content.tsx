"use client";

import { InfoTooltip } from "@/shared";
import { MessageSquareWarning, Edit, X, CircleX } from "lucide-react";
import React, { useState } from "react";
import { useFetchQuestions } from "../services/fetch/fetch-questions";
import QuestionUpsertDialog from "./question-upsert-dialog";

export type ImportantType = "Loi" | "My" | "Important";

export interface Question {
  id?: number;
  question: string;
  loi: string;
  my: string;
  important?: ImportantType;
  category?: string;
}

function convertString(text: string): string {
  const withNewlines = text.replace(/\\n/g, "\n");
  // Split into lines
  const lines = withNewlines.split("\n");
  // Add bullet at start of every line
  const bulletedLines = lines.map(line => `• ${line.trim()}`);
  // Join back into a single string with real newlines
  return bulletedLines.join("\n");
}


function ImportantBadge({ important }: { important?: ImportantType }) {
  if (!important) return null;

  const colorMap: Record<ImportantType, string> = {
    Loi: "bg-blue-600",
    My: "bg-purple-600",
    Important: "bg-red-600",
  };

  const labelMap: Record<ImportantType, string> = {
    Loi: "Marked important by Loi",
    My: "Marked important by My",
    Important: "Marked Important!",
  };

  return (
    <InfoTooltip text={labelMap[important]}>
      <span
        className={`inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-xs font-semibold text-white shadow-sm ${colorMap[important]}`}
        aria-label={labelMap[important]}
      >
        <MessageSquareWarning size={14} />
      </span>
    </InfoTooltip>
  );
}

export default function QuestionsPageContent() {
  const [mode, setMode] = useState<"showAll" | "single" | "multi">("single");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [multiExpandedIds, setMultiExpandedIds] = useState<Set<number>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"insert" | "update">("insert");
  const [dialogInitial, setDialogInitial] = useState<Question | undefined>(undefined);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const { questions, loading, error } = useFetchQuestions(refreshToggle);
  const [sortBy, setSortBy] = useState<ImportantType | "none">("none");

  const refreshQuestions = () => setRefreshToggle(prev => !prev);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const toggleExpandSingle = (id: number) => setExpandedId(expandedId === id ? null : id);
  const toggleExpandMulti = (id: number) => {
    const nextSet = new Set(multiExpandedIds);
    if (nextSet.has(id)) nextSet.delete(id);
    else nextSet.add(id);
    setMultiExpandedIds(nextSet);
  };
  const isExpanded = (id?: number): boolean => {
    if (mode === "showAll") return true;
    if (mode === "single") return expandedId === id;
    if (mode === "multi") return multiExpandedIds.has(id!);
    return false;
  };
  const handleExpandToggle = (id: number) => {
    if (mode === "showAll") return;
    if (mode === "single") toggleExpandSingle(id);
    else if (mode === "multi") toggleExpandMulti(id);
  };

  const getSortPriority = (important?: ImportantType): number => {
    if (!important) return 3;
    if (sortBy === "Important") return important === "Important" ? 0 : important === "My" ? 1 : 2;
    if (sortBy === "My") return important === "My" ? 0 : important === "Important" ? 1 : 2;
    if (sortBy === "Loi") return important === "Loi" ? 0 : important === "Important" ? 1 : 2;
    return 0;
  };

  const sortedQuestions = sortBy === "none"
    ? questions
    : [...questions].sort(
      (a, b) => getSortPriority(a.important) - getSortPriority(b.important)
    );

  return (
    <div className="relative p-4 max-w-7xl mx-auto min-h-screen bg-background text-foreground dark:text-foreground">
      {/* Fixed floating container at lower right */}
      <div
        style={{ bottom: 16, right: 16 }}
        className={`fixed z-50 bg-white/30 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-xl px-2 py-1 flex flex-col items-center space-y-3 text-sm font-normal select-none w-max transition-all overflow-hidden ${isCollapsed ? "w-12 h-12" : "w-auto h-auto"
          }`}
      >
        {isCollapsed ? (
          <button
            aria-label="Expand mode selector"
            onClick={() => setIsCollapsed(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full shadow-sm hover:shadow-md transition"
            type="button"
          >
            {/* You can add an icon here */}
            +
          </button>
        ) : (
          <div className="flex flex-col gap-2 p-2 rounded-xl bg-background bg-white/0 shadow-sm w-full">
            {/* Segmented mode toggle */}
            <div className="flex rounded-md overflow-hidden border border-border">
              <button
                onClick={() => setMode("showAll")}
                className={`px-3 py-1 text-sm transition ${mode === "showAll"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/70"
                  }`}
                aria-pressed={mode === "showAll"}
              >
                Show All
              </button>
              <button
                onClick={() => setMode("single")}
                className={`px-3 py-1 text-sm transition ${mode === "single"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/70"
                  }`}
                aria-pressed={mode === "single"}
              >
                Flashcard
              </button>
              <button
                onClick={() => setMode("multi")}
                className={`px-3 py-1 text-sm transition ${mode === "multi"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/70"
                  }`}
                aria-pressed={mode === "multi"}
              >
                Toggle
              </button>
            </div>

            {/* Second row: add button left, collapse right */}
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setDialogOpen(true);
                  setDialogMode("insert");
                  setDialogInitial(undefined);
                }}
                className="flex-1 px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition text-center"
              >
                + Add Questions
              </button>

              <button
                aria-label="Collapse mode selector"
                onClick={() => setIsCollapsed(true)}
                className="p-1 rounded hover:bg-muted transition text-muted-foreground"
              >
                <CircleX size={18} />
              </button>
            </div>
          </div>

        )}
      </div>
      <div className="flex items-center justify-end mb-2 flex-wrap gap-2">
        <div className="text-xs text-muted-foreground">Sort by:</div>
        <div className="flex gap-1 sm:w-auto">
          <button
            onClick={() => setSortBy("none")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${sortBy === "none" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
          >
            Default
          </button>
          <button
            onClick={() => setSortBy("Important")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${sortBy === "Important" ? "bg-red-600 text-white" : "bg-muted text-foreground"}`}
          >
            Important
          </button>
          <button
            onClick={() => setSortBy("My")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${sortBy === "My" ? "bg-purple-600 text-white" : "bg-muted text-foreground"}`}
          >
            My
          </button>
          <button
            onClick={() => setSortBy("Loi")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${sortBy === "Loi" ? "bg-blue-600 text-white" : "bg-muted text-foreground"}`}
          >
            Loi
          </button>
        </div>
      </div>

      {/* Question list */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {sortedQuestions.map(({ id, question, loi, my, important, category }) => {
          const expanded = isExpanded(id);
          return (
            <li
              key={id}
              className={`bg-muted dark:bg-muted/80 border border-border dark:border-border/70 rounded-md p-3 cursor-pointer select-none shadow-sm transition-shadow hover:shadow-md flex flex-col justify-start`}
              onClick={() => handleExpandToggle(id!)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleExpandToggle(id!);
                }
              }}
              aria-expanded={expanded}
              role="button"
            >
              <div className="flex flex-row justify-between items-center mb-1">
                {/* Category label on the left */}
                {category && (
                  <div className="text-xs font-semibold text-secondary">
                    {category}
                  </div>
                )}

                {/* Badge and edit button container on the right */}
                <div className="ml-auto flex items-center space-x-2">
                  <ImportantBadge important={important} />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDialogOpen(true);
                      setDialogMode("update");
                      // Find the full question by id
                      setDialogInitial(questions.find(q => q.id === id));
                    }}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label={`Edit question ${id}`}
                  >
                    <Edit size={18} />
                  </button>
                </div>
              </div>

              {/* Question text */}
              <div
                className="font-medium text-sm whitespace-pre-line leading-tight mb-1"
                style={{ lineHeight: "1.2rem" }}
              >
                {question}
              </div>

              {/* Expandable answers */}
              <div
                className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${expanded ? "max-h-[360px] opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
                  }`}
              >
                <div
                  className={`scroll-container max-h-52 overflow-y-auto border border-border rounded-md p-2 bg-background dark:bg-background shadow-inner whitespace-pre-line`}
                >
                  <h3 className="text-xs font-semibold text-accent mb-1 select-none">Loi's Answer</h3>
                  <p className="text-xs leading-snug">{convertString(loi)}</p>
                </div>
                <div
                  className={`scroll-container max-h-52 overflow-y-auto border border-border rounded-md p-2 bg-background dark:bg-background shadow-inner whitespace-pre-line`}
                >
                  <h3 className="text-xs font-semibold text-accent mb-1 select-none">My's Answer</h3>
                  <p className="text-xs leading-snug">{convertString(my)}</p>
                </div>

              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-[10px] text-muted-foreground text-center select-none">
        Click or press enter/space on a question to reveal the answers.
      </p>
      <QuestionUpsertDialog
        open={dialogOpen}
        mode={dialogMode}
        initial={dialogInitial}
        onClose={() => setDialogOpen(false)}
        onSuccess={() => {
          setDialogOpen(false);
          refreshQuestions();
        }}
      />
    </div>

  );
}
