"use client";

import QuestionsPageContent from "@/features/questions/components/question-page-content";
import TimelineLayout from "../timeline/layout"; // adjust relative path if needed

export default function QuestionsPage() {
  return (
    <TimelineLayout>
      <QuestionsPageContent />
    </TimelineLayout>
  );
}
