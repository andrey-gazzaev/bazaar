/** Where a purchase should be delivered. */
export type Shipping = {
  /** Person who receives the parcel. */
  readonly recipientName: string;

  /** Phone for the courier. */
  readonly phone: string;

  /** Where to deliver. */
  readonly address: string;
};
