import React, { useState, useContext, createContext, useEffect } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import { BigNumber, ethers } from "ethers";
import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";
import { calculateFlowRate } from "../utils";
const ABI =
  require("../../web3/artifacts-zk/contracts/LensCrowdStreaming.sol/LensStreaming.json").abi;
// const contractaddress = "0x525EDDC2aD9C73977C547868e2F1C3Ce64A8Ecd1";
const contractaddress = "0x27873faEAbe978554f3b86d6fc9C94C68B25CfBE";
const StateContext = createContext<any>(null);

export const StateContextProvider = ({ children }: any) => {
  const { contract } = useContract(
    // "0xbFb5cEDD9100a242860b10aC5020C02d86e91002"
    contractaddress
  );
  const { mutateAsync: createProject } = useContractWrite(
    contract,
    "createProject"
  );
  const [address, setAddress] = useState("");
  // const address = "";
  // const address: string | undefined = useAddress();
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
        method: "eth_accounts",
      });

      setAddress(accounts[0]);
      console.log("Connected", accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      setAddress(accounts[0]);
      console.log("Found an authorized account:", address);
    } else {
      console.log("No authorized account found");
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
      console.log("typeof amount", typeof parsedAmount);
      const rate = calculateFlowRate(parsedAmount);
      console.log("flowrate", rate);
      console.log("typeof flowrate", typeof rate);

      const lenscontract = new ethers.Contract(contractaddress, ABI, provider);
      console.log(lenscontract);
      const ethx = await sf.loadSuperToken("ETHx");
      console.log(ethx);

      const aclApproval = ethx.updateFlowOperatorPermissions({
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
      //this flow rate is ~0.05 ethx/month
      await lenscontract
        .connect(signer)
        .createFlowIntoContract(id, ethx.address, rate, parsedAmount, {
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
        console.log(lenscontract);
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
						Congrats! You just successfully created a flow into the money router contract.
						Tx Hash: ${tx.hash}
						`);
          });
        console.log("contract call success", data);
      }
    } catch (error) {
      console.log("contract call failure", error);
    }
  };
  const getCampaigns = async () => {
    if (contract) {
      const projects = await contract.call("getProjects");
      const parsedProjects = projects.map((project: any, i: number) => ({
        owner: project.owner,
        recipient: project.recipient,
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
      console.log(parsedProjects);
      return parsedProjects;
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
    console.log("donations", donations);
    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        // donation: ethers.utils.formatEther(donations[1][i].toString()),
        donation: donations[1][i].toString(),
      });
    }
    console.log("parsedDonations", parsedDonations);
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
        getDonations,
        getCampaigns,
        getUserCampaigns,
        publishProject,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
