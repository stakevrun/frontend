import { type FC, type ReactNode, useEffect } from "react";
import { useState } from "react";
import { useSignTypedData } from "wagmi";
import { FaCoins, FaEthereum, FaSignature } from "react-icons/fa";
import type { UseQueryResult } from "@tanstack/react-query";
import { Input, Button } from "@headlessui/react";
import { PayForm } from "../layout/PayForm";
import { AddValidatorForm } from "../layout/AddValidatorForm";
import { useSignPaymentTransaction } from "../../hooks/useSignPaymentTransaction";
import { useReadFee } from "../../hooks/useReadFee";
import { useVrunPrices } from "../../hooks/useVrunPrices";

const Validators = () => {

  const [hasError, setHasError] = useState(false);
  const [error,    setError]    = useState("");

  const addValidator = (result: String, error: String, hasError: bool) => {
    setError(error);
    setHasError(hasError);
  };

  return (
    <section className="grid gap-4 my-10 py-5">
      {hasError && (
      <div className="self-center whitespace-pre-wrap break-words mt-4 border border-red-500 rounded p-4">
        {error}
      </div>
      )}
      <AddValidatorForm
        onSubmit={addValidator}
      />
    </section>
  );
};

export default Validators;
