import React, { useEffect, useState } from 'react'
import { PieChart, LineChart } from '@mui/x-charts'
import { BarChart } from '@mui/x-charts/BarChart';
import { NextPage } from 'next';
import { useAccount, useChainId } from 'wagmi';
import { ethers } from 'ethers';
import storageABI from "../json/storageABI.json"
import miniManagerABI from "../json/miniManagerABI.json"
import daoABI from "../json/daoABI.json"
import Link
  from 'next/link';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';

const AccountMain: NextPage = () => {



  /*


  const MinipoolStatus =  [
    Initialised,    
    Prelaunch,     
    Staking,      
    Withdrawable,   
    Dissolved       
  ]
 */



  const currentChain = useChainId();

  const storageAddress = currentChain === 17000 ? "0x594Fb75D3dc2DFa0150Ad03F99F97817747dd4E1" : "0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46"



  function formatTime(milliseconds: number) {
    // Convert milliseconds to seconds
    var seconds = Math.floor(milliseconds / 1000);

    // Calculate days, hours, minutes, and remaining seconds
    var days = Math.floor(seconds / (24 * 3600));
    seconds %= (24 * 3600);
    var hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    var minutes = Math.floor(seconds / 60);
    seconds %= 60;

    // Construct the string
    var timeString = '';
    if (days > 0) {
      timeString += days + ' days ';
    }
    if (hours > 0) {
      timeString += hours + ' hours ';
    }
    if (minutes > 0) {
      timeString += minutes + ' minutes ';
    }
    if (seconds > 0) {
      timeString += seconds + ' seconds ';

    }


    console.log(timeString)

    return timeString.trim();
  }

  const stakeMinipool = async (index: number) => {

    let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
    let signer = await browserProvider.getSigner()
    const storageContract = new ethers.Contract(storageAddress, storageABI, signer);



    const pubkey = await fetch(`https://db.vrün.com/${currentChain}/${address}/pubkey/${index}`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(async response => {

        var jsonString = await response.json()


        console.log("Result of Logs GET" + jsonString)



        return jsonString;


      })
      .catch(error => {

        console.log(error);
      });









    const MinipoolManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolManager"));

    const MinipoolManager = new ethers.Contract(MinipoolManagerAddress, miniManagerABI, signer)


    const minipoolAddress = await MinipoolManager.getMinipoolByPubkey(pubkey);


    console.log("Mini Address:" + minipoolAddress)
    const minipool = new ethers.Contract(minipoolAddress, ['function stake(bytes  _validatorSignature, bytes32 _depositDataRoot)', ' function canStake() view returns (bool)', ' function  getStatus() view returns (uint8)', 'function getStatusTime() view returns (uint256)'], signer)


    const canStakeResult = await minipool.canStake()

    console.log(canStakeResult);


    const types = {
      GetDepositData: [
        { name: 'pubkey', type: 'bytes' },
        { name: 'withdrawalCredentials', type: 'bytes32' },
        { name: 'amountGwei', type: 'uint256' }
      ]
    }


    const EIP712Domain = { name: "vrün", version: "1", chainId: currentChain };
    const APItype = "GetDepositData"

    console.log("Minipool Address:" + minipoolAddress);

    let newAddress = ethers.concat(['0x01', ethers.zeroPadValue(minipoolAddress, 31)])

    const value = { pubkey: pubkey, withdrawalCredentials: newAddress, amountGwei: (ethers.parseEther('31') / ethers.parseUnits('1', 'gwei')).toString() }


    let signature = await signer.signTypedData(EIP712Domain, types, value);

    let depositSignature;
    let depositDataRoot;




    await fetch(`https://db.vrün.com/${currentChain}/${address}/0`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: APItype,
        data: value,
        signature: signature
      })
    })
      .then(async response => {

        var jsonString = await response.json()// Note: response will be opaque, won't contain data

        let newJSON = Object.entries(jsonString);

        console.log(newJSON);

        depositDataRoot = newJSON[0][1]
        depositSignature = newJSON[1][1]


      })
      .catch(error => {
        // Handle error here
        console.log(error);
      });

    if (canStakeResult) {




      await minipool.stake(depositSignature, depositDataRoot);


    } else {
      const statusResult = await minipool.getStatus();
      const statusTimeResult = await minipool.getStatusTime();
      const numStatusTime = Number(statusTimeResult) * 1000;

      console.log("Status Result:" + statusResult)

      console.log("Status Time Result:" + statusTimeResult)

      console.log(Date.now());
      console.log(numStatusTime);


      




      const DAOAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketDAONodeTrustedSettingsMinipool"))

      const DAOContract = new ethers.Contract(DAOAddress, daoABI, signer);

      const scrubPeriod: any = await DAOContract.getScrubPeriod();

      const numScrub = Number(scrubPeriod) * 1000;
      console.log(numScrub);

      const timeRemaining: any = numScrub - (Date.now() - numStatusTime)


      const string = formatTime(timeRemaining);

      console.log("Time Remaining:" + string);


      await minipool.stake(depositSignature, depositDataRoot);




    }






  }



  const closeMinipool = async (index: number) => {

    let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
    let signer = await browserProvider.getSigner()
    const storageContract = new ethers.Contract(storageAddress, storageABI, signer);



    const pubkey = await fetch(`https://db.vrün.com/${currentChain}/${address}/pubkey/${index}`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(async response => {

        var jsonString = await response.json()


        console.log("Result of Logs GET" + jsonString)



        return jsonString;


      })
      .catch(error => {

        console.log(error);
      });



    const MinipoolManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolManager"));

    const MinipoolManager = new ethers.Contract(MinipoolManagerAddress, miniManagerABI, signer)


    const minipoolAddress = await MinipoolManager.getMinipoolByPubkey(pubkey);


    console.log("Mini Address:" + minipoolAddress)
    const minipool = new ethers.Contract(minipoolAddress, ['function close()'], signer)
    await minipool.close()




  }













  const { address } = useAccount({
    onConnect: ({ address }) => {
      console.log("Ethereum Wallet Connected!")

    }
  })



  const nullAddress = "0x0000000000000000000000000000000000000000";


  const getMinipoolData = async () => {


    let browserProvider = new ethers.BrowserProvider((window as any).ethereum)
    let signer = await browserProvider.getSigner()
    const storageContract = new ethers.Contract(storageAddress, storageABI, signer);


    //Get latest index

    const newNextIndex = await fetch(`https://db.vrün.com/${currentChain}/${address}/nextindex`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(async response => {

        var jsonString = await response.json()


        console.log("Result of get next index" + jsonString)


        return jsonString;

      })
      .catch(error => {

        console.log(error);
      });





    //Get all pubkeys

    let pubkeyArray: Array<string> = [];


    for (let i = 0; i <= newNextIndex; i++) {



      await fetch(`https://db.vrün.com/${currentChain}/${address}/pubkey/${i}`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json"
        },
      })
        .then(async response => {

          var jsonString = await response.json()


          console.log("Result of pubkey GET" + jsonString)

          pubkeyArray.push(jsonString);





        })
        .catch(error => {


        });



    }



    const MinipoolManagerAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketMinipoolManager"));

    const MinipoolManager = new ethers.Contract(MinipoolManagerAddress, miniManagerABI, signer)


    let attachedPubkeyArray: Array<Array<string>> = [];


    for (const key of pubkeyArray) {

      console.log("Pubkey:" + key);

      let minipoolAddress = await MinipoolManager.getMinipoolByPubkey(key);

      if (minipoolAddress === nullAddress) {
        attachedPubkeyArray.push(["Null minipool", key])
      }

      else {
        attachedPubkeyArray.push([minipoolAddress,  key]);
      }


      console.log("Get minipool result:" + minipoolAddress);

    }


    let minipoolObjects: Array<rowObject> = [];


    for (const [minAddress, pubkey] of attachedPubkeyArray) {





      if (minAddress === "Null minipool") {

        minipoolObjects.push({

          address: "",
          statusResult: "",
          statusTimeResult: "",
          timeRemaining: "",
          pubkey: ""
      
        });


      } else {


        const minipool = new ethers.Contract(minAddress, ['function stake(bytes  _validatorSignature, bytes32 _depositDataRoot)', ' function canStake() view returns (bool)', ' function  getStatus() view returns (uint8)', 'function getStatusTime() view returns (uint256)'], signer)


        const statusResult = await minipool.getStatus();
        const statusTimeResult = await minipool.getStatusTime();
        const numStatusTime = Number(statusTimeResult) * 1000;

        console.log("Status Result:" + statusResult)

        console.log("Status Time Result:" + statusTimeResult)

        console.log(Date.now());
        console.log(numStatusTime);



        const MinipoolStatus =  [
          "Initialised",    
          "Prelaunch",     
          "Staking",      
          "Withdrawable",   
          "Dissolved"  
        ];
  
  
        const currentStatus = MinipoolStatus[statusResult];




        const DAOAddress = await storageContract["getAddress(bytes32)"](ethers.id("contract.addressrocketDAONodeTrustedSettingsMinipool"))

        const DAOContract = new ethers.Contract(DAOAddress, daoABI, signer);

        const scrubPeriod: any = await DAOContract.getScrubPeriod();

        const numScrub = Number(scrubPeriod) * 1000;
        console.log(numScrub);

        const timeRemaining: any = numScrub - (Date.now() - numStatusTime)


        const string = formatTime(timeRemaining);

        console.log("Time Remaining:" + string);




        minipoolObjects.push({
          address: minAddress,
          statusResult: currentStatus,
          statusTimeResult: statusTimeResult,
          timeRemaining: string,
          pubkey: pubkey
        })

      }



    }


    setCurrentRowData(minipoolObjects)


  }







  type rowObject = {
    address: string,
    statusResult: string,
    statusTimeResult: string,
    timeRemaining: string,
    pubkey: string
};


  const [currentRowData, setCurrentRowData] = useState<Array<rowObject>>([])



useEffect(() => {


  getMinipoolData();

  



}, [])



  







  return (
    <section className="bg-white flex flex-7 sticky items-center justify-center flex-col w-full overflow-y-scroll ">




      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Connected User: </h2>

          <p className="mt-4 text-gray-500 sm:text-xl">
            {address}
          </p>
        </div>
      </div>


      <div className="w-full my-5 mx-5 mb-8 overflow-hidden rounded-lg ">
        <div className="w-full overflow-x-auto flex flex-col items-center justify-center px-12">

          <div className="w-full gap-6 flex  items-center justify-center px-12 py-6 h-auto" >
            <h3 className="text-1xl font-bold text-gray-900 ">Active Nodes</h3>
            <Link href="/createValidator">



              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >
                Create New
              </button>




            </Link>

          </div>
          <table className="w-full">
            <thead>
              <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Age</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white">



              {currentRowData.map((data: rowObject, index: number) => (
    <tr key={index} className="text-gray-700">
      <td className="px-4 py-3 border">
        <div className="flex items-center text-sm">
          <div>
            <p className="font-semibold text-black">{data.address}</p>
            <p className="text-xs text-gray-600">{data.pubkey}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-md font-semibold border">{data.timeRemaining}</td>
      <td className="px-4 py-3 text-xs border">
        <span className="px-2 py-1 font-semibold leading-tight text-orange-700 bg-gray-100 rounded-sm">{data.statusResult}</span>
      </td>
      <td className="px-4 py-3 gap-2 text-sm border">
        <button onClick={() => {closeMinipool(index)}} className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md">Close Minipool</button>
        <button onClick={() => {stakeMinipool(index)}} className="bg-blue-500 mt-2  hover:bg-blue-700 text-white font-bold mx-2 py-2 px-4 rounded-md">Stake Minipool</button>
      </td>
    </tr>
  ))}







              <tr className="text-gray-700">
                <td className="px-4 py-3 border">
                  <div className="flex items-center text-sm">
                    <div className="relative w-8 h-8 mr-3 rounded-full">
                      <img className="object-cover w-full h-full rounded-full" src="https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" alt="" loading="lazy" />
                      <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                    </div>
                    <div>
                      <p className="font-semibold">Nora</p>
                      <p className="text-xs text-gray-600">Designer</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-md font-semibold border">17</td>
                <td className="px-4 py-3 text-xs border">
                  <span className="px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-sm"> Nnacceptable </span>
                </td>
                <td className="px-4 py-3 text-sm border">6/10/2020</td>
              </tr>
              <tr className="text-gray-700">
                <td className="px-4 py-3 border">
                  <div className="flex items-center text-sm">
                    <div className="relative w-8 h-8 mr-3 rounded-full">
                      <img className="object-cover w-full h-full rounded-full" src="https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" alt="" loading="lazy" />
                      <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                    </div>
                    <div>
                      <p className="font-semibold">Ali</p>
                      <p className="text-xs text-gray-600">Programmer</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 border text-md font-semibold">23</td>
                <td className="px-4 py-3 border text-xs">
                  <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm"> Acceptable </span>
                </td>
                <td className="px-4 py-3 border text-sm">6/10/2020</td>
              </tr>
              <tr className="text-gray-700">
                <td className="px-4 py-3 border">
                  <div className="flex items-center text-sm">
                    <div className="relative w-8 h-8 mr-3 rounded-full">
                      <img className="object-cover w-full h-full rounded-full" src="https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" alt="" loading="lazy" />
                      <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                    </div>
                    <div>
                      <p className="font-semibold">Khalid</p>
                      <p className="text-xs text-gray-600">Designer</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 border text-md font-semibold">20</td>
                <td className="px-4 py-3 border text-xs">
                  <span className="px-2 py-1 font-semibold leading-tight text-gray-700 bg-gray-100 rounded-sm"> Pending </span>
                </td>
                <td className="px-4 py-3 border text-sm">6/10/2020</td>
              </tr>
              <tr className="text-gray-700">
                <td className="px-4 py-3 border">
                  <div className="flex items-center text-sm">
                    <div className="relative w-8 h-8 mr-3 rounded-full">
                      <img className="object-cover w-full h-full rounded-full" src="https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" alt="" loading="lazy" />
                      <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                    </div>
                    <div>
                      <p className="font-semibold">Nasser</p>
                      <p className="text-xs text-gray-600">Pen Tester</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 border text-md font-semibold">29</td>
                <td className="px-4 py-3 border text-xs">
                  <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm"> Acceptable </span>
                </td>
                <td className="px-4 py-3 border text-sm">6/10/2020</td>
              </tr>
              <tr className="text-gray-700">
                <td className="px-4 py-3 border">
                  <div className="flex items-center text-sm">
                    <div className="relative w-8 h-8 mr-3 rounded-full">
                      <img className="object-cover w-full h-full rounded-full" src="https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" alt="" loading="lazy" />
                      <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                    </div>
                    <div>
                      <p className="font-semibold">Mohammed</p>
                      <p className="text-xs text-gray-600">Web Designer</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 border text-md font-semibold">38</td>
                <td className="px-4 py-3 border text-xs">
                  <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm"> Acceptable </span>
                </td>
                <td className="px-4 py-3 border text-sm">6/10/2020</td>
              </tr>
              <tr className="text-gray-700">
                <td className="px-4 py-3 border">
                  <div className="flex items-center text-sm">
                    <div className="relative w-8 h-8 mr-3 rounded-full">
                      <img className="object-cover w-full h-full rounded-full" src="https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" alt="" loading="lazy" />
                      <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                    </div>
                    <div>
                      <p className="font-semibold">Saad</p>
                      <p className="text-xs text-gray-600">Data</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 border text-md font-semibold">19</td>
                <td className="px-4 py-3 border text-xs">
                  <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm"> Acceptable </span>
                </td>
                <td className="px-4 py-3 border text-sm">6/10/2020</td>
              </tr>
              <tr className="text-gray-700">
                <td className="px-4 py-3 border">
                  <div className="flex items-center text-sm">
                    <div className="relative w-8 h-8 mr-3 rounded-full">
                      <img className="object-cover w-full h-full rounded-full" src="https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" alt="" loading="lazy" />
                      <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                    </div>
                    <div>
                      <p className="font-semibold">Sami</p>
                      <p className="text-xs text-gray-600">Developer</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 border text-md font-semibold">21</td>
                <td className="px-4 py-3 border text-xs">
                  <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm"> Acceptable </span>
                </td>
                <td className="px-4 py-3 border text-sm">6/10/2020</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Trusted by eCommerce Businesses</h2>

          <p className="mt-4 text-gray-500 sm:text-xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione dolores laborum labore
            provident impedit esse recusandae facere libero harum sequi.
          </p>
        </div>

        <div className="mt-8 sm:mt-12">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">
              <dt className="order-last text-lg font-medium text-gray-500">Total Sales</dt>

              <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">$4.8m</dd>
            </div>

            <div className="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">
              <dt className="order-last text-lg font-medium text-gray-500">Official Addons</dt>

              <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">24</dd>
            </div>

            <div className="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">
              <dt className="order-last text-lg font-medium text-gray-500">Total Addons</dt>

              <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">86</dd>
            </div>
          </dl>
        </div>
      </div>



      <div className="mt-8 sm:mt-12 p-4">

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div className="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: 10, label: 'series A' },
                    { id: 1, value: 15, label: 'series B' },
                    { id: 2, value: 20, label: 'series C' },
                  ],
                },
              ]}
              width={400}
              height={200}
            />



          </div>


          <div className="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">

            <BarChart
              series={[
                { data: [35, 44, 24, 34] },
                { data: [51, 6, 49, 30] },
                { data: [15, 25, 30, 50] },
                { data: [60, 50, 15, 25] },
              ]}
              height={290}
              xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' }]}
              margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            />
          </div>




        </dl>



      </div>

      <div className="mt-8 sm:mt-12 p-4">

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-1">

          <div className="flex flex-col rounded-lg border border-gray-100 px-4 py-8 text-center">


            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                {
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
                },
              ]}
              width={500}
              height={300}
            />


          </div>
        </dl>

      </div>








    </section>
  )
}

export default AccountMain