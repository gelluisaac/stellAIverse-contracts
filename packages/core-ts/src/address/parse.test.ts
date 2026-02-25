import { parse } from './parse';
import { AddressParseError } from './errors';

describe('parse()', () => {
  describe('G addresses (Ed25519 public keys)', () => {
    it('should parse a valid G address', () => {
      const validGAddress = 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H';
      const result = parse(validGAddress);
      
      expect(result).toEqual({
        kind: 'G',
        address: validGAddress
      });
      expect(result.baseG).toBeUndefined();
      expect(result.muxedId).toBeUndefined();
    });

    it('should parse another valid G address', () => {
      const validGAddress = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF';
      const result = parse(validGAddress);
      
      expect(result.kind).toBe('G');
      expect(result.address).toBe(validGAddress);
    });
  });

  describe('M addresses (Muxed accounts)', () => {
    it('should parse a valid M address and populate baseG and muxedId', () => {
      const validMAddress = 'MAAAAAAAAAAAAAB7BQ2L7E5NBWMXDUCMZSIPOBKRDSBYVLMXGSSKF6YNPIB7Y77ITKNOG';
      const result = parse(validMAddress);
      
      expect(result.kind).toBe('M');
      expect(result.address).toBe(validMAddress);
      expect(result.baseG).toBeDefined();
      expect(result.baseG).toMatch(/^G/);
      expect(result.muxedId).toBeDefined();
      expect(typeof result.muxedId).toBe('bigint');
    });

    it('should correctly decode muxedId as bigint', () => {
      const validMAddress = 'MAAAAAAAAAAAAAB7BQ2L7E5NBWMXDUCMZSIPOBKRDSBYVLMXGSSKF6YNPIB7Y77ITKNOG';
      const result = parse(validMAddress);
      
      expect(result.muxedId).toBeGreaterThanOrEqual(0n);
      expect(typeof result.muxedId).toBe('bigint');
    });

    it('should parse M address with different muxedId', () => {
      const validMAddress = 'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJUAAAAAAAAAAAACJUQ';
      const result = parse(validMAddress);
      
      expect(result.kind).toBe('M');
      expect(result.baseG).toBeDefined();
      expect(result.muxedId).toBeDefined();
      expect(typeof result.muxedId).toBe('bigint');
    });
  });

  describe('C addresses (Contract addresses)', () => {
    it('should parse a valid C address', () => {
      const validCAddress = 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4';
      const result = parse(validCAddress);
      
      expect(result).toEqual({
        kind: 'C',
        address: validCAddress
      });
      expect(result.baseG).toBeUndefined();
      expect(result.muxedId).toBeUndefined();
    });

    it('should parse another valid C address', () => {
      const validCAddress = 'CBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H';
      const result = parse(validCAddress);
      
      expect(result.kind).toBe('C');
      expect(result.address).toBe(validCAddress);
    });
  });

  describe('Error cases', () => {
    it('should throw AddressParseError for empty string', () => {
      expect(() => parse('')).toThrow(AddressParseError);
      expect(() => parse('')).toThrow('Address must be a non-empty string');
    });

    it('should throw AddressParseError for null input', () => {
      expect(() => parse(null as any)).toThrow(AddressParseError);
      expect(() => parse(null as any)).toThrow('Address must be a non-empty string');
    });

    it('should throw AddressParseError for undefined input', () => {
      expect(() => parse(undefined as any)).toThrow(AddressParseError);
      expect(() => parse(undefined as any)).toThrow('Address must be a non-empty string');
    });

    it('should throw AddressParseError for non-string input', () => {
      expect(() => parse(123 as any)).toThrow(AddressParseError);
      expect(() => parse({} as any)).toThrow(AddressParseError);
      expect(() => parse([] as any)).toThrow(AddressParseError);
    });

    it('should throw AddressParseError for invalid prefix', () => {
      expect(() => parse('XBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H')).toThrow(AddressParseError);
      expect(() => parse('XBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H')).toThrow('must start with G, M, or C');
    });

    it('should throw AddressParseError for invalid G address', () => {
      expect(() => parse('GINVALIDADDRESS')).toThrow(AddressParseError);
      expect(() => parse('GINVALIDADDRESS')).toThrow('failed validation');
    });

    it('should throw AddressParseError for invalid M address', () => {
      expect(() => parse('MINVALIDADDRESS')).toThrow(AddressParseError);
      expect(() => parse('MINVALIDADDRESS')).toThrow('failed validation');
    });

    it('should throw AddressParseError for invalid C address', () => {
      expect(() => parse('CINVALIDADDRESS')).toThrow(AddressParseError);
      expect(() => parse('CINVALIDADDRESS')).toThrow('failed validation');
    });

    it('should throw AddressParseError with address in error object', () => {
      const invalidAddress = 'GINVALID';
      try {
        parse(invalidAddress);
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AddressParseError);
        expect((error as AddressParseError).address).toBe(invalidAddress);
      }
    });

    it('should throw AddressParseError for malformed checksum', () => {
      const badChecksum = 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2X';
      expect(() => parse(badChecksum)).toThrow(AddressParseError);
    });
  });

  describe('Edge cases', () => {
    it('should handle whitespace-only string', () => {
      expect(() => parse('   ')).toThrow(AddressParseError);
    });

    it('should not trim valid addresses with leading/trailing spaces', () => {
      const addressWithSpaces = ' GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H ';
      expect(() => parse(addressWithSpaces)).toThrow(AddressParseError);
    });

    it('should handle lowercase addresses', () => {
      const lowercase = 'gbrpyhil2ci3fnq4bxlfmndlfjunpu2hy3zmfshonuceoasw7qc7ox2h';
      expect(() => parse(lowercase)).toThrow(AddressParseError);
    });
  });
});
