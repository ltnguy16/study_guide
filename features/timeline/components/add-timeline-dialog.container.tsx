"use client";

import React from "react";
import { createPortal } from "react-dom";
import AddTimelineDialog from "./add-timeline-dialog";
import { TimelineEvent } from "./timeline-item-data";
import { UpsertTimeline } from "../service/upsert/upsert-event";

interface AddTimelineDialogContainerProps {
    onAdd: (newEvent: TimelineEvent) => Promise<void>;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type UploadTimelineEvent = Omit<TimelineEvent, "images" | "id">;

function AddTimelineDialogContainer({
    onAdd,
    isOpen,
    setIsOpen,
}: AddTimelineDialogContainerProps) {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    const handleAdd = async (data: UploadTimelineEvent) => {
        const newEvent: TimelineEvent = {
            id: 0,
            name: data.name,
            eventstart: data.eventstart,
            eventend: data.eventend,
            loiview: data.loiview,
            myview: data.myview,
            sharedview: data.sharedview,
            location: data.location,
            images: [],
        };

        try {
            await UpsertTimeline(newEvent);
            await onAdd(newEvent);
            handleClose();
        } catch (error) {
            console.error("Failed to add event:", error);
            alert("Failed to add event");
        }
    };

    return (
        <>
            <button
                onClick={handleOpen}
                aria-label="Add new record"
                style={{
                    position: "fixed",
                    bottom: "24px",
                    right: "24px",
                    zIndex: 1200,
                    width: "60px",
                    height: "60px",
                    backgroundColor: "hsl(var(--highlight))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                    cursor: "pointer",
                }}
            >
                <span style={{ fontSize: "24px", color: "white" }}>+</span>
            </button>

            {isOpen &&
                createPortal(
                    <AddTimelineDialog isOpen={isOpen} onClose={handleClose} onAdd={handleAdd} />,
                    document.body
                )}
        </>
    );
}

export default AddTimelineDialogContainer;
