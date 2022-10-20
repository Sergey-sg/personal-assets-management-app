import { Currencies } from 'common/enums/currency.enum'

export const currencyIcon = (walletCurrency: Currencies) => {
  if (walletCurrency === Currencies.UAH) {
    return '₴'
  }
  if (walletCurrency === Currencies.USD) {
    return '$'
  }
  if (walletCurrency === Currencies.EUR) {
    return '€'
  }
}
