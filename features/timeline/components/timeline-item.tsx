"use client";

import React from "react";
import { TimelineEvent } from "./timeline-item-data";
import { TimelineItemDot } from "./timeline-item-dot";

interface TimelineItemProps {
    events: TimelineEvent[];
}

const TIMELINE_HEIGHT = 900;
const TIMELINE_START = new Date("2020-01-01");
const TIMELINE_END = new Date("2025-12-31");

function getPosition(dateStr: string) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        console.warn("⚠️ Invalid date format:", dateStr);
        return 0;
    }

    const totalDuration = TIMELINE_END.getTime() - TIMELINE_START.getTime();
    const offset = date.getTime() - TIMELINE_START.getTime();
    return (offset / totalDuration) * TIMELINE_HEIGHT;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ events }) => {
    return (
        <div
            style={{
                position: "relative",
                height: `${TIMELINE_HEIGHT}px`,
                width: "256px",
                borderLeft: "4px solid hsl(var(--primary))", // Space Cadet from global CSS
                marginLeft: "40px",
                userSelect: "none",

            }}
        >
            {/* Year markers */}
            {[...Array(6)].map((_, i) => {
                const year = 2020 + i;
                const top = (i / 5) * TIMELINE_HEIGHT;
                return (
                    <div
                        key={year}
                        style={{
                            position: "absolute",
                            left: "-80px",
                            top: `${top}px`,
                            color: "#4b5563",
                            fontWeight: 600,
                            fontSize: "14px",
                            userSelect: "none",
                        }}
                    >
                        {year}
                    </div>
                );
            })}

            {/* Event bars with dots */}
            {events.map((event) => {
                const startTop = getPosition(event.eventstart!);
                const endTop = getPosition(event.eventend!);
                const barHeight = Math.max(endTop - startTop, 4);
                const dotTop = startTop + barHeight / 2;

                return (
                    <React.Fragment key={event.id}>
                        {/* Event Bar */}
                        <div
                            style={{
                                position: "absolute",
                                left: "0px",
                                top: `${startTop}px`,
                                height: `${barHeight}px`,
                                width: "4px",
                                backgroundColor: "hsl(var(--destructive))", // Caput Mortuum from global CSS
                                marginLeft: "-2px",
                                borderRadius: "2px",
                            }}
                        />

                        {/* Dot (positioned separately, not inside bar) */}
                        <TimelineItemDot event={event} top={dotTop} />
                    </React.Fragment>
                );
            })}
        </div>
    );
};
