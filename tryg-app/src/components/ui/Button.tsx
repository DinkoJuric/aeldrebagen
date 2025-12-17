import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'locked';
type ButtonSize = 'small' | 'normal' | 'large' | 'xl';

const variants: Record<ButtonVariant, string> = {
    primary: "bg-teal-600 text-white shadow-lg shadow-teal-200 hover:bg-teal-700 active:scale-95",
    secondary: "bg-stone-100 text-stone-800 hover:bg-stone-200",
    danger: "bg-rose-100 text-rose-700 hover:bg-rose-200 border-2 border-rose-200",
    outline: "border-2 border-teal-600 text-teal-700 hover:bg-teal-50",
    ghost: "bg-transparent text-stone-500 hover:text-stone-800",
    locked: "bg-stone-200 text-stone-400 cursor-not-allowed"
};

const sizes: Record<ButtonSize, string> = {
    small: "py-2 px-4 text-sm",
    normal: "py-3 px-6 text-base",
    large: "py-6 px-8 text-xl h-24",
    xl: "py-8 px-8 text-2xl h-32"
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    'aria-label'?: string;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    className = '',
    size = 'normal',
    disabled = false,
    'aria-label': ariaLabel,
    ...props
}) => {
    const baseStyle = "rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            className={`${baseStyle} ${disabled ? variants.locked : variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
