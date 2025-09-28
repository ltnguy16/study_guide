"use client";

import React, { useState } from "react";

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
    loading,
}) => {
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-dialog text-dialog-foreground p-6 rounded-xl w-full max-w-sm shadow-lg space-y-4 border border-border">
                <h2 className="text-lg font-semibold">Edit Date Range</h2>

                <div className="space-y-2">
                    <label className="block text-sm">
                        Start Date
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2 mt-1 rounded-md border border-border bg-background text-foreground"
                        />
                    </label>

                    <label className="block text-sm">
                        End Date
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2 mt-1 rounded-md border border-border bg-background text-foreground"
                        />
                    </label>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-3 py-1 rounded-md bg-muted text-muted-foreground hover:opacity-80"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSubmit(startDate, endDate)}
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
