import { Request, Response, Router } from "express";
import cron from "node-cron";

import { CurrencyController } from "./currency";
import { CurrencyHistoryController } from "./currency-history";

const appRouter: Router = Router();

const currencyController = new CurrencyController();
const currencyHistoryController = new CurrencyHistoryController();

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

cron.schedule("*/5 * * * *", async () => {
  // ---- CRON GETTING FOLLOWED CURRENCIES EVERY 5 MINUTES
  const currencies = await currencyController.findAll();

  await Promise.all(
    currencies.map(async (currency) => {
      const currencyHistory = await currencyHistoryController.findHistoryByCode(
        currency.code
      );

      if (currencyHistory) {
        console.log("Updating history of...", currency.code);
        await currencyHistoryController.updateHistoryOf(currency.code);
      } else {
        console.log("Creating history of...", currency.code);
        await currencyHistoryController.createHistoryOf(currency.code);
      }
    })
  );
});

appRouter.get("/history/:code", async (req: Request, res: Response) => {
  const currencyHistory = await currencyHistoryController.findHistoryByCode(
    req.params.code
  );
  res.send(currencyHistory);
});

export default appRouter;
