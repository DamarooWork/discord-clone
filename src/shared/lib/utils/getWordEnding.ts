interface WordEndingProps {
  ending1: string
  ending2: string
  ending3: string
  number: number
}
export function getWordEnding({
  ending1,
  ending2,
  ending3,
  number,
}:  WordEndingProps) {
  const value = {
    ending1,
    ending2,
    ending3,
  }
  const lastDigit = number % 10
  const lastTwoDigits = number % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return value.ending3
  }

  if (lastDigit === 1) {
    return value.ending1
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return value.ending2
  }

  return value.ending3
}
