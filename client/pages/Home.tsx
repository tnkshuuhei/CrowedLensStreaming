import React, { useState, useEffect } from "react";
import { useStateContext } from "../context";
import Layout from "../components/Layout";

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const { address, contract, getCampaigns } = useStateContext();
  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const data = await getCampaigns();
      setCampaigns(data);
      setIsLoading(false);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };
  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [contract, address]);
  return (
    <Layout>
      <div>Home</div>
    </Layout>
  );
}

export default Home;
