export class CurrencyAggregate {
  private _name: string;
  private _code: string;
  private _createdAt: Date;

  constructor(
    name: string,
    code: string,
  ) {
    this._name = name;
    this._code = code;
    this._createdAt = new Date();
  }

  get name(): string {
    return this._name;
  }

  get code(): string {
    return this._code;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
