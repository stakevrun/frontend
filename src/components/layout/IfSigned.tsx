import { FC, ReactNode } from "react";
import { useSignTypedData } from "wagmi";
import { useReadDb } from "../../hooks/useReadDb";
import { useWriteDb } from "../../hooks/useWriteDb";
import { Button } from "@headlessui/react";
import { useApiTypes, useDeclaration } from "../../hooks/useApiTypes";
import { UseQueryResult } from "@tanstack/react-query";

export const SignTermsForm: FC<{
  refetch: (options?: { throwOnError: boolean, cancelRefetch: boolean }) => Promise<UseQueryResult>
}> = ({refetch}) => {
  const {data: typesData, error: typesError} = useApiTypes();
  const {data: declaration, error: declarationError} = useDeclaration();
  const {signTypedDataAsync, error: signingError} = useSignTypedData();
  const primaryType = "AcceptTermsOfService";
  const message = { declaration };
  const {mutateAsync, error: writingError} = useWriteDb({
    method: 'PUT', type: primaryType, data: message,
  });

  const handler = async () => {
    if (!typesData) return;
    try {
      const {types, domain} = typesData;
      const signature = await signTypedDataAsync({types, domain, primaryType, message});
      const res = await mutateAsync({signature});
      return refetch();
    }
    catch (e) {
      console.warn(e)
      return;
    }
  };

  return (
    <>
    <Button
      className="btn-primary"
      disabled={!!typesError || !!declarationError}
      onClick={handler}>
    Sign Terms
    </Button>
    {typesError && <p>Error fetching types: {typesError.message}</p>}
    {declarationError && <p>Error fetching required declaration: {declarationError.message}</p>}
    {signingError && <p>Error signing data: {signingError.message}</p>}
    {writingError && <p>Error writing data: {writingError.message}</p>}
    </>
  );
};

export const IfSigned: FC<{
  children: ReactNode,
}> = ({ children }) => {
  const { data, error, refetch } = useReadDb({path: 'acceptance'});
  const isSigned = data?.status === 200;
  if (error) return (<p>Error checking ToS signature: {error.message}</p>);
  else if (isSigned) return children;
  else return <SignTermsForm refetch={refetch} />;
};
