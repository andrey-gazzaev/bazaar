import type { Role } from './role';

/** Person signed in to the shop. */
export type SessionUser = {
  /** Account id. */
  readonly id: string;

  /** Email stored in lowercase. */
  readonly email: string;

  /** Name shown in the shop. */
  readonly name: string;

  /** What this person is allowed to do. */
  readonly role: Role;
};
