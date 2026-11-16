/** Data for a new client or seller account. */
export type RegisterInput = {
  /** Name shown in the shop. */
  readonly name: string;

  /** Email stored in lowercase. */
  readonly email: string;

  /** Plain password. */
  readonly password: string;

  /** Client or seller. */
  readonly role: 'CLIENT' | 'SELLER';
};
