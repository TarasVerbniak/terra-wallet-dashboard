import { bech32 } from "bech32";
import { Fee, MsgSend, MsgExecuteContract } from "@terra-money/terra.js";
import {
  Timeout,
  TxFailed,
  UserDenied,
  CreateTxFailed,
  TxUnspecifiedError,
} from "@terra-money/wallet-provider";
import { splitBalanceText, amountToUSTAmount } from "./amount";
import { delay } from "./time";

const transformTransactions = (data, address) => {
  let transactions = [];

  try {
    transactions = data.reduce((acc, { logs, timestamp, txhash, chainId }) => {
      if (!logs || !logs.length) return acc;

      const date = timestamp.replace(/[A-Z]/g, " ");
      const txData = { txhash, chainId, date };
      const events = logs[0].events;
      const receiverInfo = events.find(({ type }) => type === "coin_received");
      const senderInfo = events.find(({ type }) => type === "coin_spent");
      const extendedReceiverInfo = [];
      const extendedSenderInfo = [];

      // transform data and combine amount and sender/receiver
      for (let i = 0; i < receiverInfo.attributes.length; i++) {
        const r = Object.values(receiverInfo.attributes[i]);
        const r1 = Object.values(receiverInfo.attributes[i + 1]);
        const s = Object.values(senderInfo.attributes[i]);
        const s1 = Object.values(senderInfo.attributes[i + 1]);

        const rChunks = splitBalanceText(r1[1]);
        const sChunks = splitBalanceText(s1[1]);

        extendedReceiverInfo.push({
          ...txData,
          address: r[1],
          type: "receive",
          amount: rChunks.amount,
          coin: rChunks.coin === "usd" ? "ust" : rChunks.coin,
        });
        extendedSenderInfo.push({
          ...txData,
          address: s[1],
          type: "spend",
          amount: sChunks.amount,
          coin: sChunks.coin === "usd" ? "ust" : rChunks.coin,
        });

        i += 1;
      }

      const mergedTransactions = [
        ...extendedReceiverInfo,
        ...extendedSenderInfo,
      ].filter((t) => t.address === address);

      return [...acc, ...mergedTransactions];
    }, []);
  } catch (error) {
    console.error(error);
  }

  return transactions;
};

export const fetchTransactions = async (address, maxTrns = 5) => {
  let transactions = [];

  try {
    const url = `https://bombay-fcd.terra.dev/v1/txs?offset=0&limit=10&account=${address}`;
    const response = await fetch(url);
    const data = await response.json();
    transactions = transformTransactions(data.txs, address).slice(0, maxTrns);
  } catch (error) {
    console.error(error);
  }

  return transactions;
};

export const checkIfAddressIsValid = (address) => {
  let valid = false;

  try {
    const { prefix: decodedPrefix } = bech32.decode(address);
    valid = decodedPrefix === "terra";
  } catch (error) {}

  return valid;
};

export const checkIfContract = async (lsd, address) => {
  let isContract = false;

  try {
    const info = await lsd.wasm.contractInfo(address);
    isContract = !!info.address;
  } catch (error) {}

  return isContract;
};

export const sendTransaction = async (wallet, lsd, address, amount) => {
  // for simplicity - just hardcode fee and gas
  // for timeout - we use it here for simplicity since it's a test project, for real life we should implement subscription to blockchain
  const TX_WAIT_TIME = 7000;
  const GAS_LIMIT = 1000000;
  const FEE_AMOUNT = "250000uusd";
  const result = { success: false, error: null, hash: null };

  try {
    const isContract = await checkIfContract(lsd, address);

    const ustAmount = { uusd: amountToUSTAmount(amount) };
    const toContractMsg = new MsgExecuteContract(
      wallet.connectedWallet.walletAddress,
      address,
      { deposit_stable: {} },
      ustAmount
    );
    const toAddressMsg = new MsgSend(
      wallet.connectedWallet.walletAddress,
      address,
      ustAmount
    );

    const msgs = [isContract ? toContractMsg : toAddressMsg];
    const fee = new Fee(GAS_LIMIT, FEE_AMOUNT);

    const tx = await wallet.connectedWallet.post({ fee, msgs });

    await delay(TX_WAIT_TIME);

    wallet.updateBalances();

    result.success = true;
    result.hash = tx.result.txhash;
  } catch (error) {
    let newTxError = "Something went wrong";
    if (error instanceof UserDenied) {
      newTxError = "User Denied";
    } else if (error instanceof CreateTxFailed) {
      newTxError = `Create Tx Failed: ${error.message}`;
    } else if (error instanceof TxFailed) {
      newTxError = `Tx Failed: ${error.message}`;
    } else if (error instanceof Timeout) {
      newTxError = "Timeout";
    } else if (error instanceof TxUnspecifiedError) {
      newTxError = `Unspecified Error: ${error.message}`;
    }

    result.success = false;
    result.error = newTxError;
  }

  return result;
};
