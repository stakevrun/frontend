import Image from "next/image";
import { ReactNode } from "react";

import { VscActivateBreakpoints } from "react-icons/vsc";
import { ImPower } from "react-icons/im";
import { FaCoins, FaEthereum } from "react-icons/fa";
import { MdOnlinePrediction } from "react-icons/md";
import { BsSignStopFill } from "react-icons/bs";

type ValueItemProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

type Value = ValueItemProps & {};

const values: Value[] = [
  {
    icon: <VscActivateBreakpoints className="text-blue-300 text-2xl" />,
    title: "Secure and reliable",
    description: "Our redundant global network of beacon and execution layer nodes ensures high uptime, guaranteeing your staking operations remain consistently operational and efficient."
  },
  {
    icon: <ImPower className="text-yellow-600 text-2xl" />,
    title: "Secure Key and Validator Management",
    description: "Our non-custodial service prioritizes security, keeping your keys and validators safe with cutting-edge encryption and management protocols."
  },
  {
    icon: <FaCoins className="text-yellow-500 text-xl" />,
    title: "Non-Custodial Service",
    description: "Experience full control and ownership of your assets with our non-custodial staking solution. Your keys, your control, always."
  },
  {
    icon: (
      <svg
        aria-hidden="true"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="h-6 w-6 text-blue-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    title: "No Accounts Necessary",
    description: "Seamlessly sign in with your wallet. No need for traditional accounts, making the process swift and secure."
  },
  {
    icon: <FaEthereum className="text-2xl text-violet-500" />,
    title: "Affordable Staking Solutions",
    description: "Benefit from cost-effective staking without compromising on quality or security. Enjoy staking with competitive pricing."
  },
  {
    icon: <MdOnlinePrediction className="text-2xl text-blue-500" />,
    title: "Easy Setup, No Hardware Required",
    description: "Begin staking effortlessly. Our service eliminates the need for specialized hardware, providing a hassle-free setup experience."
  },
  {
    icon: <BsSignStopFill className="text-red-400 text-xl" />,
    title: "Full Control Over Your Validator Keys",
    description: "Maintain complete control over your validator keys. Stop or migrate your staking operations anytime, ensuring flexibility and autonomy."
  },
  {
    icon: <Image width={25} height={25} alt="Rocket Pool Logo" src="/images/rocketPlogo.png" />,
    title: "Built by the Rocket Pool Community",
    description: "Our service is crafted by members of the Rocket Pool community, ensuring deep integration and robust support within the ecosystem."
  }
];

const ValueItem = ({ icon, title, description }: ValueItemProps) => (
  <div className="flex items-start gap-4">
    <span className="shrink-0 rounded-lg bg-gray-800 p-4">
      {icon}
    </span>
    <div>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-1 text-md text-slate-500">{description}</p>
    </div>
  </div>
);

const Values = () => {
  return (
    <div className="mt-8 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
    {values.map((v, index) => (
      <ValueItem key={index} {...v} />
    ))}
  </div>
  );
};

export default Values;