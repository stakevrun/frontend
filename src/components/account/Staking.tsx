import { useState } from "react";
import {
  Input,
  RadioGroup,
  Radio,
  Field,
  Label,
  Button,
} from "@headlessui/react";

const Staking = () => {
  const [stakeMode, setStakeMode] = useState(0);

  return (
    <div className="panel flex-col m-6 gap-6 p-12">
      <h1 className="text-center">RPL interface</h1>
      <div className="panel flex-col m-4 gap-4 text-center">
        <div>
          <h2>Unstaked RPL:</h2>
          <p>0</p>
        </div>
        <div>
          <h2>Staked RPL:</h2>
          <p>0</p>
        </div>
        <div>
          <h2>Active Minipools:</h2>
          <p>0</p>
        </div>
        <div>
          <h2>Total Possible Minipools:</h2>
          <p>0</p>
        </div>
      </div>
      <Input
        type="number"
        placeholder="RPL Value"
        className="border border-slate-200 p-2 rounded-md bg-transparent"
      />
      <RadioGroup
        value={stakeMode}
        onChange={setStakeMode}
        className="flex justify-around"
      >
        <Radio
          key={0}
          value={0}
          className="group p-2 rounded-md data-[checked]:bg-lime-100 cursor-pointer"
        >
          <span>Stake</span>
        </Radio>
        <Radio
          key={1}
          value={1}
          className="group p-2 rounded-md data-[checked]:bg-lime-100 cursor-pointer"
        >
          <span>Unstake</span>
        </Radio>
      </RadioGroup>
      <Button className="btn-primary self-center">Submit</Button>
    </div>
  );
};

export default Staking;
