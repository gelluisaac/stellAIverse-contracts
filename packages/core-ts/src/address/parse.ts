import { Address } from './types';
import { AddressParseError } from './errors';
import { detect } from './detect';
import { validate } from './validate';
import { decodeMuxed } from './decodeMuxed';

export function parse(address: string): Address {
  if (!address || typeof address !== 'string') {
    throw new AddressParseError('Address must be a non-empty string', address);
  }

  const kind = detect(address);
  
  if (!kind) {
    throw new AddressParseError(`Invalid address format: must start with G, M, or C`, address);
  }

  if (!validate(address, kind)) {
    throw new AddressParseError(`Invalid ${kind} address: failed validation`, address);
  }

  if (kind === 'M') {
    try {
      const { baseG, muxedId } = decodeMuxed(address);
      return {
        kind,
        address,
        baseG,
        muxedId
      };
    } catch (error) {
      throw new AddressParseError(
        `Failed to decode muxed address: ${error instanceof Error ? error.message : 'unknown error'}`,
        address
      );
    }
  }

  return {
    kind,
    address
  };
}
