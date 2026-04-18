import React from "react";

type Props = {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error";
};

const variantStyles = {
  default: "bg-gray-200 text-gray-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  error: "bg-red-100 text-red-700",
};

const Badge: React.FC<Props> = ({ children, variant = "default" }) => {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
};

export default Badge;