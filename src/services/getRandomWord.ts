import WORDS_LIST from "../wordsList.json";
export const getRandomWord = () =>
  WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
