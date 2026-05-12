import { CreateBrowserClient } from "@/lib/supabase/client";
import { TimelineEvent } from "../../components/timeline-item-data";

export async function FetchEventById(id: number): Promise<TimelineEvent | null> {
    const supabase = CreateBrowserClient();

    const { data: event, error: eventError } = await supabase
        .from("timeline_events")
        .select("*")
        .eq("id", id)
        .single();

    if (eventError || !event) {
        console.error("Failed to fetch event by id:", eventError);
        return null;
    }

    // Fetch related images from galleries table
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
        outsideview: event.outsideview,
        myview: event.myview,
        sharedview: event.sharedview,
        location: event.location,
        images,
    };
}
