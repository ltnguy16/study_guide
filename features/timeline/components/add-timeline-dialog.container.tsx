"use client";

import React, { useEffect, useRef, useState } from "react";
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
    const dialogRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile viewport
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Toggle dialog open/close when button clicked
    const toggleOpen = () => {
        setIsOpen((prev) => !prev);
    };

    // Close dialog when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                isOpen &&
                dialogRef.current &&
                !dialogRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, setIsOpen]);

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
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to add event:", error);
            alert("Failed to add event");
        }
    };

    return (
        <>
            {/* Hide button on mobile if open */}
            {!isOpen || !isMobile ? (
                <button
                    onMouseDown={toggleOpen}
                    aria-label="Toggle add new record dialog"
                    className={`fixed bottom-6 right-6 z-[1200] rounded-full flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 transition
            ${isOpen
                            ? "bg-transparent border-2 border-highlight text-highlight shadow-md hover:bg-highlight hover:text-white w-10 h-10 text-2xl sm:w-14 sm:h-14 sm:text-4xl"
                            : "bg-highlight text-white shadow-lg border-2 border-highlight hover:brightness-90 w-14 h-14 text-4xl"
                        }`}
                    type="button"
                >
                    <span className="leading-none select-none">+</span>
                </button>
            ) : null}

            {isOpen &&
                createPortal(
                    <div ref={dialogRef}>
                        <AddTimelineDialog isOpen={isOpen} onClose={() => setIsOpen(false)} onAdd={handleAdd} />
                    </div>,
                    document.body
                )}
        </>
    );
}

export default AddTimelineDialogContainer;
