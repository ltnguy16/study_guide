"use client"
import { SideNav } from "@/shared";
import React, { ReactNode } from "react";
import { HideDotsProvider, useHideDots } from "./hide-dots-context";

interface TimelineLayoutProps {
  children: ReactNode;
}

export default function TimelineLayout({ children }: TimelineLayoutProps) {
  return (
    <HideDotsProvider>
      <LayoutContent>{children}</LayoutContent>
    </HideDotsProvider>
  );
}

function LayoutContent({ children }: { children: ReactNode }) {
  const { hideDots, setHideDots } = useHideDots();

  return (
    <main className="flex flex-col min-h-screen w-full">
      <div className="flex flex-1 w-full overflow-hidden">
        <SideNav hideDots={hideDots} setHideDots={setHideDots} />
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="w-full">{children}</div>
        </div>
      </div>
    </main>
  );
}
