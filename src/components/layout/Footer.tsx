import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-14 mb-8 p-10 flex flex-col justify-between border-t dark:border-white/10">
      <div className="text-md w-full p-6 flex flex-row justify-center gap-16 text-zinc-500 dark:text-zinc-400">
        <Link href="/pricing" className="hover:text-zinc-800 dark:hover:text-zinc-300">Pricing</Link>
        <Link href="/faq" className="hover:text-zinc-800 dark:hover:text-zinc-300">FAQ</Link>
        <Link href="/terms" className="hover:text-zinc-800 dark:hover:text-zinc-300">Terms</Link>
      </div>
      <p className="p-6 text-xs text-center text-zinc-500">Vrün website and staking service © 2024</p>
    </footer>
  );
}
