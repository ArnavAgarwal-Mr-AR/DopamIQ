import React from "react";

type Props = {
  height?: string;
  width?: string;
};

const Skeleton: React.FC<Props> = ({
  height = "h-4",
  width = "w-full",
}) => {
  return (
    <div
      className={`${height} ${width} bg-gray-200 rounded animate-pulse`}
    />
  );
};

export default Skeleton;