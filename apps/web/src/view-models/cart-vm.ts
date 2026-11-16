import type { CartLineVm } from './cart-line-vm';

/** Cart ready for checkout. */
export type CartVm = {
  /** Lines in the cart. Empty when the cart is empty. */
  readonly lines: readonly CartLineVm[];

  /** Sum of the lines. */
  readonly totalLabel: string;

  /** Always the formatted zero. Delivery is free. */
  readonly deliveryLabel: string;

  /** True when there is nothing in the cart. */
  readonly empty: boolean;

  /** True when every line can be bought. */
  readonly ready: boolean;
};
