import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link
  from 'next/link';
import { useAccount } from 'wagmi';
import Navbar from './components/navbar';
import { useEffect } from 'react';




const Home: NextPage = () => {

  const { address } = useAccount({
    onConnect: ({ address }) => {
      console.log("Ethereum Wallet Connected!")
    }
  })


  useEffect(() => {

    console.log(address)

  }, [address])








  return (
    <div className="flex w-full flex-col">

      <Head>
        <title>Vrün | Nodes & Staking</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="Vrün  | Nodes & Staking"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>


      <Navbar />




      <section className="mx-auto w-full max-w-7xl items-center justify-center gap-x-12  py-12 text-center md:flex md:flex-col md:py-0 lg:py-16" >

        <div className="relative flex h-[30rem] gap-y-5 items-center justify-center p-2 md:h-[40rem] lg:p-20">
          <div className="relative w-full py-20 md:py-40 ">
            <div className="mx-auto mb-44 max-w-5xl text-center">
              <div className="flex items-center flex-col justify-center gap-6">
                <h1 className='text-4xl  md:text-5xl  lg:text-6xl  xl:text-7xl '>
                  Welcome to Vrün!
                </h1>
                <div className="text-muted-foreground mx-auto max-w-lg pt-10 font-normal md:text-2xl" >
                Embrace True Ownership with Vrun: Non-Custodial Ethereum Staking for Forward-Thinking Node Operators.
                </div>

                <Link href="/createValidator">



                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" >
                    Create Validator
                  </button>




                </Link>


              </div>

            </div>


          {/*  <div className="mx-auto -mt-12 h-[25rem] w-full rounded-[30px] border-4 border-[#6C6C6C] bg-[#222222] p-6 shadow-2xl md:h-[40rem] lg:max-w-5xl">
              <div className="grid h-full w-full grid-cols-1 gap-4 overflow-hidden rounded-2xl bg-gray-100">
                <div className={styles.grid}>
                  <a className={styles.card} href="https://rainbowkit.com">
                    <h2>RainbowKit Documentation &rarr;</h2>
                    <p>Learn how to customize your wallet connection flow.</p>
                  </a>

                  <a className={styles.card} href="https://wagmi.sh">
                    <h2>wagmi Documentation &rarr;</h2>
                    <p>Learn how to interact with Ethereum.</p>
                  </a>

                  <a
                    className={styles.card}
                    href="https://github.com/rainbow-me/rainbowkit/tree/main/examples"
                  >
                    <h2>RainbowKit Examples &rarr;</h2>
                    <p>Discover boilerplate example RainbowKit projects.</p>
                  </a>

                  <a className={styles.card} href="https://nextjs.org/docs">
                    <h2>Next.js Documentation &rarr;</h2>
                    <p>Find in-depth information about Next.js features and API.</p>
                  </a>

                  <a
                    className={styles.card}
                    href="https://github.com/vercel/next.js/tree/canary/examples"
                  >
                    <h2>Next.js Examples &rarr;</h2>
                    <p>Discover and deploy boilerplate example Next.js projects.</p>
                  </a>

                  <a
                    className={styles.card}
                    href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                  >
                    <h2>Deploy &rarr;</h2>
                    <p>
                      Instantly deploy your Next.js site to a public URL with Vercel.
                    </p>
                  </a>
                </div>
              </div>
            </div>*/}





          </div>
        </div>



      </section>
   {/*   <div className='w-full flex items-center justify-center '>

        <div className="max-w-screen-xl w-full  px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold sm:text-4xl">What makes us special</h2>

            <p className="mt-4 text-gray-300">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat dolores iure fugit totam
              iste obcaecati. Consequatur ipsa quod ipsum sequi culpa delectus, cumque id tenetur
              quibusdam, quos fuga minima.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
            <div className="flex items-start gap-4">
              <span className="shrink-0 rounded-lg bg-gray-800 p-4">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path>
                </svg>
              </span>

              <div>
                <h2 className="text-lg font-bold">Lorem, ipsum dolor.</h2>

                <p className="mt-1 text-sm text-gray-300">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Error cumque tempore est ab
                  possimus quisquam reiciendis tempora animi! Quaerat, saepe?
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="shrink-0 rounded-lg bg-gray-800 p-4">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path>
                </svg>
              </span>

              <div>
                <h2 className="text-lg font-bold">Lorem, ipsum dolor.</h2>

                <p className="mt-1 text-sm text-gray-300">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Error cumque tempore est ab
                  possimus quisquam reiciendis tempora animi! Quaerat, saepe?
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="shrink-0 rounded-lg bg-gray-800 p-4">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path>
                </svg>
              </span>

              <div>
                <h2 className="text-lg font-bold">Lorem, ipsum dolor.</h2>

                <p className="mt-1 text-sm text-gray-300">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Error cumque tempore est ab
                  possimus quisquam reiciendis tempora animi! Quaerat, saepe?
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="shrink-0 rounded-lg bg-gray-800 p-4">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path>
                </svg>
              </span>

              <div>
                <h2 className="text-lg font-bold">Lorem, ipsum dolor.</h2>

                <p className="mt-1 text-sm text-gray-300">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Error cumque tempore est ab
                  possimus quisquam reiciendis tempora animi! Quaerat, saepe?
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="shrink-0 rounded-lg bg-gray-800 p-4">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path>
                </svg>
              </span>

              <div>
                <h2 className="text-lg font-bold">Lorem, ipsum dolor.</h2>

                <p className="mt-1 text-sm text-gray-300">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Error cumque tempore est ab
                  possimus quisquam reiciendis tempora animi! Quaerat, saepe?
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="shrink-0 rounded-lg bg-gray-800 p-4">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path>
                </svg>
              </span>

              <div>
                <h2 className="text-lg font-bold">Lorem, ipsum dolor.</h2>

                <p className="mt-1 text-sm text-gray-300">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Error cumque tempore est ab
                  possimus quisquam reiciendis tempora animi! Quaerat, saepe?
                </p>
              </div>
            </div>
          </div>
        </div>

  </div> */}

      {/*<div className="bg-blue-500 md:bg-green-500 lg:bg-red-500 xl:bg-yellow-500">
        This div will have different background colors based on screen size.
  </div> */}

      {/*<footer className={styles.footer}>
        <a href="https://rainbow.me" rel="noopener noreferrer" target="_blank">
          Made with ❤️ by your frens at 🌈
        </a>
  </footer> */}
    </div>
  );
};

export default Home;
