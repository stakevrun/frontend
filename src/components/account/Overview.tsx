import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaCoins, FaEthereum, FaMoneyBillWave } from "react-icons/fa";
import { ValidatorOverview } from "../layout/ValidatorOverview";
import { CreditOverview } from "../layout/CreditOverview";

const Overview = () => {
  // prettier-ignore
  const [hasError, setHasError] = useState<Boolean>(false);
  const [error,    setError   ] = useState<String>("");
  const [message,  setMessage ] = useState<String>("");

  const setOverviewError = (error: String) => {
    setError(error);
    setHasError(true);
  };

  return (
    <section className="grid gap-4 my-10 py-5">
      <div className="panel flex-col">
        <p>Withdrawal Address:</p>
        <p className="font-bold text-vrun-4 hover:text-vrun-5 dark:hover:text-vrun-2">
          <Link href={`` /*TODO*/}>Retrieve Pre-signed Exit Messages</Link>
        </p>
      </div>
      <div className="panel flex-col items-start">
        <div className="flex w-full mb-3 justify-left items-center">
          <div className="flex items-center h-12 w-12">
            <FaEthereum className="text-blue-500 text-xl" />
          </div>
          <h2 className="flex flex-1 text-lg">Validators</h2>
        </div>
        <ValidatorOverview onError={setOverviewError} showCols={["status", "statusTime", "address", "pubkeyShort", "action"]}  />
      </div>
      <div className="panel flex-col items-start">
        <div className="flex w-full items-center">
          <div className="flex items-center h-12 w-12">
            <FaCoins className="text-yellow-500 text-xl" />
          </div>
          <h2 className="flex flex-1 text-lg">Vrun Balance</h2>
          <div className="text-lg">
            <CreditOverview onError={setOverviewError} />
          </div>
        </div>
      </div>
      <div className="panel">
        <Image width={20} height={20} alt="Rocket Pool Logo" src={"/images/rocketPlogo.png"} />
        <h2 className="mx-4">RPL Stake</h2>
      </div>
      <div className="panel">
        <FaMoneyBillWave className="text-xl text-green-500" />
        <h2 className="mx-4">Rewards Summary</h2>
      </div>
    </section>
  );
};

export default Overview;
