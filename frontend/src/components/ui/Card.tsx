import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<Props> = ({ children, className = "", ...props }) => {
  return (
    <div 
      className={`glass-card p-8 hover:bg-white/[0.05] hover:border-white/[0.1] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;