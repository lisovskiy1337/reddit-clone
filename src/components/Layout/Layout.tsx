import React from "react";
import NavBar from "../NavBar/NavBar";

interface IProps {
  children: React.ReactNode;
}
const Layout: React.FC<IProps> = ({ children }) => {
  return (
    <>
      <NavBar />
      <main>{children}</main>
    </>
  );
};

export default Layout;
