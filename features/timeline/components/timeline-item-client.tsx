"use client";

import React from "react";
import { useTimelineItemData } from "./timeline-item-data";
import { TimelineItem } from "./timeline-item";

export function TimelineItemClient() {
    const { events, loading } = useTimelineItemData();

    if (loading) return <div>Loading timeline...</div>;
    if (!events.length) return <div>No timeline events found.</div>;
    console.log(events)

    return <TimelineItem events={events} />;
}
