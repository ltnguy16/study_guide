import { createPortal } from "react-dom";
import React from "react";

interface TimelineDialogPortalProps {
    children: React.ReactNode;
}

export const TimelineDialogPortal: React.FC<TimelineDialogPortalProps> = ({ children }) => {
    return createPortal(children, document.body);
};
