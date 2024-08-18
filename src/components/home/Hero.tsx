import Image from "next/image";
import Link from "next/link";
import { Button } from "@headlessui/react";
import { FaDiscord } from "react-icons/fa";

const Hero = () => {
  return (
      <div className="h-auto w-[75%] flex flex-col-reverse justify-center items-center xl:h-[92vh] xl:flex-row">
        <div className="w-full flex h-full items-center flex-col justify-center xl:items-end p-4 gap-8 lg:w-[70%] xl:w-[50%] ">
          <h1 className="text-4xl self-center text-center md:text-5xl lg:text-6xl xl:text-7xl xl:self-start xl:text-left font-bold">
            Welcome to Vrün!
          </h1>

          <p className="text-md text-black-100 text-center xl:text-left md:text-lg self-center lg:text-xl  xl:text-2xl  lg:self-start ">
            Embrace True Ownership with Vrün: Non-Custodial Ethereum Staking for
            Forward-Thinking Node Operators.
          </p>

          <Link href="/validators" className=" self-center xl:self-start">
            <Button className="btn-primary">
              Get Started
            </Button>
          </Link>

          <a
            href="https://discord.gg/eUhuZfnyVr"
            target="_blank"
            className="lg:text-2xl self-center xl:self-start gap-2 font-bold  flex items-center hover:text-amber-600"
          >
            <FaDiscord /> <span>join our Discord server!</span>
          </a>
        </div>

        <div className=" h-[200px] w-[200px] flex flex-col p-6 items-center justify-center ml-[20px] xl:h-[400px] xl:w-[400px]">
          <Image
            src="/images/vrunlogo.png"
            alt="Vrun logo"
            width={400}
            height={400}
            className="rounded-full"
          />
        </div>
      </div>
  )
}

export default Hero;