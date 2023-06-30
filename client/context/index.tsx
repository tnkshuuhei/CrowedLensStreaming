"use client";
import React, { useState, useContext, createContext, useEffect } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { useContract, useMetamask } from "@thirdweb-dev/react";
import { calculateFlowRate } from "../utils";
const ABI = require("../utils/LensStreaming.json").abi;
const contractaddress = "0x1727bc249Cd28B15C9C5cD4dbFee39DD1976eB63"; // mumbai
// const contractaddress = "0x27873faEAbe978554f3b86d6fc9C94C68B25CfBE"; // goerli
const StateContext = createContext<any>(null);

export const StateContextProvider = ({ children }: any) => {
  const { contract } = useContract(contractaddress);
  const [address, setAddress] = useState("");
  const connect: any = useMetamask();
  useEffect(() => {
    checkIfWalletIsConnected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAddress(accounts[0]);
      console.log("Connected", accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length !== 0) {
        setAddress(accounts[0]);
        console.log("Found an authorized account:", address);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const createFlow = async (id: any, amount: number) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      //this promps user to connect metamask
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const sf = await Framework.create({
        chainId: (await provider.getNetwork()).chainId,
        provider,
      });

      const parsedAmount = Number(amount);

      const rate = calculateFlowRate(parsedAmount);
      console.log("flowrate: ", rate);
      const lenscontract = new ethers.Contract(contractaddress, ABI, provider);
      const xToken = await sf.loadSuperToken("fDAIx");
      const aclApproval = xToken.updateFlowOperatorPermissions({
        flowOperator: lenscontract.address,
        flowRateAllowance: "3858024691358024", //10k tokens per month in flowRateAllowanace
        permissions: 7, //NOTE: this allows for full create, update, and delete permissions. Change this if you want more granular permissioning
      });
      await aclApproval.exec(signer).then(function (tx) {
        console.log(`
        Congrats! You've just successfully made the money router contract a flow operator. 
        Tx Hash: ${tx.hash}
    `);
      });
      //call money router create flow into contract method from signers[0]
      await lenscontract
        .connect(signer)
        .createFlowIntoContract(id, xToken.address, rate, parsedAmount, {
          gasLimit: 20000000,
        })
        .then(function (tx: any) {
          console.log(`
						Congrats! You just successfully created a flow into the money router contract.
						Tx Hash: ${tx.hash}
						`);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const withdraw = async (id: any, recipient: string, amount: number) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      //this promps user to connect metamask
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const sf = await Framework.create({
        chainId: (await provider.getNetwork()).chainId,
        provider,
      });

      const parsedAmount = Number(amount);
      const rate = calculateFlowRate(parsedAmount);
      const lenscontract = new ethers.Contract(contractaddress, ABI, provider);
      const xToken = await sf.loadSuperToken("fDAIx");
      await lenscontract
        .connect(signer)
        .createFlowFromContract(id, xToken.address, recipient, rate, {
          gasLimit: 20000000,
        })
        .then(function (tx: any) {
          console.log(`
						Congrats! You just successfully created a flow from the money router contract.
						Tx Hash: ${tx.hash}
						`);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const publishProject = async (form: any) => {
    try {
      if (!address) {
        alert("Please connect your wallet");
        return;
      } else {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []); // <- this promps user to connect metamask
        const signer = provider.getSigner();
        const lenscontract = new ethers.Contract(
          contractaddress,
          ABI,
          provider
        );

        const data = await lenscontract
          .connect(signer)
          .createProject(
            address,
            form.recipient,
            form.title,
            form.description,
            form.target,
            new Date(form.deadline).getTime(),
            form.image
          )
          .then(function (tx: any) {
            console.log(`
						Congrats! You just successfully created a new project!.
						Tx Hash: ${tx.hash}
						`);
          });
      }
    } catch (error) {
      console.log("contract call failure", error);
    }
  };
  const getCampaigns = async () => {
    if (contract) {
      const projects = await contract.call("getProjects");
      const parsedProjects = projects.map((project: any, i: number) => ({
        owner: project.owner.toLowerCase(),
        recipient: project.recipient.toLowerCase(),
        title: project.title,
        description: project.description,
        target: ethers.utils.formatEther(project.target.toString()),
        deadline: project.deadline.toNumber(),
        amountCollected: project.amountCollected.toString(),
        amountWithdrawn: ethers.utils.formatEther(
          project.amountWithdrawn.toString()
        ),
        image: project.image,
        pId: i,
      }));

      return parsedProjects;
    } else {
      console.log("contract is not defined");
    }
  };
  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter(
      (project: any) => project.recipient === address
    );
    return filteredCampaigns;
  };
  const getCreatedCampaign = async () => {
    const allCampaigns = await getCampaigns();
    const filteredCampaigns = allCampaigns.filter(
      (project: any) => project.owner === address
    );
    return filteredCampaigns;
  };
  const donate = async (pId: any, amount: any) => {
    try {
      const data = await contract?.call("donateToCampaign", pId, {
        value: ethers.utils.parseEther(amount),
      });
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
        donation: donations[1][i].toString(),
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
        connectWallet,
        createFlow,
        donate,
        withdraw,
        getDonations,
        getCampaigns,
        getCreatedCampaign,
        getUserCampaigns,
        publishProject,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
