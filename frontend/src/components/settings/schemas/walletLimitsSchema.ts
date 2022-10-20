import * as Yup from 'yup'

export const WalletLimitsSchema = Yup.object({
  walletLimit: Yup.string()
    .min(1, 'Must be 1 characters or more')
    .max(20, 'Must be 64 characters or less')
    .matches(/^[0-9]+$/, ' allowed only integers ')
    .required('Required'),
})
