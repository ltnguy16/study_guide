import { useRouter } from "next/navigation"; // Import next/navigation for App Router
import React, { useState, useEffect } from "react";
import { TimelineEvent } from "./timeline-item-data";
import { EditDateRangeDialog, EditFieldDialog, formatDate } from "@/shared";
import { UpsertTimelineField, UpsertTimelineDates } from "@/shared/service/upsert/update-timeline-field";
import { FetchEventById } from "../service/fetch/fetch-event-by-id";
import SecureImage from "@/shared/components/ui/sercure-image";
import { Trash } from "lucide-react"; // Import trash icon
import { DeleteFromGallery } from "../service/delete/delete-from-gallery";

interface TimelineItemDialogProps {
    event: TimelineEvent;
    onEventUpdate: (updatedEvent: TimelineEvent) => void;
}

type FieldKey = keyof Pick<TimelineEvent, "loiview" | "myview" | "sharedview" | "location" | "name">;

export const TimelineItemDialog: React.FC<TimelineItemDialogProps> = ({ event, onEventUpdate }) => {
    const [localEvent, setLocalEvent] = useState(event);
    const [activeField, setActiveField] = useState<FieldKey | null>(null);
    const [editDates, setEditDates] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter(); // Initialize the router for navigation

    useEffect(() => {
        setLocalEvent(event); // Update local event if prop changes
    }, [event]);

    // Handle image selection navigation
    const handleNavigateToImageSelection = () => {
        router.push(`/timeline/image-selection?eventId=${localEvent.id}`);
    };

    // Handle text field update (e.g., name, loiview)
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
        } catch (error) {
            console.error("Failed to update field:", error);
            alert("Failed to update. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle date range updates
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
        } catch (error) {
            console.error("Failed to update dates:", error);
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
        } catch (error) {
            // Handle error and prevent UI update if deletion fails
            console.error("Error during image removal:", error);
            alert("Failed to remove image. Please try again.");
        }
    };


    // Fields for the dialog (name, loiview, myview, etc.)
    const fieldItems: { key: FieldKey; label: string; value: string }[] = [
        { key: "loiview", label: "LoFi's View", value: localEvent.loiview },
        { key: "myview", label: "My's View", value: localEvent.myview },
        { key: "sharedview", label: "Shared View", value: localEvent.sharedview },
        { key: "location", label: "Location", value: localEvent.location },
    ];

    return (
        <div className="relative rounded-xl bg-dialog text-dialog-foreground shadow-lg p-6 border border-border space-y-4 w-full max-w-md">
            {/* Date Range */}
            <div className="flex items-start justify-between text-xs text-muted-foreground font-semibold tracking-wider uppercase">
                <span>
                    {localEvent.eventstart && localEvent.eventend
                        ? `${formatDate(localEvent.eventstart)} - ${formatDate(localEvent.eventend)}`
                        : formatDate(localEvent.eventstart || localEvent.eventend) || "Date Unknown"}
                </span>
                <button
                    onClick={() => setEditDates(true)}
                    disabled={loading}
                    className="text-accent hover:underline text-xs ml-2"
                    aria-label="Edit date range"
                >
                    +
                </button>
            </div>

            {/* Title */}
            <div className="flex items-start justify-between text-xl font-semibold text-primary">
                <span>{localEvent.name}</span>
                <button
                    onClick={() => setActiveField("name")}
                    disabled={loading}
                    className="text-accent hover:underline text-xs ml-2"
                    aria-label="Edit title"
                >
                    +
                </button>
            </div>

            {/* Description Fields */}
            <div className="text-sm leading-relaxed space-y-2 py-2">
                {fieldItems.map(({ key, label, value }) => (
                    <div key={key} className="flex items-start justify-between">
                        <div>
                            <span className="font-semibold text-muted-foreground">{label}: </span>
                            <span>{value}</span>
                        </div>
                        <button
                            onClick={() => setActiveField(key)}
                            disabled={loading}
                            className="text-accent hover:underline text-xs ml-2"
                            aria-label={`Edit ${label}`}
                        >
                            +
                        </button>
                    </div>
                ))}
            </div>

            {/* Images with Add Button First */}
            <div className="flex space-x-3 overflow-x-auto mb-4 scrollbar-thin scrollbar-thumb-accent scrollbar-track-card">
                {/* Add Image Button */}
                <button
                    onClick={handleNavigateToImageSelection}
                    disabled={loading}
                    className="flex items-center justify-center w-24 h-24 bg-gray-200 rounded-md hover:bg-gray-300 text-accent cursor-pointer shrink-0"
                    aria-label="Add images"
                >
                    +
                </button>
                {/* Existing Images */}
                {localEvent.images.map((path, idx) => (
                    <div key={idx} className="relative w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                        {/* Trash Button */}
                        <button
                            onClick={() => handleRemoveImage(path)}
                            disabled={loading}
                            className="absolute top-0 right-0 p-2 bg-gray-700 rounded-full text-white hover:bg-gray-800 transition-all duration-200 ease-in-out"
                            aria-label={`Remove ${path}`}
                        >
                            <Trash className="h-5 w-5" />
                        </button>
                        <SecureImage
                            path={`collections/${path}`}
                            alt={`event-img-${idx}`}
                            size={96}
                            className="rounded-md"
                        />
                    </div>
                ))}
            </div>

            {/* Edit Text Field Dialog */}
            {activeField && (
                <EditFieldDialog
                    title={`Edit ${activeField}`}
                    initialValue={localEvent[activeField]}
                    onSubmit={(val) => handleSubmit(activeField, val)}
                    onCancel={() => setActiveField(null)}
                    loading={loading}
                />
            )}

            {/* Edit Date Range Dialog */}
            {editDates && (
                <EditDateRangeDialog
                    initialStartDate={localEvent.eventstart ? new Date(localEvent.eventstart).toISOString().split("T")[0] : ""}
                    initialEndDate={localEvent.eventend ? new Date(localEvent.eventend).toISOString().split("T")[0] : ""}
                    onSubmit={handleDateSubmit}
                    onCancel={() => setEditDates(false)}
                    loading={loading}
                />
            )}
        </div>
    );
};
