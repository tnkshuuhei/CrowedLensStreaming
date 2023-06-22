import { ConnectWallet } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className="">
      <h2 className="">Hi Thirdweb</h2>
      <ConnectWallet />
    </div>
  );
};

export default Home;
