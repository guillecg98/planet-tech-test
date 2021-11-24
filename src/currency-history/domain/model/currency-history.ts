export type Values = {
  bid: number;
  ask: number;
  spread: number;
  date: Date;
  bidDiff: number;
  askDiff: number;
  spreadDiff: number;
};

export class CurrencyHistoryAggregate {
  private _code: string;
  private _values: Values[];

  constructor(code: string, values: Values[]) {
    this._code = code;
    this._values = values;
  }

  get code(): string {
    return this._code;
  }

  get values(): Values[] {
    return this._values;
  }
}
