/** Email and password for an existing account. */
export type Credentials = {
  /** Email stored in lowercase. */
  readonly email: string;

  /** Plain password. */
  readonly password: string;
};
