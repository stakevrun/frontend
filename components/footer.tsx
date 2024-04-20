import React from 'react'
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import { useAccount } from 'wagmi';
import Image from 'next/image';

const Footer: NextPage = () => {


  const { address } = useAccount({
    onConnect: ({ address }) => {
      console.log("Ethereum Wallet Connected!")
    }
  })




  return (


    <footer  className="p-4 w-full h-[100px] flex items-center justify-center mt-[100px] gap-8 bg-gray-800 justify-center z-[999]">

        <div className='w-[60]  flex items-center justify-center gap-8'>

        <p className="text-white">Vrun website and staking service Copyright 2024</p>

<p className="text-white">This app is a work in progress, please email any inquiries to admin@vrun.com</p>


        </div>

        <div className='w-[60] flex flex-col items-center justify-center gap-2'>

<p className="font-bold hover:text-yellow-100 cursor-pointer text-white">Terms & Conditions</p>

<p className="font-bold hover:text-yellow-100 cursor-pointer text-white">License</p>


</div>

        
     


    </footer>

  )
}

export default Footer


