import axios from "axios";
import { errorHandler } from "./errorHandler.js";

export const convertCurrency = async (amount, from, to) => {
  const api_key = process.env.currency_converter_api_key;
  const url = `https://v6.exchangerate-api.com/v6/${api_key}/pair/${from}/${to}`;

  const { data } = await axios.get(url);

  if (!data || !data.conversion_rate)
    return next(errorHandler(401, "invalid currency data!!"));

  const rate = data.conversion_rate;
  const convertedAmount = amount * rate;

  return { convertedAmount, rate };
};
