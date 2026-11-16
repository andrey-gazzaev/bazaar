import type { Role } from '@/models';

/** Account row in the admin list. */
export type UserRowVm = {
  /** Account id. */
  readonly id: string;

  /** Name shown in the shop. */
  readonly name: string;

  /** Email stored in lowercase. */
  readonly email: string;

  /** Stored role. */
  readonly role: Role;

  /** Role label in Russian. */
  readonly roleLabel: string;
};
