import express from "express";
import mongoose from "mongoose";
import appRouter from "./app.router";
require("dotenv").config();

async function connectToDatabase(connectionUri: string) {
  return new Promise((resolve, reject) => {
    // From mongoose@6.x.x onwards useNewUrlParser, useUnifiedTopology,
    // useCreateIndex are deprecated and default to true
    mongoose
      .connect(connectionUri)
      .then(() => {
        console.log("Connected to DB");
        resolve(connectionUri);
      })
      .catch((error: any) => {
        console.log(error);
        reject(`${connectionUri}: ${error}`);
      });
  });
}
connectToDatabase(
  `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@127.0.0.1:27017/${process.env.DB_NAME}?authSource=admin`
);

const app = express();
const port = 3000;
app.use(express.json());
app.use(appRouter);

app.get("/health", async (req, res) => {
  res.status(200).json({ healthy: true });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
  console.log("Press Ctrl+C to quit.");
});
