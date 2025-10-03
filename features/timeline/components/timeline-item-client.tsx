"use client";

import React, { useState, useEffect } from "react";
import { useTimelineItemData } from "./timeline-item-data";
import { TimelineItem } from "./timeline-item";
import AddTimelineDialogContainer from "./add-timeline-dialog.container";
import { TimelineEvent } from "./timeline-item-data";

interface TimelineItemClientProps {
  hideDots: boolean;
}

export function TimelineItemClient({ hideDots } : TimelineItemClientProps){
    const { events: initialEvents, loading, fetchData } = useTimelineItemData();

    const [events, setEvents] = useState<TimelineEvent[]>(initialEvents);
    const [openDotId, setOpenDotId] = useState<number | null>(null);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    // Sync local events state with timeline data from hook
    useEffect(() => {
        setEvents(initialEvents);
    }, [initialEvents]);

    // Update one event in local state when changed
    const handleEventUpdate = (updatedEvent: TimelineEvent) => {
        setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
    };

    // Delete event locally and close its dot if open
    const handleEventDelete = (deletedId: number) => {
        setEvents((prev) => prev.filter((e) => e.id !== deletedId));
        if (openDotId === deletedId) setOpenDotId(null);
    };

    return (
        <>
            {loading && <div>Loading timeline...</div>}
            {!loading && events.length === 0 && <div>No timeline events found.</div>}
            {!loading && events.length > 0 && (
                <TimelineItem
                    events={events}
                    openDotId={openDotId}
                    onOpen={(id) => setOpenDotId(id)}
                    onClose={() => setOpenDotId(null)}
                    hideDots={hideDots || addDialogOpen}
                    onEventUpdate={handleEventUpdate}
                    onEventDelete={handleEventDelete}
                />
            )}

            <AddTimelineDialogContainer
                onAdd={() => fetchData().then(() => setAddDialogOpen(false))}
                isOpen={addDialogOpen}
                setIsOpen={setAddDialogOpen}
            />
        </>
    );
}
