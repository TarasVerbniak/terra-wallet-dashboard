export const shortenText = (text = "", chunkLength = 5) => {
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
