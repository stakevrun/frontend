import { FaExclamationTriangle } from "react-icons/fa";
import { useEffect } from "react";
import { useValidatorData } from "../../hooks/useValidatorData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../layout/table";

export const ValidatorOverview: FC<{
  onError: (error: String) => void;
}> = ({ onError }) => {
  const {
    validatorData,
    hasPrelaunchPools,
    hasPoolsToActivate,
    loading: validatorDataLoading,
    error: validatorDataError,
  } = useValidatorData();

  useEffect(() => {
    if (validatorDataError) {
      onError(validatorDataError);
    }
  }, [validatorDataError]);

  return (
    <div>
      <div className="w-full flex flex-col gap-4 justify-center mt-5">
        {hasPoolsToActivate && (
          <div className="flex flex-row mb-3 items-center border border-orange-500 rounded p-4">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 text-ornage-600 bg-orange-100 rounded-full mr-6">
              <FaExclamationTriangle className="text-orange-500 text-xl" />
            </div>
            One or more validators are awaiting activation. Please activate them
            as soon as possible by using the corresponding Stake button!
          </div>
        )}
        {!hasPoolsToActivate && hasPrelaunchPools && (
          <div className="flex flex-row mb-3 items-center border border-orange-500 rounded p-4">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 text-ornage-600 bg-orange-100 rounded-full mr-6">
              <FaExclamationTriangle className="text-orange-500 text-xl" />
            </div>
            One or more validators are in Prelaunch state. Please check back
            within a day to process the activation as soon as possible.
          </div>
        )}
        {validatorDataLoading ? (
          <p>Loading validator data...</p>
        ) : validatorData.length === 0 ? (
          <p>No validator data available.</p>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Public Key</TableHeader>
                <TableHeader>Address</TableHeader>
                <TableHeader>Validator Index</TableHeader>
                <TableHeader>Vrün Index</TableHeader>
                <TableHeader>Status</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {validatorData.map((validator) => (
                <TableRow
                  key={validator.index}
                  href={`/validators/${validator.pubkey}`}
                >
                  <TableCell>{validator.pubkey}</TableCell>
                  <TableCell>
                    <abbr title={validator.address}>
                      {validator.address.substring(0, 7)}
                    </abbr>
                  </TableCell>
                  <TableCell>{validator.index}</TableCell>
                  <TableCell>{validator.index}</TableCell>
                  <TableCell>{validator.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};
