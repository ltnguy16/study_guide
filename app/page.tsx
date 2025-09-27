import { redirect } from "next/navigation";
import { CreateServerClient } from "@/lib/supabase/server";
import AuthButton from "@/shared/server_components/auth_button";


export default async function Home() {
  // Redirect to dashboard if user is already authenticated
  const database = await CreateServerClient();
  const { data: authData } = await database.auth.getUser();
  if (authData?.user) { redirect("/dashboard"); }

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-10 items-center">

        <header>This is the Installers Database application.</header>
        <header>Please sign in to continue.</header>
        <AuthButton />
      </div>
    </main>
  );
}