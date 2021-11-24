import { CurrencyHistoryAggregate } from "../domain";
import CurrencyHistory from "../infrastructure/schema/currency-history.schema";

export class GetCurrencyHistoryService {
  public async findByCode(
    code: string
  ): Promise<CurrencyHistoryAggregate | null> {
    const currencyHistory: CurrencyHistoryAggregate =
      await CurrencyHistory.findOne({ code: code });

    return currencyHistory;
  }
}
