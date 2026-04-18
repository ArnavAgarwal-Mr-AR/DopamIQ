import React from "react";

type Props = {
  children: React.ReactNode;
  columns?: number;
};

const GridLayout: React.FC<Props> = ({ children, columns = 12 }) => {
  return (
    <div
      className={`grid gap-4`}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {children}
    </div>
  );
};

export default GridLayout;