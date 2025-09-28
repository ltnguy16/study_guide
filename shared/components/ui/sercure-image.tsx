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

    useEffect(() => {
        const fetchUrl = async () => {
            if (path.startsWith("http")) {
                setSignedUrl(path);
            } else {
                try {
                    const url = await FetchSignedImageUrl(path, 3600);
                    setSignedUrl(url);
                } catch (error) {
                    console.error("Error generating signed URL:", error);
                    setSignedUrl(null);
                }
            }
        };

        if (path) {
            fetchUrl();
        }
    }, [path]);

    if (!signedUrl) {
        return (
            <div
                className={`flex items-center justify-center text-xs text-gray-400 bg-gray-100 ${className}`}
                style={{ width: size, height: size, borderRadius, backgroundColor }}
            >
                <Spinner />
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
                style={{
                    objectFit: "cover",  // Ensures the image fills the container
                    width: "100%",
                    height: "100%",
                }}
                unoptimized
            />
        </div>
    );
};

export default SecureImage;
