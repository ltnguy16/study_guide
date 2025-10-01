import { CreateBrowserClient } from "@/lib/supabase/client";

export async function DeleteFromGallery(id: number, path: string) {
    const supabase = CreateBrowserClient();

    const { data, error } = await supabase
        .from("galleries")
        .delete()
        .eq("eventid", id)
        .eq("imagepath", path);  // Assuming "imagepath" is the correct column

    if (error) {
        // Throw an error if something goes wrong with the deletion
        throw new Error(`Failed to delete image: ${error.message}`);
    }

    // If everything is fine, just return nothing (no need to return `data`)
    console.log("Image deleted successfully:", data); // Optional logging for success
}
