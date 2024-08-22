import { ReactNode, FC } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={`group m-4 p-6 text-left text-inherit no-underline border border-slate-200 rounded-lg transition-colors duration-150 ease-in-out hover:bg-slate-100 focus:border-blue-500 active:border-blue-500 max-w-[350px] ${className}`}
  
    >
      {children}
    </div>
  );
};

export const CardContent = ({
  title,
  description,
  className = "",
}: {
  title: string;
  description: string;
  className?: string;
}) => {
  return (
    <div>
      <h2 className={`font-bold text-slate-950 ${className}`}>{title}</h2>
      <p className="my-2 text-sm text-slate-800">{description}</p>
    </div>
  );
};

export const CardIcon = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={`inline-flex flex-shrink-8 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6 ${className}`}
    >
      {children}
    </div>
  );
};
