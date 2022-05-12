import { bech32 } from "bech32";
import { splitBalanceText } from "./text";

const transformTransactions = (data, address) => {
  let transactions = [];

  try {
    transactions = data.reduce((acc, { logs, timestamp, txhash, chainId }) => {
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
