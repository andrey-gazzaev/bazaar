import { SetMetadata } from '@nestjs/common';
import type { Role } from '@prisma/client';

/** Metadata key for the roles allowed on a route. */
export const ROLES_KEY = 'roles';

/** Limits a route to the given roles. */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
