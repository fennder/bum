import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

export const Badge: React.FC<BadgeProps> = ({
  className = "",
  variant = "default",
  children,
  ...props
}) => {
  let variantClasses = "";
  switch (variant) {
    case "secondary":
      variantClasses = "bg-slate-100 text-slate-800 border-transparent";
      break;
    case "destructive":
      variantClasses = "bg-red-50 text-red-700 border-red-200";
      break;
    case "outline":
      variantClasses = "text-slate-800 border-slate-300";
      break;
    case "success":
      variantClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
      break;
    case "warning":
      variantClasses = "bg-amber-50 text-amber-800 border-amber-200";
      break;
    case "default":
    default:
      variantClasses = "bg-blue-600 text-white border-transparent";
      break;
  }

  return (
    <div
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
