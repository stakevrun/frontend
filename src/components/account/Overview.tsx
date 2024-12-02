import Link from "next/link";
import Image from "next/image";
import { FaCoins, FaEthereum, FaMoneyBillWave } from "react-icons/fa";

const Overview = () => {
  return (
    <section className="grid gap-4 my-10 py-5">
      <div className="panel flex-col">
        <p>Withdrawal Address:</p>
        <p className="font-bold text-vrun-4 hover:text-vrun-5 dark:hover:text-vrun-2">
          <Link href={`` /*TODO*/}>Retrieve Signature</Link>
        </p>
      </div>
      <div className="panel">
        <FaEthereum className="text-xl text-blue-500" />
        <h2 className="mx-4">Validators</h2>
        <div>{`(list of user's validators and summary of their info goes here)`}</div>
      </div>
      <div className="panel">
        <FaCoins className="text-xl text-yellow-500" />
        <h2 className="mx-4">Vrun Balance</h2>
      </div>
      <div className="panel">
        <Image
          width={20}
          height={20}
          alt="Rocket Pool Logo"
          src={"/images/rocketPlogo.png"}
        />
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
