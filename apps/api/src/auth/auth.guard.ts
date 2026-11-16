import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { PublicUser } from '../common/public-user';
import { SESSION_COOKIE } from '../common/session';
import { AuthService } from './auth.service';

/** Request that may already carry the signed-in person. */
export type AuthenticatedRequest = Request & {
  user?: PublicUser;
};

/** Rejects a request that has no live session. */
@Injectable()
export class AuthGuard implements CanActivate {
  /** Reads the session cookie. */
  public constructor(@Inject(AuthService) private readonly auth: AuthService) {}

  /** Attaches the person or refuses the request. */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const raw: unknown = request.cookies?.[SESSION_COOKIE];
    const token = typeof raw === 'string' ? raw : null;
    const user = await this.auth.userFromToken(token);

    if (!user) throw new UnauthorizedException('Войдите, чтобы продолжить');

    request.user = user;
    return true;
  }
}
