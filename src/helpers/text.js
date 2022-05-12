export const shortenAddress = (text = "", chunkLength = 5) => {
  let result = text;

  try {
    if (text.length) {
      result = `${text.slice(0, chunkLength)}...${text.slice(-chunkLength)}`;
    }
  } catch (error) {
    console.error(error);
  }

  return result;
};

export const parseBalanceString = (balanceString = "") => {
  let result = balanceString;

  try {
    if (balanceString.length) {
      const balanceNumbeer = parseInt(balanceString);
      if (!isNaN(balanceNumbeer)) {
        result = Math.floor(balanceNumbeer / 10000) / 100;
      }
    }
  } catch (error) {
    console.error(error);
  }

  return result;
};

export const splitBalanceText = (balanceString = "") => {
  let result = { amount: 0, coin: "" };

  try {
    if (balanceString.length) {
      const uIndex = balanceString.indexOf("u");
      result.coin = balanceString.slice(uIndex + 1);
      const balanceNumbeer = parseInt(balanceString.slice(0, uIndex));
      if (!isNaN(balanceNumbeer)) {
        result.amount = Math.floor(balanceNumbeer / 10000) / 100;
      }
    }
  } catch (error) {
    console.error(error);
  }

  return result;
};
