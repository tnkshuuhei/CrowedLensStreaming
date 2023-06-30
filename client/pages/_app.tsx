import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import { StateContextProvider } from "../context";
import { LensProvider, LensConfig, production } from "@lens-protocol/react-web";
import { bindings as wagmiBindings } from "@lens-protocol/wagmi";
import { disableFragmentWarnings } from "graphql-tag";

disableFragmentWarnings();
const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: production,
};

const activeChain = "mumbai";
// const activeChain = "goerli";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LensProvider config={lensConfig}>
      <ThirdwebProvider activeChain={activeChain}>
        <StateContextProvider>
          <Component {...pageProps} />
        </StateContextProvider>
      </ThirdwebProvider>
    </LensProvider>
  );
}

export default MyApp;
