import type { FC, ReactNode } from "react";
import { useSignTypedData } from "wagmi";
import { useReadDb } from "../../hooks/useReadDb";
import { useWriteDb } from "../../hooks/useWriteDb";
import { Button } from "@headlessui/react";
import { useApiTypes, useDeclaration } from "../../hooks/useApiTypes";
import type { UseQueryResult } from "@tanstack/react-query";

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

  const hasError = () => {
    if (typesError || declarationError || signingError || writingError) {
      return true
    }

    return false
  };

  const errorMessage = () => {
    if(typesError) {
      return `Error fetching types: ${typesError.message}`
    }
    if(declarationError) {
      return `Error fetching required declaration: ${declarationError.message}`
    }
    if(signingError) {
      return `Error signing data: ${signingError.message}`
    }
    if(writingError) {
      return `Error writing data: ${writingError.message}`
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col justify-center content-center max-w-md">
        <p className="self-center mb-4">Please verify the terms <a className="underline" href="/terms">here</a></p>
        <Button
          className="btn-primary self-center"
          disabled={!!typesError || !!declarationError}
          onClick={handler}>
        Sign Terms
        </Button>
        <div className={'self-center whitespace-pre-wrap break-words mt-4 border border-red-500 rounded p-4 ' + (hasError() ? 'visible' : 'invisible' )}>
          {errorMessage()}
        </div>
      </div>
    </div>
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
