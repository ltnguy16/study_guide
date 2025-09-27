import { CreateServerClient } from "@/lib/supabase/server";
import { AuthButtonUI } from "./auth_button.ui";

export default async function AuthButton() {
    const database = await CreateServerClient();
    const {
        data: { user },
    } = await database.auth.getUser();

    return <AuthButtonUI user={user ?? null} />;
}