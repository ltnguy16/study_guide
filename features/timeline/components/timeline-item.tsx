"use client";

import React from "react";
import { TimelineEvent, TimelineEventWithLevel } from "./timeline-item-data";
import { TimelineItemDot } from "./timeline-item-dot";
import { AssignTimelineLevels } from "./assign-timeline-levels";

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

// Calculate vertical position for a given date string within timeline range
function getPosition(dateStr: string) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        console.warn("⚠️ Invalid date:", dateStr);
        return 0;
    }
    const totalDuration = TIMELINE_END.getTime() - TIMELINE_START.getTime();
    const offset = date.getTime() - TIMELINE_START.getTime();
    const pos = (offset / totalDuration) * TIMELINE_HEIGHT;
    return pos;
}

// Year markers
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

// Quarter markers
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
    const OFFSET_STEP = 32;
    const eventsWithLevels: TimelineEventWithLevel[] = AssignTimelineLevels(events);

    return (
        <div
            style={{
                position: "relative",
                height: `${TIMELINE_HEIGHT}px`,
                width: "100%",
                borderLeft: "4px solid #7F2A3C",   // Velvet red main timeline line
                marginLeft: "40px",
                userSelect: "none",
            }}
        >
            {/* Year labels */}
            {years.map(({ year, date }) => {
                const top = getPosition(date);
                return (
                    <div
                        key={"yearline-" + year}
                        aria-hidden="true"
                        style={{
                            position: "absolute",
                            left: 0,
                            top: `${top}px`,
                            width: "100%",
                            height: "1px",
                            background: "hsl(var(--muted))",
                            opacity: 0.66,
                            zIndex: 1,
                            pointerEvents: "none"
                        }}
                    >
                        {year}
                    </div>
                );
            })}

            {/* Quarter labels and dashes */}
            {quarterDates.map(({ label, date }) => {
                const top = getPosition(date);
                return (
                    <React.Fragment key={label + date}>
                        <div
                            key={"quarterline-" + date}
                            aria-hidden="true"
                            style={{
                            position: "absolute",
                            left: 0,
                            top: `${top}px`,
                            width: "100%",
                            height: "1px",
                            background: "hsl(var(--muted))",
                            opacity: 0.33,
                            zIndex: 1,
                            pointerEvents: "none"
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                left: "-50px",
                                top: `${top}px`,
                                transform: "translateY(-50%)",
                                width: "40px",
                                textAlign: "center",
                                fontSize: "11px",
                                color: "#4A4A4A",           // Muted charcoal for quarter labels
                                fontWeight: 500,
                                userSelect: "none",
                            }}
                        >
                            {label}
                        </div>
                    </React.Fragment>
                );
            })}

            {/* Events bars and dots */}
            {eventsWithLevels.map((event) => {
                const startTop = getPosition(event.eventstart!);
                const endTop = getPosition(event.eventend!);
                const barHeight = Math.max(endTop - startTop, 4);
                const dotTop = startTop + barHeight / 2;

                const leftBase = 7;
                const left = leftBase + event.level * OFFSET_STEP;

                return (
                    <React.Fragment key={event.id}>
                        {/* Start indicator */}
                        <div
                            style={{
                            position: "absolute",
                            left: `${left - 4}px`,   // slightly left of the bar
                            top: `${startTop - 6}px`, // slightly above start of bar
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            backgroundColor: "#B75D6F",
                            boxShadow: "0 0 6px #B75D6F",
                            zIndex: 10,
                            }}
                        />

                        {/* End indicator */}
                        <div
                            style={{
                            position: "absolute",
                            left: `${left - 4}px`,   // aligned with start indicator horizontally
                            top: `${endTop - 6}px`,  // slightly above end of bar
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            backgroundColor: "#B75D6F",
                            boxShadow: "0 0 6px #B75D6F",
                            zIndex: 10,
                            }}
                        />
                        {/* Bar */}
                        <div
                            style={{
                                position: "absolute",
                                left: `${left}px`,
                                top: `${startTop}px`,
                                height: `${barHeight}px`,
                                width: "4px",
                                backgroundColor: "#B75D6F", // Lighter velvet coral for event bars
                                borderRadius: "2px",
                            }}
                        />
                        {/* Dot */}
                        {!hideDots && (
                            <TimelineItemDot
                                event={event}
                                top={dotTop}
                                left={left}
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
