import { type NextPage } from "next";
import IfConnected from "../../components/layout/IfConnected";
import { IfRegistered } from "../../components/layout/IfRegistered";
import { IfSigned } from "../../components/layout/IfSigned";
import { useValidatorPubkeys } from "../../hooks/useValidatorPubkeys";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/layout/table";

// info about all validators (with links to detail page)

/*
Definitely include in table:
- pubkey
- beacon chain index

Other info (decide which to include/save for detail pages/exclude):
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

// TODO: determine how to handle data fetching and layout wrt validator tetail pages

// fake placeholder
type Validator = {
  pubkey: `0x${string}`;
  index: number;
  vIndex: number;
};

const Validators: NextPage = () => {
  const {data: pubkeys, error: pubkeysError} = useValidatorPubkeys();

  const validators: Validator[] = pubkeysError ? [] :
    pubkeys.map((pubkey, i) => ({pubkey, index: i /* todo */, vIndex: i /* todo */}));

  return (
    <IfConnected>
      <IfRegistered>
        <IfSigned>
          {pubkeysError ? <p>Error getting pubkeys: {pubkeysError.toString()}</p> : (
          <Table >
            <TableHead>
              <TableRow>
                <TableHeader>Public Key</TableHeader>
                <TableHeader>Validator Index</TableHeader>
                <TableHeader>Vrün Index</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {validators.map((v, i) => (
                <TableRow key={i} href={`/validators/${v.vIndex}`/*TODO: use pubkey instead*/}>
                  <TableCell className="text-zinc-800">{v.pubkey}</TableCell>
                  <TableCell className="text-zinc-800">{v.index}</TableCell>
                  <TableCell className="text-zinc-800">{v.vIndex}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>)}
        </IfSigned>
      </IfRegistered>
    </IfConnected>
  );
};

export default Validators;
