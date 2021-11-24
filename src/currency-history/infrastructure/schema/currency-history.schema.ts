import { model, Schema } from "mongoose";

const CurrencyHistorySchema = new Schema({
  code: {
    type: String,
    required: true,
  },
  values: [
    {
      bid: Number,
      ask: Number,
      spread: Number,
      date: Date,
      bidDiff: Number,
      askDiff: Number,
      spreadDiff: Number,
    },
  ],
});

export default model("CurrencyHistory", CurrencyHistorySchema);
