# Stellar Address Kit - Core TypeScript

Core TypeScript library for parsing and validating Stellar addresses.

## Installation

```bash
npm install @stellar-address-kit/core
```

## Usage

```typescript
import { parse, AddressParseError } from '@stellar-address-kit/core';

// Parse a G address (Ed25519 public key)
const gAddress = parse('GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H');
console.log(gAddress);
// {
//   kind: 'G',
//   address: 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H'
// }

// Parse an M address (Muxed account)
const mAddress = parse('MAAAAAAAAAAAAAB7BQ2L7E5NBWMXDUCMZSIPOBKRDSBYVLMXGSSKF6YNPIB7Y77ITKNOG');
console.log(mAddress);
// {
//   kind: 'M',
//   address: 'MAAAAAAAAAAAAAB7BQ2L7E5NBWMXDUCMZSIPOBKRDSBYVLMXGSSKF6YNPIB7Y77ITKNOG',
//   baseG: 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ',
//   muxedId: 123n
// }

// Parse a C address (Contract address)
const cAddress = parse('CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4');
console.log(cAddress);
// {
//   kind: 'C',
//   address: 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4'
// }

// Handle errors
try {
  parse('INVALID');
} catch (error) {
  if (error instanceof AddressParseError) {
    console.error(error.message);
    console.error(error.address); // 'INVALID'
  }
}
```

## API

### `parse(address: string): Address`

Parses a Stellar address string and returns a typed `Address` object.

**Parameters:**
- `address` - A Stellar address string (G, M, or C address)

**Returns:**
- `Address` object with the following properties:
  - `kind`: `'G' | 'M' | 'C'` - The type of address
  - `address`: `string` - The original address string
  - `baseG`: `string` (M addresses only) - The underlying G address
  - `muxedId`: `bigint` (M addresses only) - The muxed account ID

**Throws:**
- `AddressParseError` - If the address is invalid

### Other Exports

- `detect(address: string): AddressKind | null` - Detects the address type
- `validate(address: string, kind: AddressKind): boolean` - Validates an address
- `decodeMuxed(mAddress: string): { baseG: string, muxedId: bigint }` - Decodes a muxed address
- `AddressParseError` - Error class for parse failures
- `Address` - TypeScript interface for address objects
- `AddressKind` - Type alias for address kinds

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Watch mode
npm run test:watch
```

## Testing

The library includes comprehensive unit tests covering:
- Valid G, M, and C addresses
- Invalid address formats
- Edge cases (empty strings, null, undefined, etc.)
- Muxed address decoding with bigint muxedId
- Error handling with AddressParseError

Run tests with:
```bash
npm test
```
