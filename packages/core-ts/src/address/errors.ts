export class AddressParseError extends Error {
  constructor(message: string, public readonly address?: string) {
    super(message);
    this.name = 'AddressParseError';
    Object.setPrototypeOf(this, AddressParseError.prototype);
  }
}
