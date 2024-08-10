import { FC, ReactNode } from "react";
import { useSignTypedData } from "wagmi";
import { useReadDb } from "../../hooks/useReadDb";
import { types, declaration, useApiDomain } from "../../hooks/useApiTypes";

export const SignTermsForm: FC<{}> = ({}) => {
  const domain = useApiDomain();
  const {signTypedData, data, error} = useSignTypedData();
  const primaryType = "AcceptTermsOfService";
  const message = { declaration };
  const handler = () => {
    signTypedData({types, domain, primaryType, message});
  };

  return (
    <button
      className="bg-blue-500 self-center xl:self-start hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
      onClick={handler}>
    Sign Terms
    </button>);
};

export const IfSigned: FC<{
  children: ReactNode,
}> = ({ children }) => {
  const { data, error } = useReadDb({path: 'acceptance'});
  const isSigned = data?.status === 200;
  if (error) return (<p>Error checking ToS signature: {error.message}</p>);
  else if (isSigned) return (<><p>Debug Info: Signed ToS</p>{children}</>);
  else return <SignTermsForm />;
};
