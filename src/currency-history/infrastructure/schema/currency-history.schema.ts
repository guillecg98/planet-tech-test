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
    },
  ],
});

export default model("CurrencyHistory", CurrencyHistorySchema);
