import type { Role } from './role';

/** Fields an admin sends when changing an account. Absent fields stay. */
export type UserPatch = {
  /** New name. Absent when the name stays. */
  readonly name?: string;

  /** New email. Absent when the email stays. */
  readonly email?: string;

  /** New password. Absent when the password stays. */
  readonly password?: string;

  /** New role. Absent when the role stays. */
  readonly role?: Role;
};
