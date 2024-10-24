// this could be part of main validators page instead of its own route; starting here for now
import { type NextPage } from "next";
import {
  Fieldset,
  Field,
  Label,
  Description,
} from "../../components/layout/fieldset";
import { TransactionSubmitter } from "../../components/layout/TransactionSubmitter";
import { Input } from "../../components/layout/input";
import { Checkbox } from "../../components/layout/checkbox";

/* New validators:
- how many
- what graffiti (for the batch)
- opt in to smoothing pool? (should also be on account page)

in the future:
default size is 8 ETH, but maybe 16 or other sizes
RPL or not
migrate existing validator (separate form input to upload existing key)

have a preview for possible failure states:
- before submitting, if you don't have enough staked RPL, you can't do it
  - maybe some instructions/background info about this
  - maybe direct to an exchange to buy some?
  - redirect to or show staking RPL form
- check ETH balance
- need enough account balance (maybe a warning rather than a blocker?)
*/

const ValidatorCreationInterface: NextPage = () => {
  return (
    <form>
      <h1>Create</h1>
      <Fieldset>
        <Field>
          <Label>Number of validators</Label>
          <Description>
            Create a single validator, or several as a batch.
          </Description>
          <Input type="number" />
        </Field>
        <Field>
          <Label>Graffiti</Label>
          <Description>
            Graffiti will apply to the entire batch if creating more than one
            validator.
          </Description>
          {/* TODO what type of input */}
        </Field>
        <Field>
          <Label>Opt in to smoothing pool?</Label>
          <Checkbox></Checkbox>
        </Field>
      </Fieldset>
    </form>
  );
};

export default ValidatorCreationInterface;
