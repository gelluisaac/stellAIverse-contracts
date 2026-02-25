import { StrKey } from 'stellar-sdk';

export interface MuxedAddressData {
  baseG: string;
  muxedId: bigint;
}

export function decodeMuxed(mAddress: string): MuxedAddressData {
  const decoded = StrKey.decodeMed25519PublicKey(mAddress);
  
  const ed25519 = decoded.slice(0, 32);
  const idBytes = decoded.slice(32, 40);
  
  const baseG = StrKey.encodeEd25519PublicKey(ed25519);
  
  let muxedId = 0n;
  for (let i = 0; i < idBytes.length; i++) {
    muxedId = (muxedId << 8n) | BigInt(idBytes[i]);
  }
  
  return { baseG, muxedId };
}
