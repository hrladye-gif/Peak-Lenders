export const EAST_AFRICAN_CURRENCIES = [
  { code: "UGX", name: "Ugandan Shilling", locale: "en-UG" },
  { code: "KES", name: "Kenyan Shilling", locale: "en-KE" },
  { code: "TZS", name: "Tanzanian Shilling", locale: "sw-TZ" },
  { code: "RWF", name: "Rwandan Franc", locale: "rw-RW" },
  { code: "BIF", name: "Burundian Franc", locale: "fr-BI" },
  { code: "SSP", name: "South Sudanese Pound", locale: "en-SS" },
] as const;

export type Currency =
  | "UGX"
  | "KES"
  | "TZS"
  | "RWF"
  | "BIF"
  | "SSP";

export const DEFAULT_CURRENCY = "UGX";

export type SupportedCurrency =
  (typeof EAST_AFRICAN_CURRENCIES)[number]["code"];

export const getCurrency = (): SupportedCurrency => {
  const stored = localStorage.getItem("peak_currency");

  if (
    EAST_AFRICAN_CURRENCIES.some(
      (currency) => currency.code === stored
    )
  ) {
    return stored as SupportedCurrency;
  }

  return DEFAULT_CURRENCY;
};

export const getCurrencyConfig = () => {
  const currency = getCurrency();

  return (
    EAST_AFRICAN_CURRENCIES.find(
      (item) => item.code === currency
    ) || EAST_AFRICAN_CURRENCIES[0]
  );
};

export const formatMoney = (
  amount: number | string | null | undefined,
  currency: SupportedCurrency = getCurrency()
): string => {
  const value = Number(amount ?? 0);

  if (!Number.isFinite(value)) {
    return `${currency} 0`;
  }

  const config =
    EAST_AFRICAN_CURRENCIES.find(
      (item) => item.code === currency
    ) || EAST_AFRICAN_CURRENCIES[0];

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

export const getCurrencyName = (
  code: string = getCurrency()
): string => {
  return (
    EAST_AFRICAN_CURRENCIES.find(
      (currency) => currency.code === code
    )?.name || code
  );
};
