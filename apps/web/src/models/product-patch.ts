/** Fields a seller sends when changing a listing. The status stays on the server. */
export type ProductPatch = {
  /** Title shown on the card. */
  readonly name: string;

  /** What the buyer should know. */
  readonly description: string;

  /** Price in whole rubles. */
  readonly price: number;

  /** Units still for sale. */
  readonly stock: number;

  /** Tag ids. Empty when the listing has no tags. */
  readonly tagIds: readonly string[];

  /** Replacement pictures. Empty when the current pictures stay. */
  readonly images: readonly File[];
};
