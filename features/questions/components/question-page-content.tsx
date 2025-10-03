"use client";

import { InfoTooltip } from "@/shared";
import { MessageSquareWarning, Edit } from "lucide-react";
import React, { useState } from "react";

type ImportantType = "Loi" | "My" | "Both";

interface Question {
  id: number;
  question: string;
  loisAnswer: string;
  myAnswer: string;
  important?: ImportantType;
  category?: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Weight ? 95lb | 138lb",
    loisAnswer: "95lb",
    myAnswer: "138lb",
    category: "physique",
  },
  {
    id: 2,
    question: "Did your parents approve of the match? Why or why not?",
    loisAnswer: "Loi's parent doesn’t like it",
    myAnswer: "My's parent is very open, they want My’s decision to be the most important.",
    important: "Both",
    category: "acquaintances",
  },
  {
    id: 3,
    question: "How many TV sets are in your house? In which rooms?",
    loisAnswer: "No",
    myAnswer: "No",
    category: "living",
  },
  {
    id: 4,
    question: "Habit",
    loisAnswer: "Easily getting cold/moody when cold\nSmall allergy with pet\nMake weird noise when it happened",
    myAnswer: "Easily cold, pets can trigger mild allergy, sometimes strange noises occur when stressed",
    important: "Loi",
    category: "living",
  },
  {
    id: 5,
    question: "Beauty Mark / Something special",
    loisAnswer: "A heart Mole on my back left shoulder\nA small scar since birth on the front left shoulder",
    myAnswer: "Mole on the right side, underneath my collarbone\nMole next to my belly button",
    important: "My",
    category: "physique",
  },
  {
    id: 6,
    question: "Favorite color for Bra/underwear",
    loisAnswer: "Brand Victoria Secret\nColor: Basic Black\nMonday through Sunday: Black\nBoxer, no preference on color",
    myAnswer: "Blue\nTank top for undershirt, black",
    important: "Both",
    category: "living",
  },
  {
    id: 7,
    question: "First Impression",
    loisAnswer: "Loi is a cute funny guy\nHis personality made me win over time",
    myAnswer: "Originally I thought she is too cute and not my type. Over time I was drawn to her self-sacrifice and stubbornness.",
    category: "history",
  },
  {
    id: 8,
    question: "Bad habit while living together",
    loisAnswer: "If mad, I delete every contact with Loi.",
    myAnswer: "Keep forgetting toilet seat down.\nForget to do dishes.\nAlways first to chase after fights.\nStay up too late.\nSleep through alarms.",
    important: "My",
    category: "living",
  },
  {
    id: 9,
    question: "Ex(s)",
    loisAnswer: "One before\nSex buddy initially, both lost virginity same day.",
    myAnswer: "One before",
    category: "history",
  },
  {
    id: 10,
    question: "Favorite weekend activity",
    loisAnswer: "Playing games and sleeping in",
    myAnswer: "Sleeping in",
    category: "living",
  },
  {
    id: 11,
    question: "Morning routine",
    loisAnswer: "Meditation and tea",
    myAnswer: "Workout and coffee",
    important: "Loi",
    category: "living",
  },
  {
    id: 12,
    question: "Biggest fear",
    loisAnswer: "Being alone",
    myAnswer: "Failure",
    important: "Both",
    category: "personal",
  },
];

function ImportantBadge({ important }: { important?: ImportantType }) {
  if (!important) return null;

  const colorMap: Record<ImportantType, string> = {
    Loi: "bg-blue-600",
    My: "bg-purple-600",
    Both: "bg-red-600",
  };

  const labelMap: Record<ImportantType, string> = {
    Loi: "Marked important by Loi",
    My: "Marked important by You",
    Both: "Marked important by Both",
  };

  return (
    <InfoTooltip text={labelMap[important]}>
      <span
        className={`inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-xs font-semibold text-white shadow-sm ${colorMap[important]}`}
        aria-label={labelMap[important]}
      >
        <MessageSquareWarning size={14} />
        <span>{important === "Both" ? "Important" : important}</span>
      </span>
    </InfoTooltip>
  );
}

export default function QuestionsPageContent() {
  const [mode, setMode] = useState<"showAll" | "single" | "multi">("single");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [multiExpandedIds, setMultiExpandedIds] = useState<Set<number>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);

  const toggleExpandSingle = (id: number) => setExpandedId(expandedId === id ? null : id);
  const toggleExpandMulti = (id: number) => {
    const nextSet = new Set(multiExpandedIds);
    if (nextSet.has(id)) nextSet.delete(id);
    else nextSet.add(id);
    setMultiExpandedIds(nextSet);
  };
  const isExpanded = (id: number): boolean => {
    if (mode === "showAll") return true;
    if (mode === "single") return expandedId === id;
    if (mode === "multi") return multiExpandedIds.has(id);
    return false;
  };
  const handleExpandToggle = (id: number) => {
    if (mode === "showAll") return;
    if (mode === "single") toggleExpandSingle(id);
    else if (mode === "multi") toggleExpandMulti(id);
  };

  return (
    <div className="relative p-4 max-w-7xl mx-auto min-h-screen bg-background text-foreground dark:text-foreground">
      {/* Fixed floating container at lower right */}
      <div
        style={{ bottom: 16, right: 16 }}
        className={`fixed z-50 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-xl px-4 py-3 flex flex-col items-center space-y-3 text-sm font-normal select-none w-max transition-all overflow-hidden ${
          isCollapsed ? "w-12 h-12" : "w-auto h-auto"
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
          <>
            <div className="flex items-center justify-between w-full space-x-6 pr-8">
              <button
                onClick={() => setMode("showAll")}
                className={`px-3 py-1 rounded-md whitespace-nowrap ${
                  mode === "showAll"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted dark:bg-muted/70"
                } transition`}
                aria-pressed={mode === "showAll"}
                type="button"
              >
                Show All
              </button>
              <button
                onClick={() => setMode("single")}
                className={`px-3 py-1 rounded-md whitespace-nowrap ${
                  mode === "single"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted dark:bg-muted/70"
                } transition`}
                aria-pressed={mode === "single"}
                type="button"
              >
                Flashcard
              </button>
              <button
                onClick={() => setMode("multi")}
                className={`px-3 py-1 rounded-md whitespace-nowrap ${
                  mode === "multi"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted dark:bg-muted/70"
                } transition`}
                aria-pressed={mode === "multi"}
                type="button"
              >
                Toggle
              </button>
            </div>
            <button
              onClick={() => alert("Add New Flash clicked")}
              className="w-full px-4 py-2 text-sm bg-pyramid-primary hover:bg-pyramid-primary-dark text-pyramid-primary-foreground rounded-md text-center transition"
              type="button"
            >
              Add New Flash
            </button>
            {/* Collapse button in reserved space with styling */}
            <button
              aria-label="Collapse mode selector"
              onClick={() => setIsCollapsed(true)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-muted-foreground/80 rounded p-1 focus:outline-none transition"
              type="button"
            >
              ✕
            </button>
          </>
        )}
      </div>

      {/* Page heading */}
      <h1 className="text-xl font-semibold mb-4 text-primary dark:text-primary-foreground">
        Study Questions
      </h1>

      {/* Question list */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {questions.map(({ id, question, loisAnswer, myAnswer, important, category }) => {
          const expanded = isExpanded(id);
          return (
            <li
              key={id}
              className={`bg-muted dark:bg-muted/80 border border-border dark:border-border/70 rounded-md p-3 cursor-pointer select-none shadow-sm transition-shadow hover:shadow-md flex flex-col justify-start ${
                important === "Loi"
                  ? "border-red-500"
                  : important === "My"
                  ? "border-blue-500"
                  : important === "Both"
                  ? "border-green-500"
                  : ""
              }`}
              onClick={() => handleExpandToggle(id)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleExpandToggle(id);
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
                      e.stopPropagation(); // prevent card expand toggle on button click
                      setEditingQuestionId(id);
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
                className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                  expanded ? "max-h-[360px] opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <section className="bg-background dark:bg-background rounded-md p-2 border border-border shadow-inner whitespace-pre-line">
                    <h3 className="text-xs font-semibold text-accent mb-1 select-none">
                      Loi's Answer
                    </h3>
                    <p className="text-xs leading-snug">{loisAnswer}</p>
                  </section>
                  <section className="bg-background dark:bg-background rounded-md p-2 border border-border shadow-inner whitespace-pre-line">
                    <h3 className="text-xs font-semibold text-accent mb-1 select-none">
                      My's Answer
                    </h3>
                    <p className="text-xs leading-snug">{myAnswer}</p>
                  </section>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-[10px] text-muted-foreground text-center select-none">
        Click or press enter/space on a question to reveal the answers.
      </p>
    </div>
  );
}
