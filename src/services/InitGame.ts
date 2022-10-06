import { getRandomWord } from "./getRandomWord";

export const initGame = () => {
let letterIndex = 0;
let letterRowIndex = 0;
let userAnswers: string[] = [];
let userAttempt: string[] = [];
let rightWord = getRandomWord();
return {
letterIndex,
letterRowIndex,
userAnswers,
userAttempt,
rightWord
}
}