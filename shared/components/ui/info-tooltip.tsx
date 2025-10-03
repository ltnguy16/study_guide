'use client';

import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

interface InfoTooltipProps {
  text: React.ReactNode;
  children: React.ReactNode; // explicitly declare children
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ text, children }) => {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={4}
            className="z-50 max-w-xs select-none rounded-md bg-foreground px-2 py-1.5 text-xs text-background shadow-md"
          >
            {text}
            <Tooltip.Arrow className="fill-black" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};