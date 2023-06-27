import React, { useContext, createContext, useEffect } from "react";
import { ethers } from "ethers";
import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";

const StateContext = createContext<any>(null);

export const StateContextProvider = ({ children }: any) => {
  const { contract } = useContract(
    "0xbFb5cEDD9100a242860b10aC5020C02d86e91002"
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );

  const address: string | undefined = useAddress();
  const connect: any = useMetamask();
  const publishCampaign = async (form: any) => {
    try {
      if (!address) {
        alert("Please connect your wallet");
        return;
      } else {
        const data = await createCampaign({
          args: [
            address,
            form.title,
            form.description,
            form.target,
            new Date(form.deadline).getTime(),
            form.image,
          ],
        });
        console.log("contract call success", data);
      }
    } catch (error) {
      console.log("contract call failure", error);
    }
  };
  const getCampaigns = async () => {
    if (contract) {
      const campaigns = await contract.call("getCampaigns");
      const parsedCampaings = campaigns.map((campaign: any, i: number) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(
          campaign.amountCollected.toString()
        ),
        image: campaign.image,
        pId: i,
      }));

      return parsedCampaings;
    } else {
      console.log("contract is not defined");
    }
  };
  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();
    const filteredCampaigns = allCampaigns.filter(
      (campaign: any) => campaign.owner === address
    );
    return filteredCampaigns;
  };

  const donate = async (pId: any, amount: any) => {
    try {
      const data = await contract?.call("donateToCampaign", pId, {
        value: ethers.utils.parseEther(amount),
      });
      console.log("data", data);
      return data;
    } catch (error) {
      console.log("contract call failure", error);
    }
  };
  const getDonations = async (pId: any) => {
    const donations = await contract?.call("getDonators", pId);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        connect,
        contract,
        donate,
        getDonations,
        getCampaigns,
        getUserCampaigns,
        createCampaign: publishCampaign,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
