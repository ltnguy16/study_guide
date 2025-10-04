import React, { useState } from "react";
import { TimelineEvent } from "./timeline-item-data";

type FormData = {
    name: string;
    eventstart: string;
    eventend: string;
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
        eventstart: "",
        eventend: "",
        loiview: "",
        myview: "",
        sharedview: "",
        location: "",
    });

    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Update form data and mark field as touched
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setTouched({ ...touched, [e.target.name]: true });
    };

    // Validate required fields if touched
    const isFieldValid = (field: string) => {
        if (!touched[field]) return true;
        if (
            field === "name" ||
            field === "eventstart" ||
            field === "eventend" ||
            field === "location"
        ) {
            return formData[field as keyof FormData].trim() !== "";
        }
        return true;
    };

    const hasErrors =
        !formData.name.trim() ||
        !formData.eventstart.trim() ||
        !formData.eventend.trim() ||
        !formData.location.trim();

    const handleSubmit = async () => {
        if (hasErrors) {
            alert(
                "Please fill in all required fields: Name, Start Date, End Date, Location"
            );
            return;
        }

        const dataToSend: UploadTimelineEvent = {
            ...formData,
            eventstart: formData.eventstart || null,
            eventend: formData.eventend || null,
        };

        await onAdd(dataToSend);

        // Reset form and touched state after submit
        setFormData({
            name: "",
            eventstart: "",
            eventend: "",
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
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 dark:bg-black/60"
        /* Changed overlay opacity and color for consistency */
        >
            <div
                className="scroll-container bg-dialog text-dialog-foreground border border-border rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] shadow-2xl"
            >
                <h2 className="text-xl font-semibold mb-6 text-primary">
                    Add New Timeline Event
                </h2>

                {/* Form fields */}
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

                <InputField
                    label="Start Date"
                    id="eventstart"
                    name="eventstart"
                    type="date"
                    value={formData.eventstart}
                    onChange={handleChange}
                    required
                    valid={isFieldValid("eventstart")}
                />

                <InputField
                    label="End Date"
                    id="eventend"
                    name="eventend"
                    type="date"
                    value={formData.eventend}
                    onChange={handleChange}
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

                {/* Button group */}
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
        <label
            htmlFor={id}
            className={`block mb-1 font-semibold ${valid ? "text-foreground dark:text-foreground" : "text-destructive"
                }`}
        >
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
            className={`w-full rounded-md border px-3 py-2 text-sm bg-input focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition ${valid ? "border-input" : "border-destructive"
                } text-foreground dark:bg-background dark:text-foreground`}
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
            className="w-full rounded-md border border-input px-3 py-2 text-sm bg-input text-foreground dark:bg-background dark:text-foreground
                                focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
        />
    </div>
);

export default AddTimelineDialog;
