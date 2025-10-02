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

    // Update form data and mark field as touched to show validation
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setTouched({ ...touched, [e.target.name]: true });
    };

    // Check validity for required fields only if touched
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

    // Submit handler with validation
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

        // Reset form and touched state after successful submit
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto shadow-lg border-2 border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-6 text-primary dark:text-primary-foreground">
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
                    placeholder="LoFi's description"
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
                        className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded transition"
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={hasErrors}
                        className={`px-4 py-2 rounded text-white transition ${hasErrors ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
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
            className={`block mb-1 font-medium ${valid ? "text-foreground dark:text-foreground" : "text-destructive"}`}
        >
            {label}
            {required && <span className="text-destructive">*</span>}
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
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition bg-background text-foreground dark:bg-background dark:text-foreground ${valid ? "border-input" : "border-destructive"
                }`}
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
        <label htmlFor={id} className="block mb-1 font-medium text-foreground dark:text-foreground">
            {label}
        </label>
        <textarea
            id={id}
            name={name}
            rows={3}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full border border-input rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition bg-background text-foreground dark:bg-background dark:text-foreground"
        ></textarea>
    </div>
);

export default AddTimelineDialog;
