import { cn } from "../utils/utils";
import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      default: "bg-lime-400 text-black hover:bg-lime-300",
      outline: "border border-gray-300 text-black bg-white hover:bg-gray-100",
      ghost: "bg-transparent text-black hover:bg-gray-100",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], "rounded-full px-4 py-2", className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
