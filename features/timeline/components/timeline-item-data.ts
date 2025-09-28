"use client";

import { useEffect, useState } from "react";
import { CreateBrowserClient } from "@/lib/supabase/client";

export interface TimelineEvent {
    id: number;
    name: string;
    eventstart: string | null;
    eventend: string | null;
    loiview: string;
    myview: string;
    sharedview: string;
    location: string;
    images: string[];
}

export function useTimelineItemData() {
    const [events, setEvents] = useState<TimelineEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const supabase = CreateBrowserClient();

            const { data: timelineEvents, error: eventsError } = await supabase
                .from("timeline_events")
                .select("*");

            if (eventsError || !timelineEvents) {
                console.error("Error fetching timeline events:", eventsError);
                setLoading(false);
                return;
            }

            const enrichedEvents = await Promise.all(
                timelineEvents.map(async (event: any) => {
                    const { data: gallery, error: galleryError } = await supabase
                        .from("galleries")
                        .select("imagepath")
                        .eq("eventid", event.id);

                    if (galleryError) {
                        console.error(`Gallery error for event ${event.id}`, galleryError);
                    }

                    const images = gallery?.map((img) => img.imagepath).filter(Boolean) ?? [];

                    return {
                        id: event.id,
                        name: event.name,
                        eventstart: event.eventstart,
                        eventend: event.eventend,
                        loiview: event.loiview,
                        myview: event.myview,
                        sharedview: event.sharedview,
                        location: event.location,
                        images,
                    };
                })
            );

            setEvents(enrichedEvents);
            setLoading(false);
        }

        fetchData();
    }, []);

    return { events, loading };
}

