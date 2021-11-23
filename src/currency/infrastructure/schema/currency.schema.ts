import { model, Schema } from "mongoose";

const CurrencySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
  },
});

export default model("Currency", CurrencySchema);
