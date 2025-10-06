"use client";

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Portal } from "react-overlays"; // Needed for custom portal container
import "react-datepicker/dist/react-datepicker.css";

interface EditDateRangeDialogProps {
    initialStartDate: string;
    initialEndDate: string;
    onSubmit: (startDate: string, endDate: string) => void;
    onCancel: () => void;
    loading?: boolean;
}


export const CustomPopperContainer: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const container = typeof document !== "undefined" ? document.getElementById("datepicker-portal-container") : null;

    if (!container || !children) return null;

    return <Portal container={container}>{children as React.ReactElement}</Portal>;
};
export const EditDateRangeDialog: React.FC<EditDateRangeDialogProps> = ({
    initialStartDate,
    initialEndDate,
    onSubmit,
    onCancel,
    loading = false,
}) => {
    const [dates, setDates] = useState<[Date | null, Date | null]>([
        initialStartDate ? new Date(initialStartDate) : null,
        initialEndDate ? new Date(initialEndDate) : null,
    ]);

    useEffect(() => {
        setDates([
            initialStartDate ? new Date(initialStartDate) : null,
            initialEndDate ? new Date(initialEndDate) : null,
        ]);
    }, [initialStartDate, initialEndDate]);

    const handleChange = (range: [Date | null, Date | null]) => {
        setDates(range);
    };

    const handleSubmit = () => {
        const [startDate, endDate] = dates;
        onSubmit(
            startDate ? startDate.toISOString().slice(0, 10) : "",
            endDate ? endDate.toISOString().slice(0, 10) : ""
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div
                className="bg-dialog text-dialog-foreground p-6 rounded-xl w-full max-w-sm shadow-lg space-y-6 border border-border relative"
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-date-range-dialog-title"
            >
                <h2 id="edit-date-range-dialog-title" className="text-lg font-semibold">
                    Edit Date Range
                </h2>

                {/* Portal container div inside dialog */}
                <div id="datepicker-portal-container" style={{ position: "relative", zIndex: 1500 }} />

                <div className="space-y-4">
                    <label className="block font-medium text-sm mb-1">Date Range</label>
                    <DatePicker
                        id="date-range-picker"
                        wrapperClassName="w-full"
                        selectsRange
                        startDate={dates[0]}
                        endDate={dates[1]}
                        onChange={handleChange}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="YYYY-MM-DD"
                        className="w-full rounded-md border px-3 py-2 text-sm bg-input text-foreground dark:bg-background dark:text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition border-input"
                        calendarClassName="!rounded-xl !shadow-lg !border !border-border !bg-background !text-foreground dark:!bg-background dark:!text-foreground"
                        popperClassName="z-50"
                        isClearable
                        showPopperArrow={false}
                        autoComplete="off"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        disabled={loading}
                        withPortal={false}
                        popperContainer={CustomPopperContainer}
                        popperPlacement="bottom-start"
                        popperModifiers={[
                            {
                                name: "preventOverflow",
                                options: {
                                    rootBoundary: "document",
                                    tether: false,
                                    altAxis: true,
                                },
                            },
                            {
                                name: "offset",
                                options: {
                                    offset: [0, 8],
                                },
                            },
                            {
                                name: "flip",
                                options: {
                                    fallbackPlacements: ["top-start", "bottom-start"],
                                },
                            },
                            {
                                name: "computeStyles",
                                options: {
                                    adaptive: false,
                                },
                            },
                        ] as any}
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
                        disabled={loading || !dates[0] || !dates[1]}
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
