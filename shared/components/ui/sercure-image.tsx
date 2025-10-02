"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Spinner } from "@/shared/components";
import { FetchSignedImageUrl } from "@/shared/service/fetch/fetch-signed-image-url";

interface SecureImageProps {
    path: string;  // could be a signed URL or raw path
    alt?: string;
    className?: string;
    size?: number;  // unified size for both width and height
    borderRadius?: string; // optional for flexibility
    backgroundColor?: string; // optional for flexibility
}

const SecureImage: React.FC<SecureImageProps> = ({
    path,
    alt = "",
    className,
    size = 100,  // default size is 100px x 100px for square
    borderRadius = "16px", // default rounded corners (use smaller for more rounded)
    backgroundColor = "black", // default black background
}) => {
    const [signedUrl, setSignedUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Add a loading state

    useEffect(() => {
        const fetchUrl = async () => {
            if (path.startsWith("http")) {
                setSignedUrl(path); // Use the provided URL directly if it's already a full URL
                setLoading(false); // No need to load if the URL is already valid
            } else {
                try {
                    const url = await FetchSignedImageUrl(path, 3600); // Fetch the signed URL
                    setSignedUrl(url);
                    setLoading(false); // Set loading to false when the URL is ready
                } catch (error) {
                    console.error("Error generating signed URL:", error);
                    setSignedUrl(null); // Handle error gracefully
                    setLoading(false); // Stop loading even on error
                }
            }
        };

        if (path) {
            fetchUrl();
        }
    }, [path]); // Dependency array ensures this effect runs when the `path` changes

    if (loading || !signedUrl) {
        return (
            <div
                className={className}
                style={{
                    width: size,
                    height: size,
                    borderRadius,
                    overflow: "hidden",
                    backgroundColor,
                    display: "inline-block",
                }}
            >
                <div className="flex items-center justify-center w-full h-full">
                    <Spinner />
                </div>
            </div>
        );
    }


    return (
        <div
            className={className}
            style={{
                width: size,
                height: size,
                borderRadius,
                overflow: "hidden",
                backgroundColor,
                display: "inline-block",
            }}
        >
            <Image
                data-testid="secure-image"
                src={signedUrl}
                alt={alt}
                width={size}
                height={size}
                loading="lazy"
                style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "inherit"
                }}
                unoptimized
            />
        </div>
    );
};

export default SecureImage;
