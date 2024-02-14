import React, { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Navbar from './components/navbar';
import { NextPage } from 'next';
import Leftbar from './components/leftbar';
import AccountMain from './components/accountMain';

const Account: NextPage = () => {

  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };


  return (
    <div className="flex w-full mx-auto flex-col ">
      <Navbar />
      <div className='flex w-full sticky top-16'>
        <Leftbar />
      <AccountMain/>






      </div>
      






    </div>
  )
}

export default Account;
