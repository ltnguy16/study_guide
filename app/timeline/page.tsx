// app/timeline/page.tsx (or wherever your page lives)

import { CreateServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TimelineItemClient } from "@/features/timeline/components/timeline-item-client";

export default async function TimelineItemPage() {
    const supabase = await CreateServerClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    // Redirect unauthenticated users to login page
    if (authError || !authData?.user) {
        redirect("/auth/login");
    }

    return (
        <div className="flex flex-col gap-6 p-6 w-full">
            
        </div>
    );
}
