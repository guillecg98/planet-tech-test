import { getCurrencyExchangeByCode } from "../../currency/application";
import { CurrencyHistoryAggregate, Values } from "../domain";
import CurrencyHistory from "../infrastructure/schema/currency-history.schema";

export class UpdateCurrencyHistoryService {
  public async update(code: string): Promise<void> {
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

    const historyWithMoreThanAnHour: CurrencyHistoryAggregate =
      await CurrencyHistory.findOne({
        code: code,
        "values.11": { $exists: true },
      });

    if(historyWithMoreThanAnHour) {
      const lastHourValues = historyWithMoreThanAnHour.values.slice(-12);

      const updatedValues = this.getStats(
        bidParsed,
        askParsed,
        spread,
        dateParsed,
        lastHourValues
      );

      await CurrencyHistory.findOneAndUpdate(
        { code: code },
        {
          $push: {
            values: {
              bid: updatedValues.bid,
              ask: updatedValues.ask,
              spread: updatedValues.spread,
              date: updatedValues.date,
              bidDiff: updatedValues.bidDiff,
              askDiff: updatedValues.askDiff,
              spreadDiff: updatedValues.spreadDiff,
            },
          },
        }
      );
    } else {
      await CurrencyHistory.findOneAndUpdate(
        { code: code },
        {
          $push: {
            values: {
              bid: bidParsed,
              ask: askParsed,
              spread: spread,
              date: dateParsed,
              bidDiff: 0,
              askDiff: 0,
              spreadDiff: 0,
            },
          },
        }
      );
    }

  }

  getStats(
    bid: number,
    ask: number,
    spread: number,
    date: Date,
    lastHourValues: Values[]
  ) {
    const meanHourBid =
      lastHourValues.reduce((prev, curr) => prev + curr.bid, 0) / 12;
    const meanHourAsk =
      lastHourValues.reduce((prev, curr) => prev + curr.ask, 0) / 12;
    const meanHourSpread =
      lastHourValues.reduce((prev, curr) => prev + curr.spread, 0) / 12;

    const calculatedValues: Values = {
      bid: bid,
      ask: ask,
      spread: spread,
      date: date,
      bidDiff: Math.round( ((bid - meanHourBid) + Number.EPSILON) * 10000) / 10000,
      askDiff: Math.round( ((ask - meanHourAsk) + Number.EPSILON) * 10000) / 10000,
      spreadDiff: Math.round( ((spread - meanHourSpread) + Number.EPSILON) * 10000) / 10000,
    };

    return calculatedValues;
  }

  calculateSpread(bid: number, ask: number): number {
    return ask - bid;
  }
}
