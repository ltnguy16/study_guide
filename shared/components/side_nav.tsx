"use client";

import React, { useCallback, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/shared";
import { Menu, LayoutDashboard, ListCollapse, CalendarClockIcon, X } from "lucide-react";

interface NavItem {
    label: string;
    href?: string;
    icon: React.ElementType;
    external?: boolean;
}

export default function SideNav() {
    const pathname = usePathname();
    const router = useRouter();

    const [collapsed, setCollapsed] = useState(true);
    const [isMidCollapse, setIsMidCollapse] = useState(false);

    // New state to control mobile sidebar visibility
    const [mobileOpen, setMobileOpen] = useState(false);

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
                setTimeout(() => {
                    router.push(href);
                    setMobileOpen(false); // Close mobile sidebar after navigation
                }, 200);
            }
        },
        [router]
    );

    // Close sidebar on Escape key press (for accessibility)
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && mobileOpen) {
                setMobileOpen(false);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [mobileOpen]);

    return (
        <>
            {/* Mobile hamburger toggle button (visible on small screens only) */}
            <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="fixed top-4 left-4 z-50 md:hidden text-gray-700 dark:text-gray-300 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            >
                <Menu size={24} />
            </button>

            {/* Overlay for mobile when sidebar is open */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    aria-hidden="true"
                />
            )}

            <aside
                role="navigation"
                aria-label="Main"
                className={cn(
                    "fixed top-0 left-0 h-full transition-all duration-300 flex flex-col border-r border-gray-200 dark:border-gray-700 shadow-md z-50",
                    // Solid background colors - no transparency
                    "bg-white dark:bg-gray-900",
                    collapsed ? "w-16 md:w-16" : "w-full md:w-64",
                    "md:relative md:h-auto md:top-auto md:left-auto",
                    mobileOpen ? "translate-x-0" : "-translate-x-full",
                    "transform md:transform-none",
                    "max-w-xs md:max-w-none" // Limit max width on mobile
                )}
                style={{
                    minWidth: collapsed ? 64 : undefined,
                    width: collapsed ? "4rem" : undefined,
                    height: "100vh",
                }}
            >

                {/* Header */}
                <div
                    className={cn(
                        "flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700",
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

                    {/* Toggle sidebar button */}
                    <button
                        onClick={toggleCollapsed}
                        className="text-gray-600 dark:text-gray-300 focus:outline-none hover:text-pyramid-primary transition-colors hover:bg-muted/50 rounded p-1"
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {collapsed ? (
                            <Menu size={20} />
                        ) : (
                            <ListCollapse size={20} className="transition-transform transform rotate-180" />
                        )}
                    </button>

                    {/* Mobile close button */}
                    {mobileOpen && (
                        <button
                            onClick={() => setMobileOpen(false)}
                            aria-label="Close menu"
                            className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none hover:text-pyramid-primary transition-colors hover:bg-muted/50 rounded p-1"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Navigation Links */}
                <nav
                    className={cn(
                        "flex flex-col gap-2 px-2 mt-2",
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
        </>
    );
}
