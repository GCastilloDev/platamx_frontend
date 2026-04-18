export type Currency = 'MXN' | 'USD';

function baseFormat(price: number | string, currency: Currency): string {
  const locale = currency === 'USD' ? 'en-US' : 'es-MX';
  const numeric = typeof price === 'string' ? parseFloat(price) : price;
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  }).format(numeric || 0);
  return `${formatted} ${currency}`;
}

export function formatCurrency(price: number | string, currency: Currency = 'MXN'): string {
  return baseFormat(price, currency);
}

// Para contextos bilingues: elige precio y moneda según locale activo
export function formatBilingual(
  priceMxn: number | string,
  priceUsd: number | string | null | undefined,
  isEnglish: boolean
): string {
  const currency: Currency = isEnglish ? 'USD' : 'MXN';
  const price = isEnglish ? (priceUsd ?? priceMxn) : priceMxn;
  return baseFormat(price, currency);
}
