import { CreateBrowserClient } from "@/lib/supabase/client";
import { config } from "@/shared/components/config";

/**
 * Fetches the list of image file names in the specified folder inside the configured bucket with pagination.
 * 
 * @param folderPath Folder inside the bucket, e.g. "collections"
 * @param page The current page to fetch (1-based index)
 * @param imagesPerPage The number of images to fetch per page
 * @returns An object containing `images` (array of file names) and `totalCount` (total number of images)
 */
export async function FetchEventImages(
    folderPath: string,
    page: number,
    imagesPerPage: number
): Promise<{ images: string[]; totalCount: number }> {
    const supabase = CreateBrowserClient();

    // Calculate the offset based on the current page and imagesPerPage
    const offset = (page - 1) * imagesPerPage;

    // List files inside the folderPath (e.g., "collections") with pagination
    const { data, error } = await supabase.storage
        .from(config.timelineBucket)
        .list(folderPath, {
            limit: imagesPerPage,
            offset: offset,
        });

    if (error) {
        console.error("Error fetching available images:", error);
        throw error;
    }

    // Fetch the total count of files in the folder (separate query to get the count)
    const { data: countData, error: countError } = await supabase.storage
        .from(config.timelineBucket)
        .list(folderPath, {
            limit: 10000, // Large enough limit to fetch all images for counting
        });

    if (countError) {
        console.error("Error fetching total count of images:", countError);
        throw countError;
    }

    // Filter out folders and return only file names
    const fileNames = data
        .filter((item) => !item.name.endsWith('/')) // folders may have trailing slash
        .map((item) => item.name);

    // Return both the images and the total count of images
    return { images: fileNames, totalCount: countData ? countData.length : 0 };
}
