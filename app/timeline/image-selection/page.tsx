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

    // Fetch images based on eventId
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

    // Handle image selection toggle
    const toggleImageSelection = useCallback((imgName: string) => {
        setSelectedImages((prevSelectedImages) => {
            const newSelectedImages = new Set(prevSelectedImages);
            if (newSelectedImages.has(imgName)) {
                newSelectedImages.delete(imgName);
            } else {
                newSelectedImages.add(imgName);
            }
            return newSelectedImages;
        });
    }, []);

    // Handle next and previous page buttons
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

    // Fetch signed URLs for selected images
    const fetchSignedUrls = useCallback(async (selectedImages: Set<string>) => {
        setLoading(true);
        const newSignedUrls = new Map<string, string>();
        for (const imageName of selectedImages) {
            try {
                const url = await FetchSignedImageUrl(imageName, 3600); // URL valid for 1 hour
                newSignedUrls.set(imageName, url);
            } catch (error) {
                console.error("Error fetching signed URL:", error);
            }
        }
        setSignedImageUrls(newSignedUrls);
        setLoading(false);
    }, []);

    // Re-fetch signed URLs when the selected images change
    useEffect(() => {
        if (selectedImages.size > 0) {
            fetchSignedUrls(selectedImages);
        }
    }, [selectedImages, fetchSignedUrls]);

    // Confirm image selection and add to gallery
    const handleConfirmSelection = async () => {
        if (selectedImages.size === 0) {
            alert("Please select at least one image.");
            return;
        }
        setLoading(true);
        const supabase = CreateBrowserClient();
        try {
            const selectedImagesArray = Array.from(selectedImages);
            for (const imageName of selectedImagesArray) {
                await supabase.from("galleries").insert({
                    eventid: eventId,
                    imagepath: imageName,
                });
            }
        } catch (error) {
            console.error("Failed to add images", error);
        } finally {
            setLoading(false);
            // Navigate only after everything is finished
            router.push("/timeline");
        }
    };

    return (
        <div className="flex flex-col items-center p-4 space-y-4 max-w-screen-sm mx-auto min-h-screen">
            <h2 className="text-2xl font-semibold text-center">Select Images for Event</h2>

            {loading ? (
                <div className="flex flex-col sm:flex-row w-full items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <span>Loading images...</span>
                    <div className="w-4 h-4 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="flex flex-col sm:flex-row w-full space-y-4 sm:space-y-0 sm:space-x-6 flex-1">
                    {/* Left Column - Image Names with Selection */}
                    <div className="w-full sm:w-2/3 border border-border rounded-lg p-4 overflow-y-auto max-h-[70vh] flex-shrink-0">
                        {availableImages.map((imgName) => (
                            <div
                                key={imgName}
                                className={`flex items-center space-x-4 p-3 rounded-md cursor-pointer ${selectedImages.has(imgName) ? "border-2 border-primary bg-primary/10" : ""
                                    }`}
                                onClick={() => toggleImageSelection(imgName)}
                            >
                                <span className="flex-1 text-sm text-ellipsis overflow-hidden">{imgName}</span>
                                <button
                                    className={`p-2 ${selectedImages.has(imgName) ? 'text-primary' : 'text-accent'}`}
                                    aria-label="Select image"
                                >
                                    <ImageUpscale className="h-6 w-6" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Right Column - Image Preview */}
                    <div className="w-full sm:w-1/3 border border-border rounded-lg p-4 flex flex-col items-center overflow-y-auto max-h-[70vh] flex-shrink-0">
                        {selectedImages.size > 0 && (
                            <div className="space-y-4 w-full">
                                {[...selectedImages].map((imgName) => {
                                    const imageUrl = signedImageUrls.get(imgName);
                                    return imageUrl ? (
                                        <div key={imgName} className="flex flex-col items-center space-y-2">
                                            <img
                                                src={imageUrl}
                                                alt={`Preview of ${imgName}`}
                                                className="max-h-[200px] object-contain rounded-md"
                                            />
                                            <span className="text-sm text-center">{imgName}</span>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Pagination controls */}
            <div className="flex justify-between w-full border-t border-border pt-4 mt-4">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="btn btn-secondary w-full sm:w-auto"
                >
                    Previous
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === Math.ceil(totalImages / imagesPerPage)}
                    className="btn btn-secondary w-full sm:w-auto"
                >
                    Next
                </button>
            </div>

            {/* Confirm buttons */}
            <div className="flex justify-end space-x-3 mt-4 border-t border-border pt-4 w-full">
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
