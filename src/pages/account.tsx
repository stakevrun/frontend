import { useAccount } from "wagmi";
import { IfConnected } from "../components/layout/IfConnected";
import { IfRegistered } from "../components/layout/IfRegistered";
import { NextPage } from "next";

const Account: NextPage = () => {
  const { address, status: accountStatus } = useAccount();

  // consider setting up rocketpool registration check as middleware: https://nextjs.org/docs/app/building-your-application/routing/middleware
  return (
    <IfConnected accountStatus={accountStatus}>
      <IfRegistered address={address as `0x${string}`}>
        <div className="flex w-full mx-auto flex-col ">
          <div className="flex w-full h-auto sticky top-[8vh] mb-6 lg:mb-2 pb-[34vh] xl:pb-[10vh]">
            <section className="flex w-full flex-col items-center   justify-center ">
              Account page goes here.
            </section>
          </div>
        </div>
      </IfRegistered>
    </IfConnected>
  );
};

export default Account;
