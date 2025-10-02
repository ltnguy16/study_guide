import React from "react";
import Link from "next/link";
import { Button } from "@/shared/components";
import { LogoutButton } from "@/shared/components";

export function AuthButtonUI({ user }: { user: { email?: string } | null }) {
    return user ? (
        <div className="flex items-center gap-4 text-foreground">
            <div className="hidden md:block py-2 text-muted-foreground">
                Hey, {user.email}!
            </div>
            <LogoutButton />
        </div>
    ) : (
        <div className="flex gap-2">
            <Button asChild size="sm" variant="header_light">
                <Link href="/auth/login" className="text-accent hover:underline">
                    Sign in
                </Link>
            </Button>
        </div>
    );
}
