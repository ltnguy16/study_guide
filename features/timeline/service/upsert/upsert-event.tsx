"use client"

import { CreateBrowserClient } from "@/lib/supabase/client";
import { TimelineEvent } from "../../components/timeline-item-data";

export async function UpsertTimeline(newEvent: TimelineEvent) {
    const { images, id, ...uploadEvent } = newEvent;
    console.log(uploadEvent);
    const supabase = CreateBrowserClient();
    const { data, error } = await supabase
        .from("timeline_events")
        .insert([uploadEvent]);

    if (error) {
        console.log(error);
    }
}