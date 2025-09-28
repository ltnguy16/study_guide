"use client";

import React, { useState } from "react";

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
    loading,
}) => {
    const [value, setValue] = useState(initialValue);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-dialog text-dialog-foreground p-6 rounded-xl w-full max-w-sm shadow-lg space-y-4 border border-border">
                <h2 className="text-lg font-semibold">{title}</h2>

                <textarea
                    className="w-full p-2 rounded-md border border-border bg-background text-foreground"
                    rows={4}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-3 py-1 rounded-md bg-muted text-muted-foreground hover:opacity-80"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSubmit(value)}
                        disabled={loading}
                        className="px-3 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};
