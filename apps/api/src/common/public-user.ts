import type { Role } from '@prisma/client';

/** Person returned to the shop, without the password. */
export type PublicUser = {
  /** Account id. */
  readonly id: string;

  /** Email stored in lowercase. */
  readonly email: string;

  /** Name shown in the shop. */
  readonly name: string;

  /** What this person is allowed to do. */
  readonly role: Role;
};

/** Removes the password from a stored account. */
export function toPublicUser(user: {
  id: string;
  email: string;
  name: string;
  role: Role;
}): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
