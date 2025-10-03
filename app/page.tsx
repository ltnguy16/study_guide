import { redirect } from "next/navigation";
import { CreateServerClient } from "@/lib/supabase/server";
import AuthButton from "@/shared/server_components/auth_button";

export default async function Home() {
  const supabase = await CreateServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect("/timeline");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
      <div className="flex flex-col gap-6 items-center max-w-md w-full text-center bg-dialog shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-semibold text-primary">Welcome to Loi & My's Study Guide</h1>
        <p className="text-lg text-muted-foreground">Please sign in to continue.</p>
        <AuthButton />
      </div>
    </main>
  );
}
