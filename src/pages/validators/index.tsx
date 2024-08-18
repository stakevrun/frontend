import { NextPage } from "next"

// info about all validators (with links to detail page)

/*
Definitely include in table:
- pubkey
- beacon chain index

Other info (decide which to include/save for detail pages):
- vrün index
- fee recipient
- graffiti
- whether enabled in vrün
- beacon chain balance
- rewards summary
- when it was created
- performance summary (e.g. attestation success rate, number of blocks proposed/missed, sync committee performance, rated.network raver score)
- link to beaconcha for more info
*/
const Validators: NextPage = () => {
  return (
    <>
      <h1>table showing info about all validators might go here</h1>
    </>
  )
}

export default Validators; 