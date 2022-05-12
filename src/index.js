import React from "react";
import ReactDOM from "react-dom/client";
import { WalletProvider, getChainOptions } from "@terra-money/wallet-provider";
import App from "./components/App";
import "./index.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));

getChainOptions().then((chainOptions) => {
  root.render(
    <WalletProvider {...chainOptions}>
      <App />
    </WalletProvider>
  );
});
