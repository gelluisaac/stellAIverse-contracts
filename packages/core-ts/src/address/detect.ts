import { AddressKind } from './types';

export function detect(address: string): AddressKind | null {
  if (!address || typeof address !== 'string') {
    return null;
  }

  const firstChar = address.charAt(0);
  
  if (firstChar === 'G') {
    return 'G';
  } else if (firstChar === 'M') {
    return 'M';
  } else if (firstChar === 'C') {
    return 'C';
  }
  
  return null;
}
