import React from "react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

const Button: React.FC<Props> = ({
  children,
  onClick,
  variant = "primary",
}) => {
  const base = "px-4 py-2 rounded-lg text-sm font-medium transition";

  const styles =
    variant === "primary"
      ? "bg-black text-white hover:bg-gray-800"
      : "bg-gray-200 text-gray-800 hover:bg-gray-300";

  return (
    <button className={`${base} ${styles}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;