import React, { useContext, createContext } from "react";
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

  return (
    <StateContext.Provider
      value={{
        address,
        connect,
        contract,
        createCampaign: publishCampaign,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
