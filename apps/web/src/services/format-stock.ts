/** Stock line for a listing. Zero is out of stock. */
export function formatStock(stock: number): string {
  if (stock === 0) return 'Нет в наличии';

  return `Осталось: ${stock}`;
}
