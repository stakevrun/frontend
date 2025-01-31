import type { NextPage } from "next";
import IfConnected from "../../components/layout/IfConnected";
import { IfRegistered } from "../../components/layout/IfRegistered";
import { IfSigned } from "../../components/layout/IfSigned";
import { ValidatorOverview } from "../../components/layout/ValidatorOverview";
import { useState } from "react";

// info about all validators (with links to detail page)

/*
Definitely include in table:
- pubkey
- beacon chain index

Other info (decide which to include/save for detail pages/exclude):
- vrün index
- fee recipient
- graffiti
- whether enabled in vrün
- beacon chain balance
- rewards summary
- when it was created
- performance summary (e.g. attestation success rate, number of blocks proposed/missed, sync committee performance, rated.network raver score)
- link to beaconcha for more info
*/

// TODO: determine how to handle data fetching and layout wrt validator tetail pages

const Validators: NextPage = () => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [error,    setError   ] = useState<string>("");

  const setOverviewError = (error: string) => {
    setError(error);
    setHasError(true);
  };

  return (
    <IfConnected>
      <IfRegistered>
        <IfSigned>
          {hasError ? (
            <p>Error getting validators: {error.toString()}</p>
          ) : (
            <ValidatorOverview
              onError={setOverviewError}
              showCols={["status", "vrunIndex", "index", "address", "pubkey"]}
            />
          )}
        </IfSigned>
      </IfRegistered>
    </IfConnected>
  );
};

export default Validators;
