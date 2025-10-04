"use client";

import React, { useState, useEffect } from "react";

interface EditDateRangeDialogProps {
    initialStartDate: string;
    initialEndDate: string;
    onSubmit: (startDate: string, endDate: string) => void;
    onCancel: () => void;
    loading?: boolean;
}

export const EditDateRangeDialog: React.FC<EditDateRangeDialogProps> = ({
    initialStartDate,
    initialEndDate,
    onSubmit,
    onCancel,
    loading = false,
}) => {
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);

    // Reset dates if props change (optional)
    useEffect(() => {
        setStartDate(initialStartDate);
        setEndDate(initialEndDate);
    }, [initialStartDate, initialEndDate]);

    const handleSubmit = () => {
        onSubmit(startDate, endDate);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div
                className="bg-dialog text-dialog-foreground p-6 rounded-xl w-full max-w-sm shadow-lg space-y-6 border border-border"
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-date-range-dialog-title"
            >
                <h2
                    id="edit-date-range-dialog-title"
                    className="text-lg font-semibold"
                >
                    Edit Date Range
                </h2>

                <div className="space-y-4">
                    <label className="block">
                        <span className="text-sm font-medium">Start Date</span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full rounded-md border border-input px-3 py-2 text-sm bg-input text-foreground dark:bg-background dark:text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                            aria-label="Start date"
                        />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium">End Date</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full rounded-md border border-input px-3 py-2 text-sm bg-input text-foreground dark:bg-background dark:text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                            aria-label="End date"
                        />
                    </label>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex items-center px-3 py-2 text-sm font-semibold bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive transition disabled:opacity-60 disabled:cursor-not-allowed"
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
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
