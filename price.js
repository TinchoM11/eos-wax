const fetch = require("node-fetch");

const getTokenPrice = async (tokenSymbol, tokenContract) => {
  const url = `https://realtime-mainnet.waxblock.io/api/v1/tokens/${tokenSymbol}-wax-${tokenContract}`;
  try {
    const response = await fetch(url);
    console.log("----- Get Token Price -------");
    const token = await response.json();
    console.log("token", token);
    console.log(`Price of ${tokenSymbol} is: ${token.marketdata.price_usd}`);
  } catch (error) {
    console.log("ERROR 6", JSON.stringify(error));
  }
};

getTokenPrice("MPX", "microfinance");
getTokenPrice("VIBLU", "viblumovietv");
