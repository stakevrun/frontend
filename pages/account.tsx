import React, { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Navbar from '../components/navbar';
import { NextPage } from 'next';
import Leftbar from '../components/leftbar';
import AccountMain from '../components/accountMain';
import Head from 'next/head';
import Footer from '../components/footer';
import type { RootState } from '../globalredux/store';
import { useDispatch, useSelector } from 'react-redux';

const Account: NextPage = () => {


  const reduxDarkMode = useSelector((state: RootState) => state.darkMode.darkModeOn)

  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };


  return (
    <div style={{backgroundColor: reduxDarkMode? "#222": "white", height: "auto", width: "100%", color: reduxDarkMode?  "white" : "#222"}} className="flex w-full mx-auto flex-col ">

<Head>
        <title>Vrün | Nodes & Staking</title>
        <meta
          content="Vrun is a cutting-edge Ethereum staking service that empowers node operators with secure, non-custodial staking solutions for unparalleled control and efficiency."
          name="Vrün  | Nodes & Staking"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Navbar />
      <div className='flex w-full sticky top-[8vh] mb-8 pb-8'>
      {/* <Leftbar /> */}
      <AccountMain/>


      </div>
      





<Footer/>
    </div>
  )
}

export default Account;
