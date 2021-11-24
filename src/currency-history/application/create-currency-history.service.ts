import { getCurrencyExchangeByCode } from "../../currency/application";
import CurrencyHistory from "../infrastructure/schema/currency-history.schema";

export class CreateCurrencyHistoryService {
  public async add(code: string): Promise<void> {
    const exchangeValues = await getCurrencyExchangeByCode(code);

    const dateParsed =
      exchangeValues.data["Realtime Currency Exchange Rate"]["6. Last Refreshed"];
    const bidParsed =
      exchangeValues.data["Realtime Currency Exchange Rate"]["8. Bid Price"];
    const askParsed =
      exchangeValues.data["Realtime Currency Exchange Rate"]["9. Ask Price"];
    const spread =
      Math.round(
        (this.calculateSpread(bidParsed, askParsed) + Number.EPSILON) * 10000
      ) / 10000;
    const newCurrencyHistory = new CurrencyHistory({
      code: code,
      values: {
        bid: bidParsed,
        ask: askParsed,
        spread: spread,
        date: dateParsed,
        bidDiff: 0,
        askDiff: 0,
        spreadDiff: 0,
      },
    });
    await newCurrencyHistory.save();
  }

  calculateSpread(bid: number, ask: number): number {
    return ask - bid;
  }
}
