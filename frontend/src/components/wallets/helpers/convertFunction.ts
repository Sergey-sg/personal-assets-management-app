const magnitudeFactor = 100

export const convertToСoins = (money: number): number => {
  return money * magnitudeFactor
}

export const convertToMoney = (coins: number): number => {
  return coins / magnitudeFactor
}
