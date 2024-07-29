import { FC, ReactNode } from "react";

import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

const Layout: FC<{children: ReactNode}> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default Layout;