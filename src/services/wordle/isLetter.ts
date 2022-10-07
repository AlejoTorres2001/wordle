export const isLetter = (pressedKey:string) => {
  return pressedKey.length === 1 && pressedKey.match(/[a-z]/i)
}