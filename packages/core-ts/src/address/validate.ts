import { StrKey } from 'stellar-sdk';
import { AddressKind } from './types';

export function validate(address: string, kind: AddressKind): boolean {
  if (!address || typeof address !== 'string') {
    return false;
  }

  try {
    switch (kind) {
      case 'G':
        return StrKey.isValidEd25519PublicKey(address);
      case 'M':
        return StrKey.isValidMed25519PublicKey(address);
      case 'C':
        return StrKey.isValidContract(address);
      default:
        return false;
    }
  } catch {
    return false;
  }
}
