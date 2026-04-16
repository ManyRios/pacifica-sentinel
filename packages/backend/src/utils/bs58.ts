const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const ALPHABET_MAP: { [key: string]: number } = {};

for (let i = 0; i < ALPHABET.length; i++) {
  ALPHABET_MAP[ALPHABET[i]] = i;
}

export const decodeBase58 = (input: string): Uint8Array => {
  if (input.length === 0) return new Uint8Array(0);

  const bytes = [0];

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    let value = ALPHABET_MAP[char];

    if (value === undefined) {
      throw new Error(`Invalid Base58 character detected: "${char}"`);
    }

    for (let j = 0; j < bytes.length; j++) {
      value += bytes[j] * 58;
      bytes[j] = value % 256;
      value = Math.floor(value / 256);
    }

    while (value > 0) {
      bytes.push(value % 256);
      value = Math.floor(value / 256);
    }
  }
  for (let i = 0; i < input.length && input[i] === '1'; i++) {
    bytes.push(0);
  }

  return new Uint8Array(bytes.reverse());
};