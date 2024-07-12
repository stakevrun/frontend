import type { NextPage } from "next";
import Head from "next/head";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import type { RootState } from '../globalredux/store';
import { useSelector, useDispatch } from 'react-redux';

const Pricing: NextPage = () => {
  const reduxDarkMode = useSelector((state: RootState) => state.darkMode.darkModeOn)

  return (
    <div style={{ backgroundColor: reduxDarkMode ? "#222" : "white", color: reduxDarkMode ? "white" : "#222" }} className="flex w-full h-auto flex-col">

        <Head>
            <title>Vrün | Nodes & Staking</title>
            <meta
                content=" Embrace True Ownership with Vrün: Non-Custodial Ethereum Staking for Forward-Thinking Node Operators."
                name="Vrün  | Nodes & Staking"

            />


            <link href="/favicon.ico" rel="icon" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Catamaran:wght@700&family=Figtree:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Orbitron:wght@400;500;600;700;800;900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,700;0,800;1,400;1,500&family=Roboto:wght@100;300;400;500;700&display=swap" rel="stylesheet" />
        </Head>

        <Navbar />

        {/* TODO add pricing content */}

        <div className="w-full h-auto py-1 flex flex-col justify-center items-center gap-2 ">

            <div className="flex flex-col justify-start items-start gap-4 w-[95%] lg:min-h-[92vh] p-4">
                <h1 className="text-2xl md:text-4xl self-center my-3 font-bold">Vrün Pricing</h1>

                <div>
                    <h2 className="text-2xl font-bold mb-2">Why Choose Vrün?</h2>
                    <ul className="list-disc pl-6">
                        <li><span className="font-bold">Secure:</span> We prioritize the safety of your keys and validators.</li>
                        <li><span className="font-bold">Non-Custodial:</span> You maintain full control over your assets.</li>
                        <li><span className="font-bold">Easy Setup:</span> No hardware required, start staking quickly.</li>
                        <li><span className="font-bold">Affordable:</span> Cost-effective staking solutions.</li>
                        <li><span className="font-bold">Community-Built:</span> Developed by Rocket Pool community members, ensuring deep integration and support.</li>
                    </ul>
                </div>
            </div>



        </div>




        <Footer />
    </div>
)};

export default Pricing;