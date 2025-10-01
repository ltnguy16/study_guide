import React, { useState, useEffect, useRef } from "react";
import { TimelineEvent } from "./timeline-item-data";
import { TimelineItemDialog } from "./timeline-item-dialog";
import { Circle } from "lucide-react";

interface TimelineItemDotProps {
    event: TimelineEvent;
    top: number;
    onEventUpdate: (updatedEvent: TimelineEvent) => void;
}

export const TimelineItemDot: React.FC<TimelineItemDotProps> = ({ event, top, onEventUpdate }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [position, setPosition] = useState<"above" | "below">("below");
    const [localEvent, setLocalEvent] = useState(event); // Local state for event
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setLocalEvent(event); // Update local event when the event prop changes (sync with parent)
    }, [event]);

    useEffect(() => {
        const checkPosition = () => {
            const dialogHeight = 320;
            const buffer = 20;
            const spaceBelow = window.innerHeight - top;

            if (spaceBelow < dialogHeight + buffer) {
                setPosition("above");
            } else {
                setPosition("below");
            }
        };

        checkPosition();
        window.addEventListener("resize", checkPosition);
        return () => window.removeEventListener("resize", checkPosition);
    }, [top]);

    const handleMouseEnter = () => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null; // Clear the previous timeout
        }
        setIsDialogOpen(true); // Show the dialog when the mouse enters
    };

    const handleMouseLeave = () => {
        // Set a delay before hiding the dialog
        hideTimeoutRef.current = setTimeout(() => {
            setIsDialogOpen(false); // Hide the dialog after the delay
        }, 200); // 200ms delay before hiding
    };

    const handleRemoveImage = (path: string) => {
        const updatedEvent = { ...localEvent };
        updatedEvent.images = updatedEvent.images.filter((img) => img !== path); // Remove image from event
        setLocalEvent(updatedEvent); // Update localEvent state

        console.log("Updated Event after removal:", updatedEvent);  // Debugging the updated event

        // Notify parent to update its state
        onEventUpdate(updatedEvent); // Propagate the update to parent
    };


    return (
        <div
            style={{
                position: "absolute",
                top: `${top}px`,
                left: "0px",
                zIndex: 60,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Dot */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "18px",
                    height: "18px",
                    backgroundColor: "hsl(var(--primary))",
                    borderRadius: "50%",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                }}
            >
                <Circle color="white" size={16} />
            </div>

            {/* Dialog */}
            {isDialogOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: position === "above" ? `-330px` : `30px`,
                        left: "30px",
                        zIndex: 50,
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <TimelineItemDialog event={localEvent} onEventUpdate={setLocalEvent} />
                </div>
            )}
        </div>
    );
};
