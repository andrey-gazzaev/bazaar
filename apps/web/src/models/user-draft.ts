import type { Role } from './role';

/** Account an admin is creating. */
export type UserDraft = {
  /** Name shown in the shop. */
  readonly name: string;

  /** Email stored in lowercase. */
  readonly email: string;

  /** Plain password. */
  readonly password: string;

  /** Admin, seller, or client. */
  readonly role: Role;
};
