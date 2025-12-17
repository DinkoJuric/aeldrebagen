import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging Tailwind CSS classes safely.
 * Combines clsx for conditional classes and tailwind-merge to handle conflicts.
 * 
 * @example
 * cn("flex", isActive && "bg-blue-500", "p-4")
 * cn(buttonVariants({ variant: "primary" }), className)
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
