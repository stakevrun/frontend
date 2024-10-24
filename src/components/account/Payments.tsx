import { Input, Button } from "@headlessui/react";
import { FaCoins } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

/*
const [credits, setCredits] = useState<number | undefined>(); //chainId/address/credits
// for this, need the pubkeys associated with the address - maybe do the validator list page first to get that component?
const [charges, setCharges] = useState<chargesType | undefined>(); //chainId/address/pubkey/charges
*/

const Payments = () => {
  return (
    <>
      <div className="panel flex-col">
        <div className="flex flex-row">
          <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 text-yellow-600 bg-yellow-100 rounded-full mr-6">
            <FaCoins className="text-yellow-500 text-xl" />
          </div>
          <h1>Vrün Balance</h1>
        </div>
        <div>
          <span>{0}</span>
          ETH
        </div>
      </div>
      <div className="panel flex-col">
        <h2>Add ETH Credit:</h2>
        <Input type="number" placeholder="Enter ETH amount"></Input>
        <Button className="btn-primary self-center bg-green-500 data-[hover]:bg-green-700 data-[active]:bg-green-600">
          Pay
        </Button>
      </div>
    </>
  );
};

export default Payments;
