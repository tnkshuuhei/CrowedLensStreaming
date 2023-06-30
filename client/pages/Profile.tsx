"use client";
import React, { useState, useEffect } from "react";
import { useStateContext } from "../context";
import { Layout, DisplayCampaigns } from "../components";
import { NextPage } from "next";
import { setEngine } from "crypto";

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [created, setCreated] = useState([]);
  const { address, contract, getCreatedCampaign, getUserCampaigns } =
    useStateContext();
  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const data = await getUserCampaigns();
      const data1 = await getCreatedCampaign();
      setCampaigns(data);
      setCreated(data1);
      setIsLoading(false);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, contract]);

  return (
    <Layout>
      {campaigns || created ? (
        <div>
          <DisplayCampaigns
            title="You'll recieve"
            isLoading={isLoading}
            campaigns={campaigns}
          />
          <DisplayCampaigns
            title="You created"
            isLoading={isLoading}
            campaigns={created}
          />
        </div>
      ) : (
        <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
          No Projects to display
        </p>
      )}
    </Layout>
  );
};

export default Home;
