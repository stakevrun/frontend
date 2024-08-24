import Image from "next/image";
import Link from "next/link";
import { Button } from "@headlessui/react";
import { FaDiscord } from "react-icons/fa";

const Hero = () => {
  return (
    <div className="h-auto py-24 sm:py-36 lg:py-40 w-[75%] flex flex-col-reverse justify-center items-center xl:flex-row">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-2 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(36% 6%, 48% 62%, 94% 10%, 68% 57%, 92% 100%, 25% 18%, 18% 95%, 4% 6%, 16% 56%)",
          }}
          className="aspect-[1108/632] w-[80rem] flex-none bg-gradient-to-r from-sky-700 to-sky-200 opacity-35"
        />
      </div>
      <div className="w-full flex h-full items-center flex-col justify-center xl:items-end p-4 gap-8 lg:w-[70%] xl:w-[50%] ">
        <h1 className="bg-clip-text text-transparent bg-gradient-to-r dark:from-sky-500 dark:via-vrun-2 dark:to-vrun-neutral-1 from-vrun-6 via-vrun-3 to-vrun-4 text-4xl self-center text-center md:text-5xl lg:text-6xl xl:text-7xl xl:self-start xl:text-left font-bold">
          Welcome to Vrün
        </h1>

        <p className="w-[80%] text-md text-sky-950 dark:text-sky-300/90 font-light text-center xl:text-left md:text-lg self-center lg:text-xl xl:text-2xl xl:leading-relaxed xl:self-start">
          Embrace true ownership with Vrün: non-custodial Ethereum staking for
          forward-thinking node operators.
        </p>

        <Link href="/validators" className=" self-center xl:self-start">
          <Button className="btn-primary">Get Started</Button>
        </Link>

        <a
          href="https://discord.gg/eUhuZfnyVr"
          target="_blank"
          className="lg:text-2xl self-center xl:self-start gap-2 font-bold  flex items-center text-amber-500 hover:text-amber-600 dark:hover:text-amber-400"
        >
          <FaDiscord /> <span>join our Discord server!</span>
        </a>
      </div>

      <div className=" h-[200px] w-[200px] flex flex-col p-6 items-center justify-center lg:ml-[20px] xl:h-[400px] xl:w-[400px]">
        <Image
          src="/images/vrunlogo.png"
          alt="Vrun logo"
          width={400}
          height={400}
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default Hero;
