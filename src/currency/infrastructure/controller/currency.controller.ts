import { Request, Response } from "express";

import {
  AddCurrencyService,
  GetCurrenciesService,
  GetCurrencyByCodeService,
  RemoveCurrencyService,
} from "../../application";
import { CurrencyAggregate } from "../../domain";

export class CurrencyController {
  private addCurrencyService = new AddCurrencyService();
  private getCurrencyByCodeService = new GetCurrencyByCodeService();
  private getCurrenciesService = new GetCurrenciesService();
  private removeCurrencieService = new RemoveCurrencyService();

  async add(name: string, code: string): Promise<CurrencyAggregate> {
    try {
      const currency = new CurrencyAggregate(name, code);
      return this.addCurrencyService.add(currency);
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      } else {
        throw new Error("Server Error");
      }
    }
  }

  async findAll(): Promise<CurrencyAggregate[] | null> {
    try {
      return await this.getCurrenciesService.findAll();
    } catch (e) {
      throw e;
    }
  }

  async findOneByCode(code: string): Promise<CurrencyAggregate | null> {
    try {
      return await this.getCurrencyByCodeService.findByCode(code);
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      } else {
        throw new Error("Server Error");
      }
    }
  }

  async remove(code: string): Promise<void> {
    try {
      return await this.removeCurrencieService.remove(code);
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      } else {
        throw new Error("Server Error");
      }
    }
  }
}
