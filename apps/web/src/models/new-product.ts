/** Listing a seller is about to publish. */
export type NewProduct = {
  /** Title shown on the card. */
  readonly name: string;

  /** What the buyer should know. */
  readonly description: string;

  /** Price in whole rubles. */
  readonly price: number;

  /** Tag ids. Empty when the listing has no tags. */
  readonly tagIds: readonly string[];

  /** Pictures chosen in the browser. */
  readonly images: readonly File[];
};
