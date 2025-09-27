import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/shared/components";

export function ErrorForm({ error }: { error?: string }) {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                Sorry, something went wrong.
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {error ? (
                                <p className="text-sm text-muted-foreground">
                                    Code error: {error}
                                </p>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    An unspecified error occurred.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}