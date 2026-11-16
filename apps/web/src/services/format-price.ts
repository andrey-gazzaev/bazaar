/** Price label in whole rubles. */
export function formatPrice(rubles: number): string {
  return `${new Intl.NumberFormat('ru-RU').format(rubles)} ₽`;
}
