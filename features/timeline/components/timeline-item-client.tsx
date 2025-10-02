"use client";

import React, { useState } from "react";
import { useTimelineItemData } from "./timeline-item-data";
import { TimelineItem } from "./timeline-item";
import AddTimelineDialogContainer from "./add-timeline-dialog.container";

export function TimelineItemClient() {
    const { events, loading, fetchData } = useTimelineItemData();
    const [openDotId, setOpenDotId] = useState<number | null>(null);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    if (loading) return <div>Loading timeline...</div>;
    if (!events.length) return <div>No timeline events found.</div>;

    // Hide dots only if Add Timeline dialog is open
    const hideDots = addDialogOpen;

    return (
        <>
            <TimelineItem
                events={events}
                openDotId={openDotId}
                onOpen={(id) => setOpenDotId(id)}
                onClose={() => setOpenDotId(null)}
                hideDots={hideDots}
            />
            <AddTimelineDialogContainer
                onAdd={fetchData}
                isOpen={addDialogOpen}
                setIsOpen={setAddDialogOpen}
            />
        </>
    );
}
