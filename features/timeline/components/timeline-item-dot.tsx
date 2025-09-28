"use client";

import React, { useState } from "react";
import { TimelineEvent } from "./timeline-item-data";
import { TimelineItemDialog } from "./timeline-item-dialog";
import { Circle } from "lucide-react";  // Importing Lucide's circle icon

interface TimelineItemDotProps {
    event: TimelineEvent;
    top: number;
}

export const TimelineItemDot: React.FC<TimelineItemDotProps> = ({ event, top }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div
            style={{
                position: "absolute",
                top: `${top}px`,
                left: "0px",
                zIndex: 60,  // Make sure the icon doesn't overlap with dialog
            }}
            onMouseEnter={() => setIsDialogOpen(true)}
            onMouseLeave={() => setIsDialogOpen(false)}
        >
            {/* Replace the dot with the Lucide icon */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "18px",  // Size of the icon
                    height: "18px", // Size of the icon
                    backgroundColor: "hsl(var(--primary))",  // Background color of the icon
                    borderRadius: "50%", // Rounded circle around the icon
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                }}
            >
                <Circle color="white" size={16} />  {/* Lucide icon with color and size */}
            </div>

            {/* Dialog */}
            {isDialogOpen && (
                <div
                    style={{
                        zIndex: 50,  // Ensure dialog is beneath the icon
                    }}
                >
                    <TimelineItemDialog event={event} top={top + 30} /> {/* Adjust top to avoid overlap */}
                </div>
            )}
        </div>
    );
};
