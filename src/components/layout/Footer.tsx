import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-14 mb-8 p-10 flex flex-col justify-between border-t">
      <div className="text-md w-full p-6 flex flex-row justify-center gap-16">
        <Link href="/pricing" className="text-zinc-500 hover:text-zinc-800">Pricing</Link>
        <Link href="/faq" className="text-zinc-500 hover:text-zinc-800">FAQ</Link>
        <Link href="/terms" className="text-zinc-500 hover:text-zinc-800">Terms</Link>
      </div>
      <p className="p-6 text-xs text-center">Vrün website and staking service © 2024</p>
    </footer>
  );
}
