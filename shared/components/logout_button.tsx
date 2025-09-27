"use client";

import React from "react";
import { CreateBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components";

export function LogoutButton() {
    const router = useRouter();

    const logout = async () => {
        const database = CreateBrowserClient();
        await database.auth.signOut();
        router.push("/auth/login");
    };

    return <Button variant={"outline"} onClick={logout}>Logout</Button>;
}