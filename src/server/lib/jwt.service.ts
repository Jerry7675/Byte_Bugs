import jwt, { SignOptions } from 'jsonwebtoken';
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not defined');
const SECRET: string = process.env.JWT_SECRET;
const DEFAULT_EXPIRATION = '1h';

export interface JwtPayload {
  userId: string;
  role?: string;
  data?: Record<string, unknown>;
}

export class JwtService {
  /**
   * Sign a JWT token with payload
   * @param payload - data to encode in token
   * @param expiresIn - optional expiration string, default 1h
   */
  static sign(payload: JwtPayload, expiresIn: string = DEFAULT_EXPIRATION): string {
    const options: SignOptions = { expiresIn } as SignOptions;
    return jwt.sign(payload, SECRET, options);
  }

  /**
   * Verify a JWT token and return payload
   * Returns null if token is invalid or expired
   */
  static verify(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, SECRET) as JwtPayload;
    } catch {
      return null;
    }
  }
}
