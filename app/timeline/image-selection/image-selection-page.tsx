"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreateBrowserClient } from "@/lib/supabase/client";
import { ImageUpscale } from "lucide-react";
import { FetchEventImages } from "@/features/timeline/service/fetch/fetch-event-images";
import { FetchSignedImageUrl } from "@/shared/service/fetch/fetch-signed-image-url";

export default function ImageSelectionPage() {
    const searchParams = useSearchParams();
    const eventId = searchParams.get("eventId");
    const [availableImages, setAvailableImages] = useState<string[]>([]);
    const [totalImages, setTotalImages] = useState<number>(0);
    const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [imagesPerPage] = useState<number>(10);
    const [signedImageUrls, setSignedImageUrls] = useState<Map<string, string>>(new Map());
    const router = useRouter();

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
            if (newSelected.has(imgName)) {
                newSelected.delete(imgName);
            } else {
                newSelected.add(imgName);
            }
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

    const fetchSignedUrls = useCallback(async (selectedImages: Set<string>) => {
        setLoading(true);
        const newSignedUrls = new Map<string, string>();
        for (const imageName of selectedImages) {
            try {
                const url = await FetchSignedImageUrl(imageName, 3600);
                newSignedUrls.set(imageName, url);
            } catch (error) {
                console.error("Error fetching signed URL:", error);
            }
        }
        setSignedImageUrls(newSignedUrls);
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
        } catch (error) {
            console.error("Failed to add images", error);
        } finally {
            setLoading(false);
            router.push("/timeline");
        }
    };

    return (
        <div className="flex flex-col items-center p-8 max-w-7xl mx-auto min-h-screen">
            {/* Heading */}
            <h2 className="text-3xl font-semibold text-center mb-6">Select Images for Event</h2>

            {loading ? (
                <div className="flex items-center space-x-4 mb-6">
                    <span>Loading images...</span>
                    <div className="w-4 h-4 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="flex flex-col md:flex-row w-full gap-8">
                    {/* Left Column - Image List */}
                    <div className="w-full md:w-2/3 border border-border rounded-lg p-6 overflow-y-auto max-h-[70vh]">
                        {availableImages.map((imgName) => (
                            <div
                                key={imgName}
                                className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${selectedImages.has(imgName) ? "border-2 border-primary bg-primary/10" : ""
                                    }`}
                                onClick={() => toggleImageSelection(imgName)}
                            >
                                <span className="text-sm truncate">{imgName}</span>
                                <button
                                    className={`p-2 ${selectedImages.has(imgName) ? "text-primary" : "text-accent"}`}
                                    aria-label="Select image"
                                >
                                    <ImageUpscale className="h-6 w-6" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Right Column - Preview */}
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
                                                className="max-h-48 object-contain rounded-md"
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
                    className="btn btn-secondary w-full sm:w-auto"
                >
                    Previous
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage >= Math.ceil(totalImages / imagesPerPage)}
                    className="btn btn-secondary w-full sm:w-auto"
                >
                    Next
                </button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-8 w-full border-t border-border pt-4">
                <button
                    onClick={() => history.back()}
                    disabled={loading}
                    className="btn btn-secondary w-full sm:w-auto"
                >
                    Cancel
                </button>
                <button
                    onClick={handleConfirmSelection}
                    disabled={loading || selectedImages.size === 0}
                    className="btn btn-primary w-full sm:w-auto"
                >
                    Add Selected
                </button>
            </div>
        </div>
    );
}