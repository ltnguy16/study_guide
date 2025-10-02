"use client";

import React from "react";
import { TimelineEvent } from "./timeline-item-data";
import { TimelineItemDot } from "./timeline-item-dot";

interface TimelineItemProps {
    events: TimelineEvent[];
    openDotId: number | null;
    hideDots: boolean;
    onOpen: (id: number) => void;
    onClose: () => void;
    onEventUpdate: (event: TimelineEvent) => void;
    onEventDelete: (id: number) => void;
}
const TIMELINE_HEIGHT = 1200;
const TIMELINE_START = new Date("2020-01-01");
const TIMELINE_END = new Date("2026-12-31");

// Helper function to get position based on date
function getPosition(dateStr: string) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        console.warn("⚠️ Invalid date:", dateStr);
        return 0;
    }
    const totalDuration = TIMELINE_END.getTime() - TIMELINE_START.getTime();
    const offset = date.getTime() - TIMELINE_START.getTime();
    const pos = (offset / totalDuration) * TIMELINE_HEIGHT;

    console.log(`Date: ${dateStr}, Offset: ${offset}, Position: ${pos}`);

    return pos;
}


// Define the year start dates
const years = [
    { year: 2020, date: "2020-01-01" },
    { year: 2021, date: "2021-01-01" },
    { year: 2022, date: "2022-01-01" },
    { year: 2023, date: "2023-01-01" },
    { year: 2024, date: "2024-01-01" },
    { year: 2025, date: "2025-01-01" },
    { year: 2026, date: "2026-01-01" },
    { year: 2027, date: "2027-01-01" },
];

// Quarter start dates
const quarterDates = [
    { label: "Q1", date: "2020-01-01" },
    { label: "Q2", date: "2020-04-01" },
    { label: "Q3", date: "2020-07-01" },
    { label: "Q4", date: "2020-10-01" },
    { label: "Q1", date: "2021-01-01" },
    { label: "Q2", date: "2021-04-01" },
    { label: "Q3", date: "2021-07-01" },
    { label: "Q4", date: "2021-10-01" },
    { label: "Q1", date: "2022-01-01" },
    { label: "Q2", date: "2022-04-01" },
    { label: "Q3", date: "2022-07-01" },
    { label: "Q4", date: "2022-10-01" },
    { label: "Q1", date: "2023-01-01" },
    { label: "Q2", date: "2023-04-01" },
    { label: "Q3", date: "2023-07-01" },
    { label: "Q4", date: "2023-10-01" },
    { label: "Q1", date: "2024-01-01" },
    { label: "Q2", date: "2024-04-01" },
    { label: "Q3", date: "2024-07-01" },
    { label: "Q4", date: "2024-10-01" },
    { label: "Q1", date: "2025-01-01" },
    { label: "Q2", date: "2025-04-01" },
    { label: "Q3", date: "2025-07-01" },
    { label: "Q4", date: "2025-10-01" },
    { label: "Q1", date: "2026-01-01" },
    { label: "Q2", date: "2026-04-01" },
    { label: "Q3", date: "2026-07-01" },
    { label: "Q4", date: "2026-10-01" },
];


export const TimelineItem: React.FC<TimelineItemProps> = ({
    events,
    openDotId,
    hideDots,
    onOpen,
    onClose,
    onEventUpdate,
    onEventDelete,
}) => {
    return (
        <div
            style={{
                position: "relative",
                height: `${TIMELINE_HEIGHT}px`,
                width: "256px",
                borderLeft: "4px solid hsl(var(--primary))",
                marginLeft: "40px",
                userSelect: "none",
            }}
        >
            {/* Year labels aligned precisely */}
            {years.map(({ year, date }) => {
                const top = getPosition(date);
                return (
                    <div
                        key={year}
                        style={{
                            position: "absolute",
                            left: "-80px",
                            top: `${top}px`,
                            transform: "translateY(-50%)",
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


            {/* Quarter labels and dashes aligned to specific dates */}
            {quarterDates.map((q) => {
                const top = getPosition(q.date);
                return (
                    <React.Fragment key={q.label + q.date}>
                        {/* Dash line extending from the main line */}
                        <div
                            style={{
                                position: "absolute",
                                left: "-12px",
                                top: `${top}px`,
                                width: "12px",
                                height: "2px",
                                backgroundColor: "#9ca3af",
                                borderRadius: "1px",
                                transform: "translateY(-50%)",
                            }}
                        />
                        {/* Quarter label below the dash */}
                        <div
                            style={{
                                position: "absolute",
                                left: "-50px",
                                top: `${top}px`,
                                transform: "translateY(-50%)",
                                width: "40px",
                                textAlign: "center",
                                fontSize: "11px",
                                color: "#6b7280",
                                fontWeight: 500,
                                userSelect: "none",
                            }}
                        >
                            {q.label}
                        </div>
                    </React.Fragment>
                );
            })}

            {/* Events with dots and bars */}

            {events.map((event) => {
                const startTop = getPosition(event.eventstart!);
                const endTop = getPosition(event.eventend!);
                const barHeight = Math.max(endTop - startTop, 4);
                const dotTop = startTop + barHeight / 2;
                return (
                    <React.Fragment key={event.id}>
                        {/* Bar */}
                        <div
                            style={{
                                position: "absolute",
                                left: "7px",
                                top: `${startTop}px`,
                                height: `${barHeight}px`,
                                width: "4px",
                                backgroundColor: "hsl(var(--destructive))",
                                borderRadius: "2px",
                            }}
                        />
                        {/* Dot */}
                        {!hideDots && (
                            <TimelineItemDot
                                event={event}
                                top={dotTop}
                                isOpen={openDotId === event.id}
                                onOpen={() => onOpen(event.id)}
                                onClose={onClose}
                                onEventUpdate={onEventUpdate}
                                onEventDelete={onEventDelete}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};