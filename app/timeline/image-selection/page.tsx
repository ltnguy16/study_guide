"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Get query params from URL
import { CreateBrowserClient } from "@/lib/supabase/client"; // Supabase client to interact with the database
import { ImageUpscale } from "lucide-react"; // Magnifying glass icon
import { FetchEventImages } from "@/features/timeline/service/fetch/fetch-event-images"; // Fetch function for event images
import { FetchSignedImageUrl } from "@/shared/service/fetch/fetch-signed-image-url"; // Function to fetch signed URL for images

export default function ImageSelectionPage() {
    const searchParams = useSearchParams();
    const eventId = searchParams.get("eventId");

    const [availableImages, setAvailableImages] = useState<string[]>([]);
    const [totalImages, setTotalImages] = useState<number>(0);
    const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [imagesPerPage] = useState<number>(10);

    const [signedImageUrls, setSignedImageUrls] = useState<Map<string, string>>(new Map()); // Store the signed URLs for selected images

    // Fetch the images when the component is mounted or the page or eventId changes
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
    const toggleImageSelection = (imgName: string) => {
        const newSet = new Set(selectedImages);
        if (newSet.has(imgName)) {
            newSet.delete(imgName);
        } else {
            newSet.add(imgName);
        }
        setSelectedImages(newSet);
    };

    // Handle next page button click
    const handleNextPage = () => {
        if (currentPage < Math.ceil(totalImages / imagesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Handle previous page button click
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Fetch signed URL for each selected image
    const fetchSignedUrls = async (selectedImages: Set<string>) => {
        setLoading(true);
        const newSignedUrls = new Map<string, string>();

        for (const imageName of selectedImages) {
            try {
                const url = await FetchSignedImageUrl(imageName, 3600); // Assume URL is valid for 1 hour (3600 seconds)
                newSignedUrls.set(imageName, url);
            } catch (error) {
                console.error("Error fetching signed URL:", error);
            }
        }

        setSignedImageUrls(newSignedUrls);
        setLoading(false);
    };

    // Handle confirm image selection
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

            alert("Images added successfully!");
        } catch (error) {
            console.error("Failed to add images", error);
            alert("Failed to add images. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Re-fetch signed URLs when the selected images change
    useEffect(() => {
        if (selectedImages.size > 0) {
            fetchSignedUrls(selectedImages);
        }
    }, [selectedImages]);

    return (
        <div className="flex flex-col items-center p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Select Images for Event</h2>

            {loading ? (
                <p>Loading images...</p>
            ) : (
                <div className="flex w-full space-x-6">
                    {/* Left Column - Image Names with Selection */}
                    <div className="w-2/3 space-y-4 border border-border rounded-lg p-4">
                        {availableImages.map((imgName) => (
                            <div
                                key={imgName}
                                className="flex items-center space-x-4 p-2 rounded-md cursor-pointer"
                                onClick={() => toggleImageSelection(imgName)}
                            >
                                <span className="flex-1 text-sm">{imgName}</span>
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
                    <div className="w-1/3 border border-border rounded-lg p-4 flex flex-col items-center">
                        {selectedImages.size > 0 && (
                            <div className="space-y-4">
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
            <div className="flex justify-between mt-4 w-full border-t border-border pt-4">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="btn btn-secondary"
                >
                    Previous
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === Math.ceil(totalImages / imagesPerPage)}
                    className="btn btn-secondary"
                >
                    Next
                </button>
            </div>

            {/* Confirm Selection */}
            <div className="flex justify-end space-x-3 mt-4 border-t border-border pt-4">
                <button
                    onClick={() => history.back()} // Go back to the previous page
                    disabled={loading}
                    className="btn btn-secondary"
                >
                    Cancel
                </button>
                <button
                    onClick={handleConfirmSelection}
                    disabled={loading || selectedImages.size === 0}
                    className="btn btn-primary"
                >
                    Add Selected
                </button>
            </div>
        </div>
    );
}
