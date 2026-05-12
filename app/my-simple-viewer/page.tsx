"use client";

import SimpleViewerContent from "@/features/my-simple-viewer/component/simple-viewer-content";
import TimelineLayout from "../timeline/layout"; // adjust relative path if needed

export default function mySimpleViewer() {
  return (
    <TimelineLayout>
      <header className="px-6 py-4 border-b border-border dark:border-border/50 shadow-sm sticky top-0 bg-background dark:bg-background z-10">
        <h1 className="text-2xl font-semibold text-primary dark:text-primary-foreground">
          Simple Viewer
        </h1>
      </header>
      <SimpleViewerContent />
    </TimelineLayout>
  );
}
