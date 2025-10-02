import React from "react";

export function ErrorForm({ error }: { error?: string }) {
    return (
        <div
            className="flex min-h-screen w-full items-center justify-center p-6 md:p-10"
            style={{
                backgroundColor: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
            }}
        >
            <div className="w-full max-w-sm rounded-2xl shadow-xl p-6"
                style={{
                    backgroundColor: "hsl(var(--dialog))",
                    color: "hsl(var(--dialog-foreground))",
                    boxSizing: "border-box",
                }}
            >
                <h2 className="text-2xl text-primary mb-4">Sorry, something went wrong.</h2>
                {error ? (
                    <p className="text-sm text-muted-foreground">Code error: {error}</p>
                ) : (
                    <p className="text-sm text-muted-foreground">An unspecified error occurred.</p>
                )}
            </div>
        </div>
    );
}
