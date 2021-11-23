import { CurrencyAggregate } from "../domain";
import Currency from "../infrastructure/schema/currency.schema";

export class GetCurrenciesService {
  public async findAll(): Promise<CurrencyAggregate[] | null> {
    const currencies: CurrencyAggregate[] = await Currency.find();
    return currencies;
  }
}
