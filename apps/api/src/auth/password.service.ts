import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

/** Hashes and checks account passwords. */
@Injectable()
export class PasswordService {
  /** Stores a password so it cannot be read back. */
  public async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }

  /** True when the plain password matches the stored hash. */
  public async matches(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
