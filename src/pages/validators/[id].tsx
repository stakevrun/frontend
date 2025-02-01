import { useRouter } from "next/router";

// single change of graffiti
// single change of fee recipient
// disable (enable?)
// get signed exit message
// see rewards
// see beacon chain

export default function ValidatorDetail() {
  const router = useRouter();
  return <h1>Validator detail for validator with ID {router.query.id}</h1>;
}
