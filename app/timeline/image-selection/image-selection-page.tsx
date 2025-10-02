"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CreateBrowserClient } from "@/lib/supabase/client";
import { ImageUpscale } from "lucide-react";
import { FetchEventImages } from "@/features/timeline/service/fetch/fetch-event-images";
import { FetchSignedImageUrl } from "@/shared/service/fetch/fetch-signed-image-url";

export default function ImageSelectionPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const eventId = searchParams.get("eventId");

    const [availableImages, setAvailableImages] = useState<string[]>([]);
    const [totalImages, setTotalImages] = useState(0);
    const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const imagesPerPage = 10;
    const [signedImageUrls, setSignedImageUrls] = useState<Map<string, string>>(new Map());

    useEffect(() => {
        if (!eventId) return;

        const fetchImages = async () => {
            setLoading(true);
            try {
                const { images, totalCount } = await FetchEventImages("collections", currentPage, imagesPerPage);
                setAvailableImages(images);
                setTotalImages(totalCount);
            } catch (error) {
                console.error("Error fetching images:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [eventId, currentPage]);

    const toggleImageSelection = useCallback((imgName: string) => {
        setSelectedImages((prevSelected) => {
            const newSelected = new Set(prevSelected);
            newSelected.has(imgName) ? newSelected.delete(imgName) : newSelected.add(imgName);
            return newSelected;
        });
    }, []);

    const handleNextPage = () => {
        if (currentPage < Math.ceil(totalImages / imagesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const fetchSignedUrls = useCallback(async (selected: Set<string>) => {
        setLoading(true);
        const newUrls = new Map<string, string>();
        for (const imageName of selected) {
            try {
                const url = await FetchSignedImageUrl(imageName, 3600);
                newUrls.set(imageName, url);
            } catch (error) {
                console.error("Error fetching signed URL:", error);
            }
        }
        setSignedImageUrls(newUrls);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (selectedImages.size > 0) {
            fetchSignedUrls(selectedImages);
        }
    }, [selectedImages, fetchSignedUrls]);

    const handleConfirmSelection = async () => {
        if (selectedImages.size === 0) {
            alert("Please select at least one image.");
            return;
        }
        setLoading(true);
        const supabase = CreateBrowserClient();
        try {
            for (const imageName of Array.from(selectedImages)) {
                await supabase.from("galleries").insert({ eventid: eventId, imagepath: imageName });
            }
            router.push("/timeline");
        } catch (error) {
            console.error("Failed to add images", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-8 max-w-7xl mx-auto min-h-screen">
            <h2 className="text-3xl font-semibold text-primary text-center mb-6">
                Select Images for Event
            </h2>

            {loading ? (
                <div className="flex items-center space-x-4 mb-6 text-muted-foreground">
                    <span>Loading images...</span>
                    <div className="w-4 h-4 border-4 border-t-transparent border-primary rounded-full animate-spin" />
                </div>
            ) : (
                <div className="flex flex-col md:flex-row w-full gap-8">
                    {/* Available images */}
                    <div className="w-full md:w-2/3 border border-border rounded-lg p-6 overflow-y-auto max-h-[70vh]">
                        {availableImages.map((imgName) => (
                            <div
                                key={imgName}
                                onClick={() => toggleImageSelection(imgName)}
                                className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition 
                                    ${selectedImages.has(imgName) ? "border-2 border-primary bg-primary/10" : "hover:bg-muted"}`}
                            >
                                <span className="text-sm truncate">{imgName}</span>
                                <button
                                    className={`p-2 rounded focus:outline-none ${selectedImages.has(imgName) ? "text-primary" : "text-accent"}`}
                                    aria-label="Select image"
                                    type="button"
                                >
                                    <ImageUpscale className="h-6 w-6" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Selected Preview */}
                    <div className="w-full md:w-1/3 border border-border rounded-lg p-6 flex flex-col items-center overflow-y-auto max-h-[70vh]">
                        {selectedImages.size > 0 && (
                            <div className="w-full space-y-4">
                                {[...selectedImages].map((imgName) => {
                                    const url = signedImageUrls.get(imgName);
                                    return url ? (
                                        <div key={imgName} className="flex flex-col items-center space-y-2">
                                            <img
                                                src={url}
                                                alt={`Preview of ${imgName}`}
                                                className="max-h-48 object-contain rounded-md shadow"
                                            />
                                            <div className="text-sm text-center truncate">{imgName}</div>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-between w-full border-t border-border pt-4 mt-8">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    type="button"
                    className="bg-secondary text-secondary-foreground px-4 py-2 rounded font-medium disabled:opacity-50 hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                >
                    Previous
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage >= Math.ceil(totalImages / imagesPerPage)}
                    type="button"
                    className="bg-secondary text-secondary-foreground px-4 py-2 rounded font-medium disabled:opacity-50 hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                >
                    Next
                </button>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-3 mt-8 w-full border-t border-border pt-4">
                <button
                    onClick={() => history.back()}
                    disabled={loading}
                    type="button"
                    className="bg-muted text-foreground px-4 py-2 rounded font-medium hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accent disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={handleConfirmSelection}
                    disabled={loading || selectedImages.size === 0}
                    type="button"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accent disabled:opacity-50"
                >
                    Add Selected
                </button>
            </div>
        </div>
    );
}
