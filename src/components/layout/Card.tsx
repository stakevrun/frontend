import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={`group m-4 p-6 text-left text-inherit no-underline border border-slate-200 dark:border-none rounded-lg transition-colors duration-150 ease-in-out hover:bg-slate-100/60 dark:bg-slate-800 dark:hover:bg-slate-700/60 active:border-sky-500 ${className}`}
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
      <h2 className={`font-bold my-3 ${className}`}>{title}</h2>
      <p className="my-2 text-sm dark:text-slate-300">{description}</p>
    </div>
  );
};

export const CardIcon = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={`inline-flex flex-shrink-8 items-center justify-center h-16 w-16 bg-blue-100 dark:bg-slate-600 rounded-full mr-6 ${className}`}
    >
      {children}
    </div>
  );
};
