import { CurrencyAggregate, CurrencyAlreadyExistsError } from "../domain";
import Currency from "../infrastructure/schema/currency.schema";

export class AddCurrencyService {
  public async add(currency: CurrencyAggregate): Promise<CurrencyAggregate> {
    const currencyModel = new Currency({
      name: currency.name,
      code: currency.code,
      createdAt: currency.createdAt,
    });

    // if (await currencyModel.findOne({ code: currency.code })) {
    //   console.debug("Encontrado !!!");
    //   throw new CurrencyAlreadyExistsError();
    // }

    await currencyModel.save();
    return currency;
  }
}
