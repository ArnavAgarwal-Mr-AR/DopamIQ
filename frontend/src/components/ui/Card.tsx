import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Card: React.FC<Props> = ({ children, className = "" }) => {
  return (
    <div className={`glass-card p-8 hover:bg-white/[0.05] hover:border-white/[0.1] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] ${className}`}>
      {children}
    </div>
  );
};

export default Card;