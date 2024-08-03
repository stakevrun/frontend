import Link from "next/link";

export function Footer() {
  return (
    <footer className="p-4 flex flex-col lg:flex-row items-center justify-between">
      <p>Vrün website and staking service Copyright 2024</p>
      <Link href="/terms">Terms</Link>
    </footer>
  );
}
