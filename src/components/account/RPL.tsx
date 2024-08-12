import { Input, RadioGroup, Radio, Field, Label, Button } from "@headlessui/react";

const RPL = () => {
  return (
    <div className="border p-4 m-6">
      <h1 className="text-center">RPL interface</h1>
      <div className="border p-2 m-4">
        <h2>Unstaked RPL:</h2>
        <p>0</p>
        <h2>Staked RPL:</h2>
        <p>0</p>
        <h2>Active Minipools:</h2>
        <p>0</p>
        <h2>Total Possible Minipools:</h2>
        <p>0</p>
      </div>
      <Input type="number" placeholder="RPL Value" className="" />
      <RadioGroup className="flex justify-around">
        <Radio key={0} value={0} className="group p-2 rounded-md data-[checked]:bg-lime-100">
          <span>Stake</span>
        </Radio>
        <Radio key={1} value={1} className="group p-2 rounded-md data-[checked]:bg-lime-100">
          <span>Unstake</span>
        </Radio>
      </RadioGroup>
      <Button className="btn-primary">Submit</Button>
    </div>
  );
};

export default RPL;
