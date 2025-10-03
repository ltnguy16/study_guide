"use client";

import { Settings } from "lucide-react";
import React, { useState } from "react";

const questions = [
  {
    id: 1,
    question: "Weight ? 95lb | 138lb",
    loisAnswer: "95lb",
    myAnswer: "138lb",
  },
  {
    id: 2,
    question: "Did your parents approve of the match? Why or why not?",
    loisAnswer: "Loi's parent doesn’t like it",
    myAnswer: "My's parent is very open, they want My’s decision to be the most important.",
  },
  {
    id: 3,
    question: "How many TV sets are in your house? In which rooms?",
    loisAnswer: "No",
    myAnswer: "No",
  },
  {
    id: 4,
    question: "Habit",
    loisAnswer: "Easily getting cold/ moody when cold\nSmall allergy with pet\nMake weird noise when it happened",
    myAnswer: "Easily cold, pets can trigger mild allergy, sometimes strange noises occur when stressed",
  },
  {
    id: 5,
    question: "Beauty Mark / Something special",
    loisAnswer: "A heart Mole on my back left shoulder\nA small scar since birth on the front left shoulder",
    myAnswer: "Mole on the right side, underneath my collarbone\nMole next to my belly button",
  },
  {
    id: 6,
    question: "Favorite color for Bra/underwear",
    loisAnswer: "Brand Victoria Secret\nColor: Basic Black\nMonday through Sunday: Black\nBoxer, no preference on color",
    myAnswer: "Blue\nTank top for undershirt, black",
  },
  {
    id: 7,
    question: "First Impression",
    loisAnswer: "Loi is a cute funny guy\nHis personality made me win over time",
    myAnswer: "Originally I thought she is too cute and not my type. Over time I was drawn to her self-sacrifice and stubbornness.",
  },
  {
    id: 8,
    question: "Bad habit while living together",
    loisAnswer: "If mad, I delete every contact with Loi.",
    myAnswer: "Keep forgetting toilet seat down.\nForget to do dishes.\nAlways first to chase after after fights.\nStay up too late.\nSleep through alarms.",
  },
  {
    id: 9,
    question: "Ex(s)",
    loisAnswer: "One before\nSex buddy initially, both lost virginity same day.",
    myAnswer: "One before",
  },
  // Add more as needed ...
];

type Mode = "showAll" | "single" | "multi";

export default function QuestionsPageContent() {
  const [mode, setMode] = useState<Mode>("single");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [multiExpandedIds, setMultiExpandedIds] = useState<Set<number>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);

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
            <Settings size={20} />
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
        {questions.map(({ id, question, loisAnswer, myAnswer }) => {
          const expanded = isExpanded(id);
          return (
            <li
              key={id}
              className="bg-muted dark:bg-muted/80 border border-border dark:border-border/70 rounded-md p-3 cursor-pointer select-none shadow-sm transition-shadow hover:shadow-md flex flex-col justify-start"
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
              <div className="font-medium text-sm whitespace-pre-line leading-tight mb-1" style={{ lineHeight: "1.2rem" }}>
                {question}
              </div>

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
