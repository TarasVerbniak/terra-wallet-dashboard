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

export const amountToUSTAmount = (amount = 0) => {
  let result = amount;

  try {
    const DENOMINATOR = 1000000;
    result = amount * DENOMINATOR;
  } catch (error) {
    console.error(error);
  }

  return result;
};
