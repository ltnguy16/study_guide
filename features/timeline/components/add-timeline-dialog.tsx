import React, { useState } from "react";
import { TimelineEvent } from "./timeline-item-data";

// Define form data type matching TimelineEvent minus 'images' and 'id'
type FormData = {
    name: string;
    eventstart: string; // use string for date input
    eventend: string;
    loiview: string;
    myview: string;
    sharedview: string;
    location: string;
};

type UploadTimelineEvent = Omit<TimelineEvent, 'images' | 'id'>;

interface AddTimelineDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: UploadTimelineEvent) => void | Promise<void>;
}

const AddTimelineDialog: React.FC<AddTimelineDialogProps> = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        eventstart: "",
        eventend: "",
        loiview: "",
        myview: "",
        sharedview: "",
        location: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        // Basic validation
        if (
            !formData.name ||
            !formData.eventstart ||
            !formData.eventend ||
            !formData.location
        ) {
            alert("Please fill in all required fields: Name, Start Date, End Date, Location");
            return;
        }

        // Convert empty date strings to null
        const dataToSend: UploadTimelineEvent = {
            ...formData,
            eventstart: formData.eventstart || null,
            eventend: formData.eventend || null,
        };

        await onAdd(dataToSend);

        // Reset form
        setFormData({
            name: "",
            eventstart: "",
            eventend: "",
            loiview: "",
            myview: "",
            sharedview: "",
            location: "",
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto max-h-full">
            {/* Card container */}
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-lg">
                {/* Header */}
                <h2 className="text-xl font-semibold mb-4">Add New Timeline Event</h2>

                {/* Name */}
                <InputField
                    label="Name"
                    id="name"
                    name="name"
                    placeholder="Event Name"
                    value={formData.name}
                    onChange={handleChange}
                />

                {/* Start Date */}
                <InputField
                    label="Start Date"
                    id="eventstart"
                    name="eventstart"
                    type="date"
                    value={formData.eventstart}
                    onChange={handleChange}
                />

                {/* End Date */}
                <InputField
                    label="End Date"
                    id="eventend"
                    name="eventend"
                    type="date"
                    value={formData.eventend}
                    onChange={handleChange}
                />

                {/* LoFi's View */}
                <TextareaField
                    label="Loi's View"
                    id="loiview"
                    name="loiview"
                    placeholder="LoFi's description"
                    value={formData.loiview}
                    onChange={handleChange}
                />

                {/* My's View */}
                <TextareaField
                    label="My's View"
                    id="myview"
                    name="myview"
                    placeholder="My description"
                    value={formData.myview}
                    onChange={handleChange}
                />

                {/* Shared View */}
                <TextareaField
                    label="Shared View"
                    id="sharedview"
                    name="sharedview"
                    placeholder="Shared description"
                    value={formData.sharedview}
                    onChange={handleChange}
                />

                {/* Location */}
                <InputField
                    label="Location"
                    id="location"
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleChange}
                />

                {/* Buttons */}
                <div className="flex justify-end space-x-3 mt-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

// Reusable Input component
const InputField: React.FC<{
    label: string;
    id: string;
    name: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, id, name, type = "text", placeholder, value, onChange }) => (
    <div className="mb-4">
        <label className="block mb-1 font-medium" htmlFor={id}>
            {label}
        </label>
        <input
            type={type}
            id={id}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>
);

// Reusable Textarea component
const TextareaField: React.FC<{
    label: string;
    id: string;
    name: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({ label, id, name, placeholder, value, onChange }) => (
    <div className="mb-4">
        <label className="block mb-1 font-medium" htmlFor={id}>
            {label}
        </label>
        <textarea
            id={id}
            name={name}
            rows={3}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full border border-gray-300 rounded px-2 py-1 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>
);

export default AddTimelineDialog;