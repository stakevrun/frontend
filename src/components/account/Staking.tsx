import { useState } from "react";
import { Input, Field, Label, Button } from "@headlessui/react";
import { Radio, RadioGroup } from "../layout/radio";

const Staking = () => {
  const [stakeMode, setStakeMode] = useState("stake");

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
      <RadioGroup value={stakeMode} onChange={setStakeMode} className="flex">
        <Radio value={"stake"} className="cursor-pointer" />
        <Label>Stake</Label>
        <Radio value={"unstake"} className="cursor-pointer" />
        <Label>Unstake</Label>
      </RadioGroup>
      <Button className="btn-primary self-center">Submit</Button>
    </div>
  );
};

export default Staking;
