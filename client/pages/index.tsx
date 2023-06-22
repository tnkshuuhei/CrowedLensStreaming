import { ConnectWallet } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import Sidebar from "../components/Sidebar";

const Home: NextPage = () => {
  return (
    <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar />
      </div>
    </div>
  );
};

export default Home;
