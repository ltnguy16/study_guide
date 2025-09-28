"use client";

import { useEffect, useState } from "react";
import { CreateBrowserClient } from "@/lib/supabase/client";

export interface Event {
    id: number;
    name: string,
    startDate: string;
    endDate: string;
    loiView: string;
    myView: string;
    sharedView: string;
    location: string;
    images: string[];
}

export function useTimelineItemData() {
    const [events, setEvents] = useState<Event[]>([]);
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
                timelineEvents.map(async (event) => {
                    const { data: gallery, error: galleryError } = await supabase
                        .from("galleries")
                        .select("imagepath")
                        .eq("eventid", event.id);

                    if (galleryError) console.error(`Gallery error for event ${event.id}`, galleryError);

                    const images = gallery
                        ? await Promise.all(
                            gallery.map((img) => {
                                return img.imagepath;
                            })
                        )
                        : [];
                    return {
                        id: event.id,
                        name: event.name,
                        startDate: event.eventstart,
                        endDate: event.eventend,
                        loiView: event.loiview,
                        myView: event.myview,
                        sharedView: event.sharedview,
                        location: event.location,
                        images: images.filter(Boolean),
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
