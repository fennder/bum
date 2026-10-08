import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "accent";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", children, ...props }, ref) => {
    let variantClasses = "";
    switch (variant) {
      case "outline":
        variantClasses = "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900";
        break;
      case "ghost":
        variantClasses = "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900";
        break;
      case "secondary":
        variantClasses = "bg-slate-100 text-slate-900 hover:bg-slate-200";
        break;
      case "destructive":
        variantClasses = "bg-red-600 text-white hover:bg-red-700";
        break;
      case "accent":
        variantClasses = "bg-orange-500 text-white hover:bg-orange-600";
        break;
      case "default":
      default:
        variantClasses = "bg-blue-900 text-white hover:bg-blue-800 shadow-sm";
        break;
    }

    let sizeClasses = "";
    switch (size) {
      case "sm":
        sizeClasses = "h-8 px-3 text-xs";
        break;
      case "lg":
        sizeClasses = "h-11 px-6 text-base";
        break;
      case "icon":
        sizeClasses = "h-9 w-9 p-0 justify-center";
        break;
      case "default":
      default:
        sizeClasses = "h-9 px-4 py-2 text-sm";
        break;
    }

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${variantClasses} ${sizeClasses} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
