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
    try {
      const data = await contract?.call("getCampaigns");
      console.log("data", data);
      const parsedCapmaigns = data.map((campaign: any, i: number) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(
          campaign.amountCollected.toNumber()
        ),
        image: campaign.image,
        pId: i,
      }));
      console.log("parsedCapmaigns", parsedCapmaigns);
      return parsedCapmaigns;
    } catch (error) {
      console.log("contract call failure", error);
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
    try {
      const data = await contract?.call("getDonations", pId);

      const numberofDonations = data[0].length;
      const parsedDonations = [];
      for (let i = 0; i < numberofDonations; i++) {
        parsedDonations.push({
          donor: data[0][i],
          amount: ethers.utils.formatEther(data[1][i].toString()),
        });
      }
      return parsedDonations;
    } catch (error) {
      console.log("contract call failure", error);
    }
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
