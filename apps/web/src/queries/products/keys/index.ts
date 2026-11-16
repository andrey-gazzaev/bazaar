/** Cache keys for listings. */
export const productKeys = {
  all: ['products'] as const,
  detail: (id: string) => [...productKeys.all, id] as const,
};
