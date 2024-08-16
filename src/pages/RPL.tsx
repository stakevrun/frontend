import { NextPage } from "next";
import IfConnected from "../components/layout/IfConnected";
import { IfRegistered } from "../components/layout/IfRegistered";

/*
This page could be where users:
- Stake/unstake RPL
- Change smoothing pool status
*/

const RPL: NextPage = () => {
  return (
    <IfConnected>
      <IfRegistered>
        <h1>Rocket Pool Interface goes here (maybe)</h1>
      </IfRegistered>
    </IfConnected>
  );
};

export default RPL;