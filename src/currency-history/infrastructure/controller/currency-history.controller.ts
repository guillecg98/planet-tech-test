import {
  CreateCurrencyHistoryService,
  GetCurrencyHistoryService,
  UpdateCurrencyHistoryService,
} from "../../application";
import { CurrencyHistoryAggregate } from "../../domain";

export class CurrencyHistoryController {
  private getCurrencyHistoryService = new GetCurrencyHistoryService();
  private createCurrencyHistoryService = new CreateCurrencyHistoryService();
  private updateCurrencyHistoryService = new UpdateCurrencyHistoryService();

  async findHistoryByCode(
    code: string
  ): Promise<CurrencyHistoryAggregate | null> {
    try {
      return await this.getCurrencyHistoryService.findByCode(code);
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      } else {
        throw new Error("Server Error");
      }
    }
  }

  async createHistoryOf(code: string): Promise<void> {
    try {
      return await this.createCurrencyHistoryService.add(code);
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      } else {
        throw new Error("Server Error");
      }
    }
  }

  async updateHistoryOf(code: string): Promise<void> {
    try {
      return await this.updateCurrencyHistoryService.update(code);
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      } else {
        throw new Error("Server Error");
      }
    }
  }
}
