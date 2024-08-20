// this could be part of main validators page instead of its own route; starting here for now
import { NextPage } from "next";

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
    <h1>Create</h1>
  )
};

export default ValidatorCreationInterface;