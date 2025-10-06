import React, { useState } from "react";
import { TimelineEvent } from "./timeline-item-data";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type FormData = {
    name: string;
    eventstart: Date | null;
    eventend: Date | null;
    loiview: string;
    myview: string;
    sharedview: string;
    location: string;
};

type UploadTimelineEvent = Omit<TimelineEvent, "images" | "id">;

interface AddTimelineDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: UploadTimelineEvent) => void | Promise<void>;
}

const AddTimelineDialog: React.FC<AddTimelineDialogProps> = ({
    isOpen,
    onClose,
    onAdd,
}) => {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        eventstart: null,
        eventend: null,
        loiview: "",
        myview: "",
        sharedview: "",
        location: "",
    });

    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // For string fields
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setTouched({ ...touched, [e.target.name]: true });
    };

    // For DatePicker
    const handleDateChange = (field: "eventstart" | "eventend", date: Date | null) => {
        setFormData({ ...formData, [field]: date });
        setTouched({ ...touched, [field]: true });
    };

    const isFieldValid = (field: string) => {
        if (!touched[field]) return true;
        if (field === "name" || field === "location") {
            const value = formData[field as "name" | "location"];
            return value.trim() !== "";
        }
        if (field === "eventstart" || field === "eventend") {
            return formData[field as "eventstart" | "eventend"] !== null;
        }
        return true;
    };


    const hasErrors =
        !formData.name.trim() ||
        !formData.eventstart ||
        !formData.eventend ||
        !formData.location.trim();

    const handleSubmit = async () => {
        if (hasErrors) {
            alert("Please fill in all required fields: Name, Start Date, End Date, Location");
            return;
        }
        const dataToSend: UploadTimelineEvent = {
            ...formData,
            eventstart: formData.eventstart?.toISOString().slice(0, 10) || null,
            eventend: formData.eventend?.toISOString().slice(0, 10) || null,
        };
        await onAdd(dataToSend);
        setFormData({
            name: "",
            eventstart: null,
            eventend: null,
            loiview: "",
            myview: "",
            sharedview: "",
            location: "",
        });
        setTouched({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 dark:bg-black/60">
            <div className="scroll-container bg-dialog text-dialog-foreground border border-border rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] shadow-2xl">
                <h2 className="text-xl font-semibold mb-6 text-primary">
                    Add New Timeline Event
                </h2>
                <InputField
                    label="Name"
                    id="name"
                    name="name"
                    placeholder="Event Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    valid={isFieldValid("name")}
                />
                {/* Start Date */}
                <DateField
                    label="Start Date"
                    id="eventstart"
                    selected={formData.eventstart}
                    onChange={date => handleDateChange("eventstart", date)}
                    required
                    valid={isFieldValid("eventstart")}
                />
                {/* End Date */}
                <DateField
                    label="End Date"
                    id="eventend"
                    selected={formData.eventend}
                    onChange={date => handleDateChange("eventend", date)}
                    required
                    valid={isFieldValid("eventend")}
                />
                <TextareaField
                    label="Loi's View"
                    id="loiview"
                    name="loiview"
                    placeholder="Loi's description"
                    value={formData.loiview}
                    onChange={handleChange}
                />
                <TextareaField
                    label="My's View"
                    id="myview"
                    name="myview"
                    placeholder="My description"
                    value={formData.myview}
                    onChange={handleChange}
                />
                <TextareaField
                    label="Shared View"
                    id="sharedview"
                    name="sharedview"
                    placeholder="Shared description"
                    value={formData.sharedview}
                    onChange={handleChange}
                />
                <InputField
                    label="Location"
                    id="location"
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    valid={isFieldValid("location")}
                />
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex items-center px-3 py-2 text-sm font-semibold bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive transition disabled:opacity-60 disabled:cursor-not-allowed"
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={hasErrors}
                        className="ml-auto flex items-center px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-accent transition disabled:opacity-60 disabled:cursor-not-allowed"
                        type="button"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

const InputField: React.FC<{
    label: string;
    id: string;
    name: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    valid?: boolean;
}> = ({ label, id, name, type = "text", placeholder, value, onChange, required, valid = true }) => (
    <div className="mb-5">
        <label htmlFor={id} className={`block mb-1 font-semibold ${valid ? "text-foreground dark:text-foreground" : "text-destructive"}`}>
            {label} {required && <span className="text-destructive">*</span>}
        </label>
        <input
            type={type}
            id={id}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            aria-invalid={!valid}
            aria-required={required}
            className={`w-full rounded-md border px-3 py-2 text-sm bg-input focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition ${valid ? "border-input" : "border-destructive"} text-foreground dark:bg-background dark:text-foreground`}
        />
    </div>
);

// Standalone field for DatePicker-formatted fields
const DateField: React.FC<{
    label: string;
    id: string;
    selected: Date | null;
    onChange: (date: Date | null) => void;
    required?: boolean;
    valid?: boolean;
}> = ({ label, id, selected, onChange, required, valid = true }) => (
    <div className="mb-5">
        <label
            htmlFor={id}
            className={`block mb-1 font-semibold ${valid ? "text-foreground dark:text-foreground" : "text-destructive"
                }`}
        >
            {label} {required && <span className="text-destructive">*</span>}
        </label>
        <DatePicker
            id={id}
            selected={selected}
            onChange={onChange}
            dateFormat="yyyy-MM-dd"
            placeholderText="YYYY-MM-DD"
            className={`w-full rounded-md border px-3 py-2 text-sm bg-input text-foreground dark:bg-background dark:text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition ${valid ? "border-input" : "border-destructive"
                }`}
            calendarClassName="!rounded-xl !border !border-border !bg-background !text-foreground dark:!bg-background dark:!text-foreground"
            popperClassName="z-50"
            isClearable
            showPopperArrow={false}
            withPortal
            autoComplete="off"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
        />
    </div>
);

const TextareaField: React.FC<{
    label: string;
    id: string;
    name: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({ label, id, name, placeholder, value, onChange }) => (
    <div className="mb-5">
        <label htmlFor={id} className="block mb-1 font-semibold text-foreground dark:text-foreground">
            {label}
        </label>
        <textarea
            id={id}
            name={name}
            rows={3}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full rounded-md border border-input px-3 py-2 text-sm bg-input text-foreground dark:bg-background dark:text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
        />
    </div>
);

export default AddTimelineDialog;
