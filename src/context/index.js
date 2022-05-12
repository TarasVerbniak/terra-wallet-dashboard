import { useEffect, useState, createContext } from "react";
import {
  useWallet,
  WalletStatus,
  useLCDClient,
  useConnectedWallet,
} from "@terra-money/wallet-provider";
import { parseBalanceString, fetchTransactions } from "../helpers";

export const WalletContext = createContext();

export const WalletContextProvider = ({ children }) => {
  const MAX_DISPLAYED_TRANSACTIONS = 5;

  const [ustBalance, setUstBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const lcd = useLCDClient();
  const { status } = useWallet();
  const connectedWallet = useConnectedWallet();
  const connected = status === WalletStatus.WALLET_CONNECTED;

  const updateBalances = () => {
    if (connectedWallet) {
      const balancePromise = lcd.bank.balance(connectedWallet.walletAddress);
      const txPromise = fetchTransactions(
        connectedWallet.walletAddress,
        MAX_DISPLAYED_TRANSACTIONS
      );

      Promise.all([balancePromise, txPromise])
        .then(([[coins], txns]) => {
          const ustBalanceString = coins?._coins?.uusd?.toData?.()?.amount;
          const parsedBalance = parseBalanceString(ustBalanceString);

          setUstBalance(parsedBalance);
          setTransactions(txns);
        })
        .catch(console.error);
    } else {
      setUstBalance(null);
      setTransactions([]);
    }
  };

  useEffect(() => {
    updateBalances();
  }, [connectedWallet]);

  const value = {
    connected,
    ustBalance,
    transactions,
    updateBalances,
    connectedWallet,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
