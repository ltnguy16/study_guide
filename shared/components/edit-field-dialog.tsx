"use client";

import React, { useState, useEffect, useRef } from "react";

interface EditFieldDialogProps {
    title: string;
    initialValue: string;
    onSubmit: (newValue: string) => void;
    onCancel: () => void;
    loading?: boolean;
}

export const EditFieldDialog: React.FC<EditFieldDialogProps> = ({
    title,
    initialValue,
    onSubmit,
    onCancel,
    loading = false,
}) => {
    const [value, setValue] = useState(initialValue);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Focus textarea when dialog opens
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.selectionStart = textareaRef.current.value.length; // place caret at end
        }
    }, []);

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-field-dialog-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm scroll-container"
        >
            <div className="bg-dialog text-dialog-foreground p-6 rounded-xl w-full max-w-sm shadow-lg space-y-6 border border-border">
                <h2 id="edit-field-dialog-title" className="text-lg font-semibold">
                    {title}
                </h2>

                <label htmlFor="edit-field-textarea" className="sr-only">
                    {title}
                </label>
                <textarea
                    id="edit-field-textarea"
                    ref={textareaRef}
                    rows={4}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm bg-input text-foreground dark:bg-background dark:text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                    aria-label={title}
                />

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex items-center px-3 py-2 text-sm font-semibold bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive transition disabled:opacity-60 disabled:cursor-not-allowed"
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSubmit(value)}
                        disabled={loading}
                        className="ml-auto flex items-center px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-accent transition disabled:opacity-60 disabled:cursor-not-allowed"
                        type="button"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};
