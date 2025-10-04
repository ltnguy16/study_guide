"use client";

import React, { useState, useEffect } from "react";
import { CircleX, Trash, Save, Loader2 } from "lucide-react";
import { ImportantType, Question } from "./question-page-content";
import { DeleteQuestion } from "../services/delete/delete-question";
import { InsertQuestion } from "../services/upsert/insert-question";
import { UpdateQuestion } from "../services/upsert/update-question";

type DialogMode = "insert" | "update";

interface Props {
    open: boolean;
    mode: DialogMode;
    initial?: Question;
    onClose: () => void;
    onSuccess?: () => void;
}

const importantTypes: ImportantType[] = ["Important", "Loi", "My"];

export default function QuestionUpsertDialog({
    open,
    mode,
    initial,
    onClose,
    onSuccess,
}: Props) {
    const [fields, setFields] = useState<Question>({
        id: initial?.id ?? 0,
        question: initial?.question ?? "",
        loi: initial?.loi ?? "",
        my: initial?.my ?? "",
        important: initial?.important,
        category: initial?.category ?? "",
    });

    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initial) {
            setFields({ ...initial });
        } else {
            setFields({
                id: 0,
                question: "",
                loi: "",
                my: "",
                important: undefined,
                category: "",
            });
        }
        setError(null);
    }, [initial, open, mode]);

    // Handles both insert and update accordingly
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!fields.question || !fields.loi || !fields.my) {
            setError("All fields are required.");
            return;
        }

        setLoading(true);
        try {
            if (mode === "insert") {
                const { id, ...toInsert } = fields; // omit id on insert
                await InsertQuestion(toInsert);
            } else {
                if (!fields.id) throw new Error("Missing id for update");
                await UpdateQuestion(fields);
            }

            setLoading(false);
            onSuccess?.();
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to save");
            setLoading(false);
        }
    };

    // Only shown in update mode
    const handleDelete = async () => {
        if (!fields.id) return;
        setDeleteLoading(true);
        setError(null);
        try {
            await DeleteQuestion(fields.id);
            setDeleteLoading(false);
            onSuccess?.();
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to delete");
            setDeleteLoading(false);
        }
    };

    // Field change handler
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Important type selection handler
    const handleImportantChange = (value: ImportantType | "") => {
        setFields((prev) => ({
            ...prev,
            important: value === "" ? undefined : (value as ImportantType),
        }));
    };

    if (!open) return null;

    return (
        // Overlay background matching light/dark theme from CSS variables
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 dark:bg-black/60">
            {/* Dialog container with consistent theme colors and spacing */}
            <div
                className="min-w-[340px] w-full max-w-md bg-dialog text-dialog-foreground border border-border rounded-2xl shadow-2xl px-5 py-6 relative"
                style={{
                    background: "hsl(var(--dialog))",
                    color: "hsl(var(--dialog-foreground))",
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold text-primary">
                        {mode === "update" ? "Edit Question" : "Add Question"}
                    </h2>
                    <button
                        type="button"
                        className="rounded-full p-2 hover:bg-muted/80 text-muted-foreground transition"
                        aria-label="Close dialog"
                        onClick={onClose}
                    >
                        <CircleX size={22} />
                    </button>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-2 text-[13px] p-2 rounded bg-red-100 text-destructive font-medium border border-destructive">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Question */}
                    <div>
                        <label
                            htmlFor="question"
                            className="block text-sm font-semibold mb-1 text-foreground"
                        >
                            Question
                        </label>
                        <textarea
                            id="question"
                            name="question"
                            className="scroll-container w-full rounded-md border border-input px-3 py-2 text-sm bg-input text-foreground dark:bg-background dark:text-foreground
                                focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                            value={fields.question}
                            onChange={handleChange}
                            required
                            rows={2}
                            disabled={loading || deleteLoading}
                        />
                    </div>

                    {/* Loi's answer */}
                    <div>
                        <label
                            htmlFor="loi"
                            className="block text-sm font-semibold mb-1 text-foreground"
                        >
                            Loi’s Answer
                        </label>
                        <textarea
                            id="loi"
                            name="loi"
                            className="scroll-container w-full rounded-md border border-input px-3 py-2 text-sm bg-input text-foreground dark:bg-background dark:text-foreground
                                focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                            value={fields.loi}
                            onChange={handleChange}
                            required
                            rows={2}
                            disabled={loading || deleteLoading}
                        />
                    </div>

                    {/* My's answer */}
                    <div>
                        <label
                            htmlFor="my"
                            className="block text-sm font-semibold mb-1 text-foreground"
                        >
                            My’s Answer
                        </label>
                        <textarea
                            id="my"
                            name="my"
                            className="scroll-container w-full rounded-md border border-input px-3 py-2 text-sm bg-input text-foreground dark:bg-background dark:text-foreground
                                focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                            value={fields.my}
                            onChange={handleChange}
                            required
                            rows={2}
                            disabled={loading || deleteLoading}
                        />
                    </div>

                    {/* Category dropdown */}
                    <div>
                        <label
                            htmlFor="category"
                            className="block text-sm font-semibold mb-1 text-foreground"
                        >
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            className="w-full rounded-md border border-input px-3 py-2 text-sm bg-input text-foreground dark:bg-background dark:text-foreground
                                focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                            value={fields.category ?? ""}
                            onChange={handleChange}
                            disabled={loading || deleteLoading}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Personal/Physique">Personal/Physique</option>
                            <option value="History/Future">History/Future</option>
                            <option value="Relationships">Relationships</option>
                            <option value="Residence">Residence</option>
                            <option value="Health/Medication">Health/Medication</option>
                            <option value="Family & Relatives">Family & Relatives</option>
                            <option value="Career/Education">Career/Education</option>
                            <option value="Hobbies/Interests">Hobbies/Interests</option>
                            <option value="Finances">Finances</option>
                            <option value="Legal/Immigration">Legal/Immigration</option>
                            <option value="Daily Life & Habits">Daily Life & Habits</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Important type dropdown */}
                    <div>
                        <label
                            htmlFor="important"
                            className="block text-sm font-semibold mb-1 text-foreground"
                        >
                            Important
                        </label>
                        <select
                            id="important"
                            name="important"
                            className="w-full rounded-md border border-input px-3 py-2 text-sm bg-input text-foreground dark:bg-background dark:text-foreground
                                focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                            value={fields.important ?? ""}
                            onChange={(e) => handleImportantChange(e.target.value as ImportantType | "")}
                            disabled={loading || deleteLoading}
                        >
                            <option value="">None</option>
                            {importantTypes.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between gap-3 mt-6">
                        {mode === "update" && (
                            <button
                                type="button"
                                className="flex items-center px-3 py-2 text-sm font-semibold bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive transition disabled:opacity-60 disabled:cursor-not-allowed"
                                onClick={handleDelete}
                                disabled={deleteLoading || loading}
                            >
                                {deleteLoading ? (
                                    <Loader2 size={16} className="mr-2 animate-spin" />
                                ) : (
                                    <Trash size={16} className="mr-2" />
                                )}
                                Delete
                            </button>
                        )}
                        <button
                            type="submit"
                            className="ml-auto flex items-center px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-accent transition disabled:opacity-60 disabled:cursor-not-allowed"
                            disabled={loading || deleteLoading}
                        >
                            {loading ? (
                                <Loader2 size={16} className="mr-2 animate-spin" />
                            ) : (
                                <Save size={16} className="mr-2" />
                            )}
                            {mode === "update" ? "Save Changes" : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
