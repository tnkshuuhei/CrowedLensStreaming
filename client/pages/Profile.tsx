import React, { useState, useEffect } from "react";
import { useStateContext } from "../context";
import Layout from "../components/Layout";
import DisplayCampaigns from "../components/DisplayCampaigns";
import { NextPage } from "next";
const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const { address, contract, getUserCampaigns } = useStateContext();
  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const data = await getUserCampaigns();
      setCampaigns(data);
      setIsLoading(false);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <Layout>
      <DisplayCampaigns
        title="All Campaigns"
        isLoading={isLoading}
        campaigns={campaigns}
      />
    </Layout>
  );
};

export default Home;
