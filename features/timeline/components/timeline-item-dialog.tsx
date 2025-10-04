import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { TimelineEvent } from "./timeline-item-data";
import { EditDateRangeDialog, EditFieldDialog, formatDate } from "@/shared";
import { UpsertTimelineField, UpsertTimelineDates } from "@/shared/service/upsert/update-timeline-field";
import { FetchEventById } from "../service/fetch/fetch-event-by-id";
import { DeleteFromGallery } from "../service/delete/delete-from-gallery";
import { ScrollableImageGallery } from "./scrollable-image-gallery";
import { CreateBrowserClient } from "@/lib/supabase/client";

interface TimelineItemDialogProps {
    event: TimelineEvent;
    onEventUpdate: (updatedEvent: TimelineEvent) => void;
    onEventDelete: (deletedId: number) => void;
}

type FieldKey = keyof Pick<TimelineEvent, "loiview" | "myview" | "sharedview" | "location" | "name">;

export const TimelineItemDialog: React.FC<TimelineItemDialogProps> = ({
    event,
    onEventUpdate,
    onEventDelete,
}) => {
    const [localEvent, setLocalEvent] = useState(event);
    const [activeField, setActiveField] = useState<FieldKey | null>(null);
    const [editDates, setEditDates] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setLocalEvent(event);
    }, [event]);

    const handleNavigateToImageSelection = () => {
        router.push(`/timeline/image-selection?eventId=${localEvent.id}`);
    };

    const handleSubmit = async (field: FieldKey, newValue: TimelineEvent[FieldKey]) => {
        setLoading(true);
        try {
            await UpsertTimelineField(localEvent, field, newValue);
            const refreshedEvent = await FetchEventById(localEvent.id);
            if (refreshedEvent) {
                setLocalEvent(refreshedEvent);
                onEventUpdate(refreshedEvent);
            }
            setActiveField(null);
        } catch {
            alert("Failed to update. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDateSubmit = async (startDate: string, endDate: string) => {
        setLoading(true);
        try {
            await UpsertTimelineDates(localEvent, startDate, endDate);
            const refreshedEvent = await FetchEventById(localEvent.id);
            if (refreshedEvent) {
                setLocalEvent(refreshedEvent);
                onEventUpdate(refreshedEvent);
            }
            setEditDates(false);
        } catch {
            alert("Failed to update dates. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveImage = async (path: string) => {
        try {
            await DeleteFromGallery(localEvent.id, path);
            const updatedEvent = { ...localEvent };
            updatedEvent.images = updatedEvent.images.filter((img) => img !== path);
            setLocalEvent(updatedEvent);
            onEventUpdate(updatedEvent);
        } catch {
            alert("Failed to remove image. Please try again.");
        }
    };

    const handleDelete = async () => {
        const confirmed = confirm("Are you sure you want to delete this event?");
        if (!confirmed) return;

        setLoading(true);
        const supabase = CreateBrowserClient();

        try {
            const { error } = await supabase.from("timeline_events").delete().eq("id", localEvent.id);
            if (error) throw error;

            await supabase.from("galleries").delete().eq("eventid", localEvent.id);
            onEventDelete(localEvent.id);
        } catch (error) {
            console.error("Failed to delete event:", error);
            alert("Failed to delete event. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fieldItems: { key: FieldKey; label: string; value: string }[] = [
        { key: "loiview", label: "Loi's View", value: localEvent.loiview },
        { key: "myview", label: "My's View", value: localEvent.myview },
        { key: "sharedview", label: "Shared View", value: localEvent.sharedview },
        { key: "location", label: "Location", value: localEvent.location },
    ];

    return (
        <div
            className="max-w-xl w-full p-6 rounded-2xl border-2 border-border shadow-2xl space-y-4"
            style={{
                backgroundColor: "hsl(var(--dialog))",
                color: "hsl(var(--dialog-foreground))",
                boxSizing: "border-box",
            }}
        >
            {/* Date Range */}
            <div className="flex items-center justify-between text-xs font-semibold tracking-wider uppercase text-muted-foreground p-1">
                <span>
                    {localEvent.eventstart && localEvent.eventend
                        ? `${formatDate(localEvent.eventstart)} - ${formatDate(localEvent.eventend)}`
                        : formatDate(localEvent.eventstart || localEvent.eventend) || "Date Unknown"}
                </span>
                <button
                    onClick={() => setEditDates(true)}
                    disabled={loading}
                    className="text-accent hover:underline px-2 py-0.5 rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accent text-xs border hover:border-accent"
                    aria-label="Edit date range"
                    type="button"
                >
                    +
                </button>
            </div>

            {/* Title */}
            <div className="flex items-center justify-between text-xl font-semibold text-primary p-1">
                <span>{localEvent.name}</span>
                <button
                    onClick={() => setActiveField("name")}
                    disabled={loading}
                    className="text-accent hover:underline px-2 py-0.5 rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accent text-xs border hover:border-accent"
                    aria-label="Edit title"
                    type="button"
                >
                    +
                </button>
            </div>

            {/* Description fields */}
            <div className="text-sm leading-relaxed">
                {fieldItems.map(({ key, label, value }) => (
                    <div key={key} className="flex items-center justify-between p-1">
                        <div>
                            <span className="font-semibold text-muted-foreground">{label}: </span>
                            <span>{value}</span>
                        </div>
                        <button
                            onClick={() => setActiveField(key)}
                            disabled={loading}
                            className="text-accent hover:underline px-2 py-0.5 rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accent text-xs border hover:border-accent"
                            aria-label={`Edit ${label}`}
                            type="button"
                        >
                            +
                        </button>
                    </div>
                ))}
            </div>

            {/* Image gallery */}
            <ScrollableImageGallery
                images={localEvent.images}
                loading={loading}
                onAddImage={handleNavigateToImageSelection}
                onRemoveImage={handleRemoveImage}
            />

            {/* Edit dialogs */}
            {activeField && (
                <EditFieldDialog
                    title={`Edit ${activeField}`}
                    initialValue={localEvent[activeField]}
                    onSubmit={(val) => handleSubmit(activeField, val)}
                    onCancel={() => setActiveField(null)}
                    loading={loading}
                />
            )}

            {editDates && (
                <EditDateRangeDialog
                    initialStartDate={localEvent.eventstart ? new Date(localEvent.eventstart).toISOString().split("T")[0] : ""}
                    initialEndDate={localEvent.eventend ? new Date(localEvent.eventend).toISOString().split("T")[0] : ""}
                    onSubmit={handleDateSubmit}
                    onCancel={() => setEditDates(false)}
                    loading={loading}
                />
            )}

            {/* Delete button */}
            <div className="flex justify-end">
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="bg-destructive text-destructive-foreground rounded px-4 py-2 text-sm font-semibold hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-destructive transition disabled:opacity-60 disabled:cursor-not-allowed"
                    type="button"
                >
                    Delete Event
                </button>
            </div>
        </div>
    );
};
