import React, { useState } from "react";
import SecureImage from "@/shared/components/ui/sercure-image";
import { Trash } from "lucide-react";

interface ScrollableImageGalleryProps {
    images: string[];
    onAddImage: () => void;
    onRemoveImage: (path: string) => void;
    loading: boolean;
}

const PAGE_SIZE = 3;

export const ScrollableImageGallery: React.FC<ScrollableImageGalleryProps> = ({
    images,
    onAddImage,
    onRemoveImage,
    loading,
}) => {
    const totalPages = Math.ceil(images.length / PAGE_SIZE);
    const [currentPage, setCurrentPage] = useState(1);

    const displayedImages = images.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const changePage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className="w-full">
            <button
                onClick={onAddImage}
                disabled={loading}
                className="flex items-center justify-center min-w-[80px] h-24 bg-gray-200 rounded-md hover:bg-gray-300 text-accent cursor-pointer shadow-lg px-2 border border-border mb-3"
                aria-label="Add images"
            >
                +
            </button>

            <div
                className="flex flex-row flex-nowrap gap-1 overflow-x-auto w-full max-w-full"
                style={{ WebkitOverflowScrolling: "touch", boxSizing: "border-box" }}
            >
                {displayedImages.map((path, idx) => (
                    <div
                        key={idx}
                        className="relative"
                    >
                        <SecureImage
                            path={`collections/${path}`}
                            alt={`event-img-${idx}`}
                            size={102}
                            className="rounded-md w-full h-full object-cover border border-accent"
                        />
                        <div
                            onClick={() => onRemoveImage(path)}
                            role="button"
                            aria-label={`Remove ${path}`}
                            className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 bg-gray-700 rounded-full text-white hover:bg-gray-800 transition-all duration-200 ease-in-out cursor-pointer"
                        >
                            <Trash className="h-3 w-3" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex space-x-2 mt-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => changePage(page)}
                        disabled={page === currentPage}
                        className={`px-3 py-1 rounded font-medium transition ${page === currentPage
                            ? "bg-accent text-accent-foreground cursor-default"
                            : "bg-muted hover:bg-muted/80 dark:bg-muted/70 dark:hover:bg-muted/90 text-muted-foreground dark:text-muted-foreground"
                            }`}
                        aria-label={`Go to page ${page}`}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
};
