import { useState } from "react";
import { AddValidatorForm } from "../layout/AddValidatorForm";
import { ValidatorOverview } from "../layout/ValidatorOverview";

const Validators = () => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [error,    setError   ] = useState<string | undefined>();
  const [message,  setMessage ] = useState<string | undefined>();

  const addValidator = (
    result: string | undefined,
    error: string | undefined,
    hasError: boolean,
  ) => {
    setError(error);
    setHasError(hasError);
    setMessage(result);
  };

  const setOverviewError = (error: string) => {
    setError(error);
    setHasError(true);
  };

  return (
    <section className="grid gap-4 my-10 py-5">
      {message && (
        <div className="self-center whitespace-pre-wrap break-words mt-4 border border-blue-500 rounded p-4">
          {message}
        </div>
      )}
      {hasError && (
        <div className="self-center whitespace-pre-wrap break-words mt-4 border border-red-500 rounded p-4">
          {error}
        </div>
      )}
      <AddValidatorForm onSubmit={addValidator} />
      <div className="panel flex-col">
        <div className="flex flex-row mb-3 content-center">
          <h2 className="text-lg self-center">
            Validators overview
          </h2>
        </div>
        <ValidatorOverview
          onError={setOverviewError}
          showCols={[
            "status",
            "statusTime",
            "address",
            "pubkeyShort",
            "action",
          ]}
        />
      </div>
    </section>
  );
};

export default Validators;
