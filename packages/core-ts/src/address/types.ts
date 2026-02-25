export type AddressKind = 'G' | 'M' | 'C';

export interface Address {
  kind: AddressKind;
  address: string;
  baseG?: string;
  muxedId?: bigint;
}
