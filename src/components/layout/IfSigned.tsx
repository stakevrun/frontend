import { FC, ReactNode } from "react";

export const IfSigned: FC<{
  children: ReactNode
}> = ({ children }) => {
  return (
    <>
    <p>Todo: check that the account has actually signed the ToS. Assuming so...</p>
    {children}
    </>
  );
};
