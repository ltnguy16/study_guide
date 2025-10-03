"use client";

import React, { useState } from "react";
import { SideNav } from "@/shared";
import { TimelineItemClient } from "@/features/timeline/components/timeline-item-client";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // Add hideDots state to the layout
  const [hideDots, setHideDots] = useState<boolean>(false);

  return (
    <main className="flex flex-col min-h-screen w-full">
      <div className="flex flex-1 w-full overflow-hidden">
        <SideNav hideDots={hideDots} setHideDots={setHideDots} />
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="w-full">
            {/* Pass hideDots to TimelineItemClient */}
            <TimelineItemClient hideDots={hideDots} />
            {/* Render any additional children; or move this below if needed */}
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
