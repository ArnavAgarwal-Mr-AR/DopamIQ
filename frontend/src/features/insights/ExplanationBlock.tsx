import React from "react";

type Props = {
  text: string;
};

const ExplanationBlock: React.FC<Props> = ({ text }) => {
  return (
    <div className="bg-gray-50 border rounded-xl p-4 text-sm text-gray-700">
      {text}
    </div>
  );
};

export default ExplanationBlock;