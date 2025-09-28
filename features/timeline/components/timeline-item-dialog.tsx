"use client";

import React from "react";
import { Event } from "./timeline-item-data";
import SecureImage from "@/shared/components/ui/sercure-image";
import { formatDate } from "@/shared";

interface TimelineItemDialogProps {
    event: Event;
    top: number;
}

export const TimelineItemDialog: React.FC<TimelineItemDialogProps> = ({ event, top }) => {
    return (
        <div className="relative rounded-xl bg-dialog text-dialog-foreground shadow-lg p-6 border border-border space-y-4 w-full max-w-md">
            <div className="text-xs text-muted-foreground font-semibold tracking-wider uppercase">
                {event.startDate && event.endDate
                    ? `${formatDate(event.startDate)} - ${formatDate(event.endDate)}`
                    : formatDate(event.startDate || event.endDate) || "Date Unknown"}
            </div>

            <div className="text-xl font-semibold text-primary">
                {event.name}
            </div>

            <div className="text-sm leading-relaxed space-y-1 py-2">
                <div>
                    <span className="font-semibold text-muted-foreground">LoFi's View: </span>
                    <span>{event.loiView}</span>
                </div>
                <div>
                    <span className="font-semibold text-muted-foreground">My's View: </span>
                    <span>{event.myView}</span>
                </div>
                <div>
                    <span className="font-semibold text-muted-foreground">Shared View: </span>
                    <span>{event.sharedView}</span>
                </div>
                <div>
                    <span className="font-semibold text-muted-foreground">Location: </span>
                    <span>{event.location}</span>
                </div>
            </div>

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
        </div>

    );
};
