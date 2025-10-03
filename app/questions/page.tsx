"use client";

import QuestionsPageContent from "@/features/questions/components/question-page-content";
import TimelineLayout from "../timeline/layout"; // adjust relative path if needed

export default function QuestionsPage() {
  return (
    <TimelineLayout>
      <header className="px-6 py-4 border-b border-border dark:border-border/50 shadow-sm sticky top-0 bg-background dark:bg-background z-10">
        <h1 className="text-2xl font-semibold text-primary dark:text-primary-foreground">
          Study Questions
        </h1>
      </header>
      <QuestionsPageContent />
    </TimelineLayout>
  );
}
