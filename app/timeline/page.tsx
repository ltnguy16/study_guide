import { CreateServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TimelineItemClient } from "@/features/timeline/components/timeline-item-client";

export default async function TimelinePage() {
  const supabase = await CreateServerClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) redirect("/auth/login");

  return (
    <>
      <header className="px-6 py-4 border-b border-border dark:border-border/50 shadow-sm sticky top-0 bg-background dark:bg-background z-10">
          <h1 className="text-2xl font-semibold text-primary dark:text-primary-foreground">
            Event Timeline
          </h1>
        </header>
      <div className="flex flex-col gap-6 p-6 w-full">
        <TimelineItemClient />
      </div>
    </>
  );
}
