"use client";

import React, { useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/shared";
import { Menu, LayoutDashboard, ListCollapse, CalendarClockIcon } from "lucide-react";

interface NavItem {
    label: string;
    href?: string;
    icon: React.ElementType;
    external?: boolean;
}

export default function SideNav() {
    const pathname = usePathname();
    const router = useRouter();

    const [collapsed, setCollapsed] = useState(false);
    const [isMidCollapse, setIsMidCollapse] = useState(false);

    const navLinks: NavItem[] = [
        { label: "Timeline", href: "/timeline", icon: CalendarClockIcon },
    ];

    const toggleCollapsed = useCallback(() => {
        if (!collapsed) {
            setIsMidCollapse(true);
            setCollapsed(true);
            setTimeout(() => {
                setIsMidCollapse(false);
            }, 300); // Match CSS transition duration
        } else {
            setCollapsed(false);
        }
    }, [collapsed]);

    const handleNavClick = useCallback(
        (href: string, external?: boolean) => {
            if (external) {
                window.open(href, "_blank");
            } else {
                setCollapsed(false);
                setTimeout(() => router.push(href), 200);
            }
        },
        [router]
    );

    return (
        <aside
            role="navigation"
            aria-label="Main"
            className={cn(
                "h-screen bg-[var(--background)] dark:bg-gray-900 transition-all duration-300 flex flex-col",
                collapsed ? "w-16" : "w-full md:w-64",
                // Add subtle right shadow / outline to separate sidebar from main content
                "border-r border-gray-200 dark:border-gray-700 shadow-md"
            )}
            style={{
                minWidth: collapsed ? 64 : undefined,
                width: collapsed ? "4rem" : undefined,
                height: "calc(100vh - 56px)",
            }}
        >
            {/* Header with Menu label and toggle button */}
            <div
                className={cn(
                    "flex items-center justify-between px-4 py-4",
                    collapsed ? "justify-center" : "justify-between"
                )}
            >
                {!collapsed && (
                    <div
                        className={cn(
                            "text-lg font-semibold select-none transition-opacity duration-300",
                            isMidCollapse ? "opacity-50 pointer-events-none" : "opacity-100"
                        )}
                    >
                        Menu
                    </div>
                )}
                <button
                    onClick={toggleCollapsed}
                    className="text-gray-600 dark:text-gray-300 focus:outline-none hover:text-pyramid-primary transition-colors hover:bg-muted/50 rounded p-1"
                    aria-label="Toggle sidebar"
                >
                    {collapsed ? (
                        <Menu size={20} />
                    ) : (
                        <ListCollapse size={20} className="transition-transform transform rotate-180" />
                    )}
                </button>
            </div>

            {/* Navigation Links */}
            <nav
                className={cn(
                    "flex flex-col gap-2 px-2",
                    collapsed ? "items-center" : ""
                )}
            >
                {navLinks.map(({ label, href, external, icon: Icon }) => {
                    const isActive = href && pathname === href;

                    return (
                        <Link
                            key={href}
                            href={href as string}
                            onClick={() => handleNavClick(href!, external)}
                            target={external ? "_blank" : "_self"}
                            className={cn(
                                "flex items-center w-full px-3 py-2 rounded text-sm font-medium transition-colors",
                                isActive
                                    ? "text-pyramid-primary bg-muted"
                                    : "text-gray-700 dark:text-gray-300 hover:text-pyramid-primary hover:bg-muted/50",
                                collapsed ? "justify-center" : "justify-start"
                            )}
                            title={collapsed ? label : undefined}
                            style={{ gap: collapsed ? undefined : "0.75rem" }}
                        >
                            {Icon && <Icon className="h-5 w-5" />}
                            {!collapsed && <span>{label}</span>}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
