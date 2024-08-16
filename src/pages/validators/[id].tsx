import { useRouter } from "next/router";

export default function ValidatorDetail() {
  const router = useRouter();
  return <h1>Validator detail for validator with ID {router.query.id}</h1>
}