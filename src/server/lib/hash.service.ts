import crypto from 'crypto';

export function hashString(input: string, salt: string): string {
  const hash = crypto.createHmac('sha256', salt);
  hash.update(input);
  return hash.digest('hex');
}
export function generateSalt(length: number = 16): string {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}
