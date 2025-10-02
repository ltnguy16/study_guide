import React, { useState, useEffect, useRef } from "react";
import { TimelineEvent } from "./timeline-item-data";
import { TimelineItemDialog } from "./timeline-item-dialog";
import { Circle } from "lucide-react";
import { TimelineDialogPortal } from "./timeline-dialog-portal";

interface TimelineItemDotProps {
    event: TimelineEvent;
    top: number;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onEventUpdate: (event: TimelineEvent) => void;
    onEventDelete: (id: number) => void;
}

export const TimelineItemDot: React.FC<TimelineItemDotProps> = ({
    event,
    top,
    isOpen,
    onOpen,
    onClose,
    onEventUpdate,
    onEventDelete,
}) => {
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
    const dotRef = useRef<HTMLDivElement>(null);

    const updatePosition = () => {
        if (dotRef.current) {
            const rect = dotRef.current.getBoundingClientRect();
            setPosition({
                top: rect.top + rect.height / 2,
                left: rect.right + 8,
            });
        }
    };

    useEffect(() => {
        if (isOpen) {
            updatePosition();

            window.addEventListener("scroll", updatePosition);
            window.addEventListener("resize", updatePosition);

            return () => {
                window.removeEventListener("scroll", updatePosition);
                window.removeEventListener("resize", updatePosition);
            };
        } else {
            setPosition(null);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                isOpen &&
                dotRef.current &&
                !dotRef.current.contains(e.target as Node) &&
                !(document.getElementById("timeline-dialog")?.contains(e.target as Node))
            ) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    const toggle = () => {
        if (isOpen) {
            onClose();
        } else {
            updatePosition();
            onOpen();
        }
    };

    return (
        <div
            style={{
                position: "absolute",
                top: `${top}px`,
                left: "0px",
                zIndex: 60,
                transform: "translateY(-50%)",
            }}
        >
            <div
                ref={dotRef}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "18px",
                    height: "18px",
                    backgroundColor: "hsl(var(--accent))", // using dark red accent variable
                    borderRadius: "50%",
                    boxShadow: "0 0 8px hsl(var(--accent))", // subtle glow
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                }}
                onClick={toggle}
                aria-label="Toggle timeline event details"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") toggle();
                }}
            >
                {/* Circle icon with foreground accent color */}
                <Circle color="hsl(var(--accent-foreground))" size={16} />
            </div>

            {isOpen && position && (
                <TimelineDialogPortal>
                    <div
                        id="timeline-dialog"
                        style={{
                            position: "fixed",
                            top: position.top,
                            left: position.left,
                            transform: "translate(0, -50%)",
                            zIndex: 100,
                            backgroundColor: "hsl(var(--dialog))",
                            color: "hsl(var(--dialog-foreground))",
                            borderRadius: "8px",
                            padding: "24px 24px 24px 10px",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                            maxWidth: `calc(100vw - ${position.left + 24}px)`,
                            minWidth: "250px",
                            overflowX: "auto",
                            maxHeight: "90vh",
                        }}
                    >
                        <TimelineItemDialog
                            event={event}
                            onEventUpdate={onEventUpdate}
                            onEventDelete={onEventDelete}
                        />
                    </div>
                </TimelineDialogPortal>
            )}
        </div>
    );
};
