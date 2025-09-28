"use client";

import React, { useState } from "react";
import { TimelineEvent } from "./timeline-item-data";
import SecureImage from "@/shared/components/ui/sercure-image";
import { EditDateRangeDialog, EditFieldDialog, formatDate } from "@/shared";
import { UpsertTimelineDates, UpsertTimelineField } from "@/shared/service/upsert/update-timeline-field";

interface TimelineItemDialogProps {
    event: TimelineEvent;
    top: number;
}

type FieldKey = keyof Pick<TimelineEvent, "loiview" | "myview" | "sharedview" | "location" | "name">;

export const TimelineItemDialog: React.FC<TimelineItemDialogProps> = ({
    event,
    top,
}) => {
    const [activeField, setActiveField] = useState<FieldKey | null>(null);
    const [editDates, setEditDates] = useState(false);
    const [loading, setLoading] = useState(false);

    // Submit handler for text fields and title
    const handleSubmit = async (field: FieldKey, newValue: TimelineEvent[FieldKey]) => {
        try {
            setLoading(true);
            await UpsertTimelineField(event, field, newValue);
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
            await UpsertTimelineDates(event, startDate, endDate);
            setEditDates(false);
            // Ideally, refresh event data here or use optimistic UI update
        } catch (error) {
            console.error("Failed to update dates:", error);
            alert("Failed to update dates. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fieldItems: { key: FieldKey; label: string; value: string }[] = [
        { key: "loiview", label: "LoFi's View", value: event.loiview },
        { key: "myview", label: "My's View", value: event.myview },
        { key: "sharedview", label: "Shared View", value: event.sharedview },
        { key: "location", label: "Location", value: event.location },
    ];

    return (
        <div
            className="relative rounded-xl bg-dialog text-dialog-foreground shadow-lg p-6 border border-border space-y-4 w-full max-w-md"
            style={{ top }}
        >
            {/* Date Range */}
            <div className="flex items-start justify-between text-xs text-muted-foreground font-semibold tracking-wider uppercase">
                <span>
                    {event.eventstart && event.eventend
                        ? `${formatDate(event.eventstart)} - ${formatDate(event.eventend)}`
                        : formatDate(event.eventstart || event.eventend) || "Date Unknown"}
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
                <span>{event.name}</span>
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
                {event.images.map((path, idx) => (
                    <SecureImage
                        key={idx}
                        path={`collections/${path}`}
                        alt={`event-img-${idx}`}
                        size={120}
                    />
                ))}
            </div>

            {/* Edit Text Field Dialog */}
            {activeField && (
                <EditFieldDialog
                    title={`Edit ${activeField}`}
                    initialValue={event[activeField]}
                    onSubmit={(val) => handleSubmit(activeField, val)}
                    onCancel={() => setActiveField(null)}
                    loading={loading}
                />
            )}

            {/* Edit Date Range Dialog */}
            {editDates && (
                <EditDateRangeDialog
                    initialStartDate={
                        event.eventstart
                            ? new Date(event.eventstart).toISOString().split("T")[0]
                            : ""
                    }
                    initialEndDate={
                        event.eventend ? new Date(event.eventend).toISOString().split("T")[0] : ""
                    }
                    onSubmit={handleDateSubmit}
                    onCancel={() => setEditDates(false)}
                    loading={loading}
                />
            )}
        </div>
    );
};
