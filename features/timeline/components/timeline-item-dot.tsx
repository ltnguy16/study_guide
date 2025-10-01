import React, { useState, useEffect, useRef } from "react";
import { TimelineEvent } from "./timeline-item-data";
import { TimelineItemDialog } from "./timeline-item-dialog";
import { Circle } from "lucide-react";

interface TimelineItemDotProps {
    event: TimelineEvent;
    top: number;
}

export const TimelineItemDot: React.FC<TimelineItemDotProps> = ({ event, top }) => {
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

    const toggleDialog = () => {
        setIsDialogOpen((prev) => !prev);
    };


    return (
        <div
            style={{
                position: "absolute",
                top: `${top}px`,
                left: "0px",
                zIndex: 60,
            }}
            onClick={toggleDialog}
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
                    onClick={toggleDialog}
                >
                    <TimelineItemDialog event={localEvent} onEventUpdate={setLocalEvent} />
                </div>
            )}
        </div>
    );
};
