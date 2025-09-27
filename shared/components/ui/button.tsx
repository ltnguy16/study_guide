import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow hover:bg-[hsl(var(--primary)/0.9)]",
                destructive:
                    "bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] shadow-sm hover:bg-[hsl(var(--destructive)/0.9)]",
                outline:
                    "border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] shadow-sm hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]",
                secondary:
                    "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] shadow-sm hover:bg-[hsl(var(--secondary)/0.8)]",
                ghost:
                    "hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]",
                link:
                    "text-[hsl(var(--primary))] underline-offset-4 hover:underline",

                // Header-specific buttons
                header_dark:
                    "bg-[hsl(var(--foreground))] text-[hsl(var(--background))] shadow hover:bg-[hsl(var(--foreground)/0.9)]",
                header_light:
                    "border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[hsl(var(--primary))] shadow hover:bg-[hsl(var(--background)/0.9)]",
            },
            size: {
                default: "h-9 px-4 py-2 text-sm",
                sm: "h-8 px-3 text-xs",
                lg: "h-10 px-8 text-lg",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);


export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size }), className)}
                ref={ref}
                {...props}
            />
        );
    },
);


export { Button, buttonVariants };