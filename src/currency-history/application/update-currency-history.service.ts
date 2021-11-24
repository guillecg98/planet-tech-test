import { getCurrencyExchangeByCode } from "../../currency/application";
import CurrencyHistory from "../infrastructure/schema/currency-history.schema";

export class UpdateCurrencyHistoryService {
  public async update(code: string): Promise<void> {
    const exchangeValues = await getCurrencyExchangeByCode(code);

    const dateParsed = exchangeValues.data["Realtime Currency Exchange Rate"]["6. Last Refreshed"];
    const bidParsed = exchangeValues.data["Realtime Currency Exchange Rate"]["8. Bid Price"];
    const askParsed = exchangeValues.data["Realtime Currency Exchange Rate"]["9. Ask Price"];
    const spread = this.calculateSpread(bidParsed, askParsed).toFixed(6);

    await CurrencyHistory.findOneAndUpdate(
      { code: code },
      {
        $push: {
          values: {
            date: dateParsed,
            bid: bidParsed,
            ask: askParsed,
            spread: spread,
          },
        },
      }
    );
  }

  calculateSpread(bid: number, ask: number): number {
    return ask - bid;
  }

  // calculateDiffs
}
