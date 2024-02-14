import React from 'react'
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import { useAccount } from 'wagmi';
import Image from 'next/image';

const Navbar: NextPage = () => {


  const { address } = useAccount({
    onConnect: ({ address }) => {
      console.log("Ethereum Wallet Connected!")
    }
  })




  return (


    <header className="p-4 w-full h-16 bg-white flex items-center justify-center sticky top-0 z-50 shadow">
      <div className="px-4 w-full ">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex h-14 items-center justify-between w-full rounded-lg md:px-3">
            <div className="mr-4 shrink-0">
              <Link className="flex flex-row items-center justify-center gap-2" href="/">
                
                <Image height={30} width={30} src={'/images/speha;rocket.png'} alt="Vrun logo" />
                <span className="text-lg xl:text-2xl font-bold">
                  VRÜN
                </span>
              </Link>
            </div>
            <nav className="flex grow w-full p-5">
              <ul className="flex grow flex-wrap gap-x-5 items-center justify-end">

               

                <li className="ml-1">
                  <ConnectButton />
                </li>
                {

address !== undefined ? (<li className="ml-1">
<Link href="/account" className="text-black hover:text-gray-600">
  Go to Account
</Link>
</li>) : (<></>)
}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>

  )
}

export default Navbar


