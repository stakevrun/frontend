import { useAccount } from "wagmi";
import { IfConnected } from "../components/layout/IfConnected";
import { NextPage } from "next";

const Account: NextPage = () => {
  const { address, status: accountStatus } = useAccount();

  // consider setting up rocketpool registration check as middleware: https://nextjs.org/docs/app/building-your-application/routing/middleware
  return (
    <IfConnected accountStatus={accountStatus}>
    <div className="flex w-full mx-auto flex-col ">
      <div className="flex w-full h-auto sticky top-[8vh] mb-6 lg:mb-2 pb-[34vh] xl:pb-[10vh]">
        Account
        <section className="flex w-full flex-col items-center   justify-center ">
          Wallet Connected for {address}!
        </section>
      </div>
    </div>
    </IfConnected>
  );
};

export default Account;
