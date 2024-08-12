import { NextPage } from "next";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { IfConnected } from "../components/layout/IfConnected";
import { IfRegistered } from "../components/layout/IfRegistered";
import { IfSigned } from "../components/layout/IfSigned";
import Overview from "../components/account/Overview";
import RPL from "../components/account/RPL";
import Rewards from "../components/account/Rewards";
import Payments from "../components/account/Payments";

// List of user's validators (and summary of info about them)
// Summary of user's credit balance (days purchased and spent)
// RPL stake
// Smoothing pool status
// Withdrawal address
// Link to retrieve signature for signed terms of service. Maybe also other past instructions too.
// Summary of rewards earned (and/or link to more details)

const Account: NextPage = () => {
  // consider setting up rocketpool registration check as middleware: https://nextjs.org/docs/app/building-your-application/routing/middleware
  return (
    <IfConnected>
      <IfRegistered>
        <IfSigned>
          <div className="flex w-full mx-auto flex-col ">
            <div className="flex w-full h-auto sticky top-[8vh] mb-6 lg:mb-2 pb-[34vh] xl:pb-[10vh]">
              <section className="flex w-full flex-col items-center justify-center ">
                <TabGroup>
                  {/* this tab organization will probably change; first stab */}
                  <TabList className="flex justify-center gap-4">
                    <Tab className="tab-primary">Overview</Tab>
                    <Tab className="tab-primary">RPL</Tab>
                    <Tab className="tab-primary">Rewards</Tab>
                    <Tab className="tab-primary">Payments</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel><Overview /></TabPanel>
                    <TabPanel><RPL /></TabPanel>
                    <TabPanel><Rewards /></TabPanel>
                    <TabPanel><Payments /></TabPanel>
                  </TabPanels>
                </TabGroup>
              </section>
            </div>
          </div>
        </IfSigned>
      </IfRegistered>
    </IfConnected>
  );
};

export default Account;
