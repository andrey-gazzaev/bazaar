/** Paid purchase of one listing. */
export type OrderDto = {
  /** Order id. */
  readonly id: string;

  /** Price in whole rubles at the moment of purchase. */
  readonly price: number;

  /** Listing that was bought. */
  readonly productId: string;

  /** Listing title saved with the order. */
  readonly productName: string;

  /** Person who receives the parcel. */
  readonly recipientName: string;

  /** Phone for the courier. */
  readonly phone: string;

  /** Where to deliver. */
  readonly address: string;
};
