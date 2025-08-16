import React from "react";

type TagVariant = "default" | "success" | "warning" | "error" | "info";

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: TagVariant;
  className?: string;
  rounded?: boolean;
  size?: "sm" | "md" | "lg";
}

const variantStyles: Record<TagVariant, string> = {
  default:
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700",
  success:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-700",
  warning:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700",
  error:
    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-700",
  info:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-700",
};

const sizeStyles = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-3 py-1",
  lg: "text-base px-4 py-1.5",
};

export const Tag: React.FC<TagProps> = ({
  children,
  variant = "default",
  className = "",
  rounded = true,
  size = "md",
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center font-medium transition-colors duration-150";
  const borderRadius = rounded ? "rounded-full" : "rounded";
  const variantClass = variantStyles[variant] || variantStyles.default;
  const sizeClass = sizeStyles[size] || sizeStyles.md;

  return (
    <span
      className={`${baseStyle} ${variantClass} ${sizeClass} ${borderRadius} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Tag;
