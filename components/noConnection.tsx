import React from 'react'
import { MdNoAccounts } from "react-icons/md";
import { ConnectButton } from '@rainbow-me/rainbowkit';

const NoConnection = () => {
    return (
        <div className='w-full  h-[90vh] flex flex-col items-center justify-center '>



            <div className="flex flex-col w-auto gap-2 rounded-lg  border border-gray-100 px-4 py-4 text-center items-center justify-center shadow">


                <MdNoAccounts className='text-7xl' />
                <h2 className="text-2xl font-bold text-gray-900 sm:text-2xl">NO WALLET CONNECTED</h2>

                <p className="mt-4 text-gray-500 sm:text-l">
                    Please connect your wallet to use the Vrün platform.
                </p>

                <div className='w-3/5 flex gap-2 pt-5 items-center justify-center'>
                    <ConnectButton />
                </div>
            </div>



        </div>
    )
}


export default NoConnection;
