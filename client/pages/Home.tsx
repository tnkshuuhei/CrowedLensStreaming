"use client";
import React, { useState, useEffect } from "react";
import { useStateContext } from "../context";
import { Layout, DisplayCampaigns } from "../components";
import { NextPage } from "next";

const Home: NextPage = () => {
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
  }, [address, contract]);

  return (
    <Layout>
      {campaigns && campaigns.length > 0 ? (
        <DisplayCampaigns
          title="All Projects"
          isLoading={isLoading}
          campaigns={campaigns}
        />
      ) : (
        <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
          No campaigns to display
        </p>
      )}
    </Layout>
  );
};

export default Home;
