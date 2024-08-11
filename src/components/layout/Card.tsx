export const CardTitle = () => {

};

export const CardContent = () => {

};

export const Card = ({ children, href, className = '' }) => (
  <a href={href} className={`m-4 p-6 text-left text-inherit no-underline border border-gray-200 rounded-lg transition-colors duration-150 ease-in-out hover:text-blue-500 hover:border-blue-500 focus:text-blue-500 focus:border-blue-500 active:text-blue-500 active:border-blue-500 max-w-[350px] ${className}`}>
    {children}
  </a>
);