import { FC, ReactNode } from "react";
import { useReadDb } from "../../hooks/useReadDb";

export const IfSigned: FC<{
  children: ReactNode,
}> = ({ children }) => {
  const { data, error } = useReadDb({path: 'acceptance'});
  const isSigned = data?.status === 200;
  if (error) return (<p>Error checking ToS signature: {error.message}</p>);
  else if (isSigned) return (<><p>Debug Info: Signed ToS</p>{children}</>);
  else return (<p>Placeholder: form to sign ToS</p>);
};
