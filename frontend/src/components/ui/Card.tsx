import React from "react";

type Props = {
  children: React.ReactNode;
};

const Card: React.FC<Props> = ({ children }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-4 w-full">
      {children}
    </div>
  );
};

export default Card;