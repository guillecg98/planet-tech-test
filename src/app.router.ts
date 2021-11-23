import { Request, Response, Router } from "express";
import cron from "node-cron";

import { getCurrencyExchangeByCode } from "./currency/application";
import { CurrencyAggregate } from "./currency/domain";
import { CurrencyController } from "./currency";
import CurrencyHistory from "./currency-history/infrastructure/schema/currency-history.schema";

const appRouter: Router = Router();

const currencyController = new CurrencyController();

cron.schedule("*/5 * * * *", async () => {
  // ---- CRON GETTING FOLLOWED CURRENCIES EVERY 5 MINUTES
  const currencies = await currencyController.findAll();
  currencies.map((currency: CurrencyAggregate) => {
    getCurrencyExchangeByCode(currency.code)
      .then((res) => {
        const newCurrencyHistory = new CurrencyHistory({
          code: res.data["Realtime Currency Exchange Rate"][
            "1. From_Currency Code"
          ],
          values: {
            bid: res.data["Realtime Currency Exchange Rate"]["8. Bid Price"],
            ask: res.data["Realtime Currency Exchange Rate"]["9. Ask Price"],
            date: res.data["Realtime Currency Exchange Rate"][
              "6. Last Refreshed"
            ],
          },
        });
        newCurrencyHistory.save();
      })
      .catch((e) => console.error(e));
  });
});

appRouter.post("/currency", async (req: Request, res: Response) => {
  const newCurrency = await currencyController.add(
    req.body.name,
    req.body.code
  );

  res.send(newCurrency);
});

appRouter.get("/currency", async (req: Request, res: Response) => {
  const currencies = await currencyController.findAll();
  res.send(currencies);
});

appRouter.get("/currency/:code", async (req: Request, res: Response) => {
  const currency = await currencyController.findOneByCode(req.params.code);
  res.send(currency);
});

appRouter.delete("/currency/:code", async (req: Request, res: Response) => {
  await currencyController.remove(req.params.code);
  res.send("Currency was removed");
});

export default appRouter;
