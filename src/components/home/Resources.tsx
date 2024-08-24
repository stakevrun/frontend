import Link from "next/link";
import Image from "next/image";
import { Button } from "@headlessui/react";
import { FaMoneyBillWave, FaGithub, FaEthereum, FaLongArrowAltRight} from "react-icons/fa";
import { Card, CardIcon, CardContent } from "../layout/Card";

const Resources = () => {
  return (
    <div className="h-auto w-full flex flex-col gap-[10vh] py-[10vh] justify-center items-center bg-violet-500">
      <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl max-w-[80%] font-bold text-white">
        Resources & Documentation
      </h2>

      <div className="mx-auto h-auto w-[90%] lg:w-auto rounded-[30px] bg-slate-900 p-3 lg:p-5 shadow-2xl lg:h-[40rem] lg:max-w-5xl">
        <div className="grid h-full w-full grid-cols-1 gap-4 overflow-hidden rounded-2xl bg-vrun-neutral-1 dark:bg-slate-900">
          <div className="flex flex-col items-center justify-center max-w-3xl w-full sm:flex-row sm:flex-wrap">
            <Link href="/account">
              <Card>
                <CardIcon>
                  <FaMoneyBillWave className="text-3xl text-green-500  w-[70px]" />
                </CardIcon>
                <CardContent
                  title="Stake RPL for your Minipools"
                  description="We provide an onsite service for staking your RPL."
                ></CardContent>
                <span className="text-sky-600 font-semibold">Stake RPL</span>
                <FaLongArrowAltRight className="inline ml-2 text-sky-600"/>
              </Card>
            </Link>

            <Link href="/faq">
              <Card>
                <CardIcon>
                  <FaEthereum className="text-4xl text-blue-500  w-[70px]" />
                </CardIcon>
                <CardContent
                  title="New to Validators & Staking?"
                  description="Learn how Vrün interacts with Ethereum and the beacon chain."
                ></CardContent>
                <span className="text-sky-600 font-semibold">Learn More</span>
                <FaLongArrowAltRight className="inline ml-2 text-sky-600"/>
              </Card>
            </Link>

            <a
              href="https://docs.rocketpool.net/overview/contracts-integrations"
              target="_blank"
              className="lg:self-start mt-3"
            >
              <Card>
                <CardIcon>
                  <Image
                    width={45}
                    height={45}
                    alt="Rocket Pool Logo"
                    src={"/images/rocketPlogo.png"}
                  />
                </CardIcon>
                <CardContent
                  title="Rocket Pool Docs"
                  description="Learn about the under the hood functions that help to power Vrün."
                ></CardContent>
                <span className="text-sky-600 font-semibold">Go to Docs</span>
                <FaLongArrowAltRight className="inline ml-2 text-sky-600"/>
              </Card>
            </a>

            <a
              href="https://github.com/stakevrun/db"
              target="_blank"
              className="lg:self-start mt-3"
            >
              <Card>
                <CardIcon>
                  <FaGithub className="text-yellow-500 text-4xl" />
                </CardIcon>
                <CardContent
                  title="Vrün GitHub documentation"
                  description="Find in-depth information and routes for our API."
                ></CardContent>
                <span className="text-sky-600 font-semibold">Go to GitHub</span>
                <FaLongArrowAltRight className="inline ml-2 text-sky-600"/>
              </Card>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
