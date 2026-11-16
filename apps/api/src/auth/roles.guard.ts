import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Role } from '@prisma/client';
import { AuthenticatedRequest } from './auth.guard';
import { ROLES_KEY } from './roles.decorator';

/** Rejects a signed-in person whose role is not on the route. */
@Injectable()
export class RolesGuard implements CanActivate {
  /** Reads role metadata from the route. */
  public constructor(@Inject(Reflector) private readonly reflector: Reflector) {}

  /** Allows the request when no roles are set or the person matches. */
  public canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[] | undefined>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.user || !roles.includes(request.user.role)) {
      throw new ForbiddenException('Недостаточно прав');
    }

    return true;
  }
}
