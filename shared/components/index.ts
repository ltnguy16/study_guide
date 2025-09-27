import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { default as SideNav } from "./side_nav"
export * from "./ui"
export { LogoutButton } from "./logout_button"