import React from 'react'
import { PieChart, LineChart } from '@mui/x-charts'
import { BarChart } from '@mui/x-charts/BarChart';
import { NextPage } from 'next';
import { useAccount } from 'wagmi';
import Link
  from 'next/link';

const AccountMain: NextPage = () => {







  const { address } = useAccount({
    onConnect: ({ address }) => {
      console.log("Ethereum Wallet Connected!")
    }
  })


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
          <tr className="text-gray-700">
            <td className="px-4 py-3 border">
              <div className="flex items-center text-sm">
                <div className="relative w-8 h-8 mr-3 rounded-full md:block">
                  <img className="object-cover w-full h-full rounded-full" src="https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" alt="" loading="lazy" />
                  <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                </div>
                <div>
                  <p className="font-semibold text-black">Sufyan</p>
                  <p className="text-xs text-gray-600">Developer</p>
                </div>
              </div>
            </td>
            <td className="px-4 py-3 text-ms font-semibold border">22</td>
            <td className="px-4 py-3 text-xs border">
              <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm"> Acceptable </span>
            </td>
            <td className="px-4 py-3 text-sm border">6/4/2000</td>
          </tr>
          <tr className="text-gray-700">
            <td className="px-4 py-3 border">
              <div className="flex items-center text-sm">
                <div className="relative w-8 h-8 mr-3 rounded-full">
                  <img className="object-cover w-full h-full rounded-full" src="https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" alt="" loading="lazy" />
                  <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                </div>
                <div>
                  <p className="font-semibold text-black">Stevens</p>
                  <p className="text-xs text-gray-600">Programmer</p>
                </div>
              </div>
            </td>
            <td className="px-4 py-3 text-md font-semibold border">27</td>
            <td className="px-4 py-3 text-xs border">
              <span className="px-2 py-1 font-semibold leading-tight text-orange-700 bg-gray-100 rounded-sm"> Pending </span>
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