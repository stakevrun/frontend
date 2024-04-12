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


    <header className="p-2 w-full h-auto bg-white flex flex-col items-center justify-center sticky top-0 z-50 shadow lg:h-[8vh]">
     
        <div className="mx-auto w-[90%] flex items-center justify-center gap-5">
          <div className="flex h-14 items-center justify-between w-full rounded-lg md:px-3">





            <div className="shrink-0">
              <Link className="flex flex-row items-center justify-center gap-2" href="/">
                <Image
                  height={30}
                  width={30}
                  src={'/images/vrunlogo.png'}
                  alt="Vrun logo"
                  className="rounded-full"
                />
                <span className="text-lg xl:text-2xl font-bold">
                  VRÜN
                </span>
              </Link>
            </div>
            <nav className="flex grow w-auto">
              <ul className="flex grow flex-wrap gap-x-5 items-center justify-end">



                <li className="ml-1">
                  <ConnectButton />
                </li>
                {

                  address !== undefined ? (<li className="ml-1 hidden lg:block">
                    <Link href="/account" className="text-black hover:text-gray-600">
                      Go to Account
                    </Link>
                  </li>) : (<></>)
                }
              </ul>
            </nav>

          </div>

        
        </div>
        {

address !== undefined ? (<div className="ml-1 block lg:hidden">
  <Link href="/account" className="text-black hover:text-gray-600">
    Go to Account
  </Link>
</div>) : (<></>)
}
     


    </header>

  )
}

export default Navbar


