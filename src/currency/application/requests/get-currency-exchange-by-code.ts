import axios from "axios";

export const getCurrencyExchangeByCode = async (code: string) => {
  try {
      const url = "https://www.alphavantage.co/query";
      return await axios.get(url, {
        params: {
          function: "CURRENCY_EXCHANGE_RATE",
          from_currency: code,
          to_currency: "EUR",
          apikey: process.env.API_KEY,
        },
      });
    } catch (e) {
      console.error(e);
    }
  };