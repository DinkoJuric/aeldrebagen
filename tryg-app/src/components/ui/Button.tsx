import React, { ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Button variants using CVA for type-safe, maintainable styling
 */
const buttonVariants = cva(
    // Base styles (always applied)
    "rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500",
    {
        variants: {
            variant: {
                primary: "bg-teal-600 text-white shadow-lg shadow-teal-200 hover:bg-teal-700 active:scale-95",
                secondary: "bg-stone-100 text-stone-800 hover:bg-stone-200",
                danger: "bg-rose-100 text-rose-700 hover:bg-rose-200 border-2 border-rose-200",
                outline: "border-2 border-teal-600 text-teal-700 hover:bg-teal-50",
                ghost: "bg-transparent text-stone-500 hover:text-stone-800",
                locked: "bg-stone-200 text-stone-400 cursor-not-allowed",
            },
            size: {
                small: "py-2 px-4 text-sm",
                normal: "py-3 px-6 text-base",
                large: "py-6 px-8 text-xl h-24",
                xl: "py-8 px-8 text-2xl h-32",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "normal",
        },
    }
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    'aria-label'?: string;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant,
    size,
    className,
    disabled = false,
    'aria-label': ariaLabel,
    ...props
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            className={cn(
                buttonVariants({
                    variant: disabled ? 'locked' : variant,
                    size
                }),
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

// Export variants for external use (e.g., link styled as button)
export { buttonVariants };

export default Button;
