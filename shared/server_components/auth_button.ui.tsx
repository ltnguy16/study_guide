import React from "react";
import Link from "next/link";
import { Button } from "@/shared/components";
import { LogoutButton } from "@/shared/components";

export function AuthButtonUI({ user }: { user: { email?: string } | null }) {
    return user ? (
        <div className="flex items-center gap-4">
            <div className="hidden md:block py-2">Hey, {user.email}!</div>
            <LogoutButton />
        </div>
    ) : (
        <div className="flex gap-2">
            <Button asChild size="sm" variant={"header_light"}>
                <Link href="/auth/login">Sign in</Link>
            </Button>
        </div>
    );
}