import { CreateBrowserClient } from "@/lib/supabase/client";
import { config } from "@/shared/components/config";
import { TimelineEvent } from "@/features/timeline/components/timeline-item-data";

type UpsertPayload = Omit<TimelineEvent, "images">;

export async function UpsertTimelineField<K extends keyof Omit<TimelineEvent, "images">>(
    event: TimelineEvent,
    field: K,
    newValue: TimelineEvent[K]
) {
    const database = CreateBrowserClient();

    // Exclude images property from update
    const { images, ...eventWithoutImages } = event;

    const updatedEvent: UpsertPayload = {
        ...eventWithoutImages,
        [field]: newValue,
    };

    const { data, error } = await database
        .from(config.timelineTable!)
        .upsert(updatedEvent, { onConflict: "id" })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}

export async function UpsertTimelineDates(
    event: TimelineEvent,
    startDate: string | null,
    endDate: string | null
) {
    const database = CreateBrowserClient();

    const startISO = startDate ? new Date(startDate).toISOString().replace("Z", "") : null;
    const endISO = endDate ? new Date(endDate).toISOString().replace("Z", "") : null;

    // Exclude images from update
    const { level, images, ...eventWithoutLevelAndImages } = event;

    const updateData: UpsertPayload = {
    ...eventWithoutLevelAndImages,
    eventstart: startISO,
    eventend: endISO,
    };
    const { data, error } = await database
        .from(config.timelineTable!)
        .upsert(updateData, { onConflict: "id" })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}
