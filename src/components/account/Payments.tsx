import { Input, Button } from "@headlessui/react";
import { FaCoins } from "react-icons/fa";

const Payments = () => {
  return (
    <>
      <div className="panel">
        <div className="inline-flex flex-shrink-0 items-center justify-center h-12 w-12 text-yellow-600 bg-yellow-100 rounded-full mr-6">
          <FaCoins className="text-yellow-500 text-xl" />
        </div>
        <div>
          <span>{0}</span>
          ETH
        </div>
        <div>Vrün Balance</div>
      </div>
      <div className="panel flex-col">
        <h2>Add ETH Credit:</h2>
        <Input type="number" placeholder="Enter ETH amount"></Input>
        <Button className="btn-primary self-center bg-green-500 data-[hover]:bg-green-700 data-[active]:bg-green-600">Pay</Button>
      </div>
    </>
  );
};

export default Payments;
