import { CreateBrowserClient } from "@/lib/supabase/client";
import { config } from "@/shared/components/config";

/**
 * Generates a signed URL for a private image stored in the "timeline-images" bucket.
 * 
 * @param path Full path like "event1/img1.jpg"
 * @param expireTime Expiration time in seconds (default: 60s)
 * @returns A signed URL or empty string on error
 */
export async function FetchSignedImageUrl(
    path: string,
    expireTime: number = 60 * 60
): Promise<string> {
    const supabase = CreateBrowserClient();

    // Remove leading slash or collections prefix if present
    let relativePath = path;
    if (relativePath.startsWith("/")) {
        relativePath = relativePath.slice(1);
    }
    if (relativePath.startsWith("collections/")) {
        relativePath = relativePath.replace(/^collections\//, "");
    }

    const fullPath = `collections/${relativePath}`;

    const { data, error } = await supabase.storage
        .from(config.timelineBucket)
        .createSignedUrl(fullPath, expireTime);

    if (error) {
        console.error(`Failed to create signed URL for ${fullPath}:`, error);
        return "";
    }

    return data?.signedUrl || "";
}
