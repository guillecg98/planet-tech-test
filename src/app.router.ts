import { Request, Response, Router } from "express";
import cron from "node-cron";

import { getCurrencyExchangeByCode } from "./currency/application";
import { CurrencyAggregate } from "./currency/domain";
import { CurrencyController } from "./currency";

const appRouter: Router = Router();

const currencyController = new CurrencyController();

cron.schedule("*/1 * * * *", async () => {
  // ---- CRON GETTING FOLLOWED CURRENCIES EVERY 5 MINUTES
  const currencies = await currencyController.findAll();
  currencies.map((currency: CurrencyAggregate) => {
    getCurrencyExchangeByCode(currency.code)
      .then((res) => console.debug(res.data))
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
