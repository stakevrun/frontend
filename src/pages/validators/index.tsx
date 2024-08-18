import { NextPage } from "next";
import IfConnected from "../../components/layout/IfConnected";
import { IfRegistered } from "../../components/layout/IfRegistered";
import { IfSigned } from "../../components/layout/IfSigned";
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

// TODO: determine how to handle data fetching and layout wrt validator tetail pages

// fake placeholder 
type Validator = {
  pubKey: string;
  bcIndex: number;
  vIndex: number;
};

const validators: Validator[] = [
  {
    pubKey: "0",
    bcIndex: 0,
    vIndex: 0,
  },
  {
    pubKey: "1",
    bcIndex: 1,
    vIndex: 1,
  },
  {
    pubKey: "2",
    bcIndex: 2,
    vIndex: 2,
  },
];

const Validators: NextPage = () => {
  return (
    <IfConnected>
      <IfRegistered>
        <IfSigned>
          <Table >
            <TableHead>
              <TableRow>
                <TableHeader>Public Key</TableHeader>
                <TableHeader>BC Index</TableHeader>
                <TableHeader>Vrun Index</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {validators.map((v, i) => (
                <TableRow key={i} href={`/validators/${v.vIndex}`}>
                  <TableCell className="text-zinc-800">{v.pubKey}</TableCell>
                  <TableCell className="text-zinc-800">{v.bcIndex}</TableCell>
                  <TableCell className="text-zinc-800">{v.vIndex}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </IfSigned>
      </IfRegistered>
    </IfConnected>
  );
};

export default Validators;
