"use client";

import React, { useEffect, useState } from "react";
import { TimelineEvent } from "./timeline-item-data";
import SecureImage from "@/shared/components/ui/sercure-image";
import { EditDateRangeDialog, EditFieldDialog, formatDate } from "@/shared";
import { UpsertTimelineDates, UpsertTimelineField } from "@/shared/service/upsert/update-timeline-field";
import { FetchEventById } from "../service/fetch/fetch-event-by-id";

interface TimelineItemDialogProps {
    event: TimelineEvent;
}

type FieldKey = keyof Pick<TimelineEvent, "loiview" | "myview" | "sharedview" | "location" | "name">;

export const TimelineItemDialog: React.FC<TimelineItemDialogProps> = ({
    event,
}) => {
    const [activeField, setActiveField] = useState<FieldKey | null>(null);
    const [editDates, setEditDates] = useState(false);
    const [loading, setLoading] = useState(false);
    const [localEvent, setLocalEvent] = useState<TimelineEvent>(event);

    // Only reset localEvent when the prop `event` changes
    useEffect(() => {
        setLocalEvent(event);
    }, [event]);

    // Shared refresh function
    const refreshEvent = async () => {
        const refreshed = await FetchEventById(localEvent.id);
        if (refreshed) setLocalEvent(refreshed);
    };

    // Submit handler for text fields and title
    const handleSubmit = async (field: FieldKey, newValue: TimelineEvent[FieldKey]) => {
        try {
            setLoading(true);
            await UpsertTimelineField(localEvent, field, newValue);
            await refreshEvent();
            setActiveField(null);
        } catch (error) {
            console.error("Failed to update field:", error);
            alert("Failed to update. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Submit handler for dates
    const handleDateSubmit = async (startDate: string, endDate: string) => {
        try {
            setLoading(true);
            await UpsertTimelineDates(localEvent, startDate, endDate);
            await refreshEvent();
            setEditDates(false);
        } catch (error) {
            console.error("Failed to update dates:", error);
            alert("Failed to update dates. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fieldItems: { key: FieldKey; label: string; value: string }[] = [
        { key: "loiview", label: "LoFi's View", value: localEvent.loiview },
        { key: "myview", label: "My's View", value: localEvent.myview },
        { key: "sharedview", label: "Shared View", value: localEvent.sharedview },
        { key: "location", label: "Location", value: localEvent.location },
    ];

    return (
        <div
            className="relative rounded-xl bg-dialog text-dialog-foreground shadow-lg p-6 border border-border space-y-4 w-full max-w-md"
        >
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

            {/* Images */}
            <div className="flex space-x-3 overflow-x-auto mb-4 scrollbar-thin scrollbar-thumb-accent scrollbar-track-card">
                {Array.isArray(localEvent.images) && localEvent.images.length > 0 ? (
                    localEvent.images.map((path, idx) => (
                        <SecureImage
                            key={idx}
                            path={`collections/${path}`}
                            alt={`event-img-${idx}`}
                            size={120}
                        />
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">No images available</p>
                )}
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
                    initialStartDate={
                        localEvent.eventstart
                            ? new Date(localEvent.eventstart).toISOString().split("T")[0]
                            : ""
                    }
                    initialEndDate={
                        localEvent.eventend
                            ? new Date(localEvent.eventend).toISOString().split("T")[0]
                            : ""
                    }
                    onSubmit={handleDateSubmit}
                    onCancel={() => setEditDates(false)}
                    loading={loading}
                />
            )}
        </div>
    );
};
