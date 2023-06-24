import { ConnectWallet } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Home: NextPage = () => {
  return (
    <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar />
      </div>
      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <Navbar />
      </div>
    </div>
  );
};

export default Home;
