import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { SESSION_COOKIE } from '../common/session';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from './auth.guard';

/** Attaches the signed-in person when the cookie is valid, and lets everyone else through. */
@Injectable()
export class OptionalAuthGuard implements CanActivate {
  /** Reads the session cookie. */
  public constructor(@Inject(AuthService) private readonly auth: AuthService) {}

  /** Stores the person on the request when a session exists. */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const raw: unknown = request.cookies?.[SESSION_COOKIE];
    const token = typeof raw === 'string' ? raw : null;
    const user = await this.auth.userFromToken(token);

    if (user) request.user = user;

    return true;
  }
}
