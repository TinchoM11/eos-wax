const fetch = require("node-fetch"); // node only; not needed in browsers

// Endpoint fetch("https://realtime-mainnet.waxblock.io/api/v1/tokens"

const getTokensList = async () => {
  const url = `https://realtime-mainnet.waxblock.io/api/v1/tokens`;
  const tokensList = [];
  try {
    const response = await fetch(url);
    console.log("----- Get Tokens List -------");
    const tokens = await response.json();
    tokens.map((token) => {
      const contract = token.account;
      const symbol = token.symbol;
      const name = token.metadata.name;
      const decimals = token.supply.precision;
      const logoUri = token.metadata.logo ?? undefined;

      tokensList.push({
        contract,
        symbol,
        name,
        decimals,
        logoUri,
      });
    });
    console.log("tokensList", tokensList);
  } catch (error) {
    console.log("ERROR 5", JSON.stringify(error));
  }
};

getTokensList();
