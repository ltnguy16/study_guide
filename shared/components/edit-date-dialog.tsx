import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
    const [startDate, setStartDate] = useState<Date | null>(
        initialStartDate ? new Date(initialStartDate) : null
    );
    const [endDate, setEndDate] = useState<Date | null>(
        initialEndDate ? new Date(initialEndDate) : null
    );

    useEffect(() => {
        setStartDate(initialStartDate ? new Date(initialStartDate) : null);
        setEndDate(initialEndDate ? new Date(initialEndDate) : null);
    }, [initialStartDate, initialEndDate]);

    const handleSubmit = () => {
        onSubmit(
            startDate ? startDate.toISOString().slice(0, 10) : "",
            endDate ? endDate.toISOString().slice(0, 10) : ""
        );
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
                    <label htmlFor="start-date" className="block font-medium text-sm mb-1">
                        Start Date
                    </label>
                    <DatePicker
                        id="start-date"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="YYYY-MM-DD"
                        className="w-full rounded-md border px-3 py-2 text-sm bg-input text-foreground dark:bg-background dark:text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition border-input"
                        disabled={loading}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                    />

                    <label htmlFor="end-date" className="block font-medium text-sm mb-1">
                        End Date
                    </label>
                    <DatePicker
                        id="end-date"
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate ?? undefined} // make sure end date >= start date
                        dateFormat="yyyy-MM-dd"
                        placeholderText="YYYY-MM-DD"
                        className="w-full rounded-md border px-3 py-2 text-sm bg-input text-foreground dark:bg-background dark:text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition border-input"
                        disabled={loading}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                    />
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
                        disabled={loading || !startDate || !endDate}
                        className="flex items-center px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-accent transition disabled:opacity-60 disabled:cursor-not-allowed"
                        type="button"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};
