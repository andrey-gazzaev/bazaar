import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { PublicUser, toPublicUser } from '../common/public-user';
import { rethrowPrisma } from '../common/prisma-error';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PasswordService } from './password.service';

/** Signed-in person and the token written into the cookie. */
export type SessionResult = {
  /** Account without the password. */
  readonly user: PublicUser;

  /** JWT for the session cookie. */
  readonly token: string;
};

type SessionPayload = {
  sub: string;
};

/** Registration, sign-in, and reading a session token. */
@Injectable()
export class AuthService {
  /** Stores accounts and signs session tokens. */
  public constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(PasswordService) private readonly passwords: PasswordService,
    @Inject(JwtService) private readonly jwt: JwtService,
  ) {}

  /** Creates a client or a seller and opens a session. */
  public async register(dto: RegisterDto): Promise<SessionResult> {
    const email = dto.email.trim().toLowerCase();
    const passwordHash = await this.passwords.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          passwordHash,
          name: dto.name.trim(),
          role: dto.role,
        },
      });

      return { user: toPublicUser(user), token: await this.tokenFor(user.id) };
    } catch (error) {
      rethrowPrisma(error, { conflict: 'Такой email уже зарегистрирован' });
    }
  }

  /** Opens a session when the email and password match. */
  public async login(dto: LoginDto): Promise<SessionResult> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });
    const passwordMatches = user ? await this.passwords.matches(dto.password, user.passwordHash) : false;

    if (!user || !passwordMatches) throw new UnauthorizedException('Неверный email или пароль');

    return { user: toPublicUser(user), token: await this.tokenFor(user.id) };
  }

  /** Person for a cookie token. Empty when the token is missing or expired. */
  public async userFromToken(token: string | null): Promise<PublicUser | null> {
    if (!token) return null;

    try {
      const payload = await this.jwt.verifyAsync<SessionPayload>(token);
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      return user ? toPublicUser(user) : null;
    } catch {
      return null;
    }
  }

  private async tokenFor(userId: string): Promise<string> {
    return this.jwt.signAsync({ sub: userId } satisfies SessionPayload);
  }
}
