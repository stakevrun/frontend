import type { NextPage } from "next";
import Hero from "../components/home/Hero";
import Resources from "../components/home/Resources";
import Values from "../components/home/Values";

const Home: NextPage = () => {
  return (
    <div className="w-full h-auto py-1 flex flex-col justify-center items-center gap-2 ">
      <Hero />
      <Resources />

      <div className="w-full h-auto py-7 flex items-center justify-center ">
        <div className="max-w-screen-xl w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Why stake with Vrün?
            </h2>

            <p className="mt-4 text-md leading-loose text-slate-600 dark:text-slate-400">
              Vrün is a premium validator management service built by experts in
              cryptography who are invested in the health of the Ethereum and
              Rocket Pool ecosystems.
            </p>
          </div>

          <Values />
        </div>
      </div>
    </div>
  );
};

export default Home;
