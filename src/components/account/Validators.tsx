import { useState } from "react";
import { AddValidatorForm } from "../layout/AddValidatorForm";
import { CreateValidatorOverview } from "../layout/CreateValidatorOverview";

const Validators = () => {
  const [hasError, setHasError] = useState(false);
  const [error,    setError]    = useState("");
  const [message,  setMessage]  = useState("");

  const addValidator = (result: String, error: String, hasError: bool) => {
    setError(error);
    setHasError(hasError);
    setMessage(result);
  };

  const setOverviewError = (error: String) => {
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
      <AddValidatorForm
        onSubmit={addValidator}
      />
      <div className="panel flex-col">
        <div className="flex flex-row mb-3 content-center">
          <h2 className="text-lg self-center">Non-staking validators overview</h2>
        </div>
        <CreateValidatorOverview
          onError={setOverviewError}
        />
      </div>
    </section>
  );
};

export default Validators;
