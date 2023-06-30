import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import { StateContextProvider } from "../context";

// import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { LensProvider, LensConfig, production } from "@lens-protocol/react-web";
import { bindings as wagmiBindings } from "@lens-protocol/wagmi";

const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: production,
};

const activeChain = "goerli";

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
