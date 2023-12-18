const axios = require("axios");
const COIN_MARKET_CAP_API_KEY = "0da71c42-1fc3-4044-86ad-8d71143e8056";

export async function getCoinMarketCapTokenId(symbol) {
  const API_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map";
  try {
    const tokenData = await axios.get(API_URL, {
      headers: {
        "X-CMC_PRO_API_KEY": COIN_MARKET_CAP_API_KEY,
      },
    });
    const tokenId = tokenData.data.data.find(
      (token) => token.symbol === symbol
    ).id;
    return tokenId;
  } catch (error) {
    throw new Error("Error getting Token Id from CoinMarketCap");
  }
}

//getCoinMarketCapTokenId("FLOW");

export const getPriceFromCoinMarketCap = async (symbol) => {
  const id = await getCoinMarketCapTokenId(symbol);
  console.log("ID", id);
  const API_URL = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${id}`;
  try {
    const tokenData = await axios.get(API_URL, {
      headers: {
        "X-CMC_PRO_API_KEY": COIN_MARKET_CAP_API_KEY,
      },
    });
    const firstElement = Object.values(tokenData.data.data)[0];
    const unitPrice = firstElement.quote.USD.price.toFixed(6);
    console.log(unitPrice);
  } catch (error) {
    throw new Error("Error Token Price" + error);
  }
};
getPriceFromCoinMarketCap("FLOW")
