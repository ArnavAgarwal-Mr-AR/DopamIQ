import React from "react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
};

const Button: React.FC<Props> = ({
  children,
  onClick,
  variant = "primary",
  className = "",
}) => {
  const base = "px-4 py-2 rounded-lg text-sm font-medium transition";

  const styles =
    variant === "primary"
      ? "bg-black text-white hover:bg-gray-800"
      : "bg-gray-200 text-gray-800 hover:bg-gray-300";

  return (
    <button className={`${base} ${styles} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;