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
                            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                            aria-label="Start date"
                        />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium">End Date</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                            aria-label="End date"
                        />
                    </label>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-md bg-muted text-muted-foreground px-4 py-2 hover:opacity-80 transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-muted"
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="rounded-md bg-primary text-primary-foreground px-4 py-2 hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                        type="button"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};
