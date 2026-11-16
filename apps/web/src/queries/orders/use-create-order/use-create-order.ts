import { useMutation } from '@tanstack/react-query';
import { orderApi } from '@/dtos/api/order/order.api';
import type { Shipping } from '@/models';

/** Buys one listing. */
export function useCreateOrder() {
  return useMutation({
    mutationFn: (input: { productId: string; shipping: Shipping }) => orderApi.create(input.productId, input.shipping),
  });
}
