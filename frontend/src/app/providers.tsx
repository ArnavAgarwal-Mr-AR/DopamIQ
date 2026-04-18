import React from "react";

type Props = {
  children: React.ReactNode;
};

const Providers: React.FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default Providers;