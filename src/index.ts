import { fromEvent, Observable, Observer, Subject } from "rxjs";
import { onCompleteData } from "./@types";
import { checkLetters } from "./services/checkLetters";
import { getRandomWord } from "./services/getRandomWord";
import { isLetter } from "./services/isLetter";
import { isWordCorrect } from "./services/isWordCorrect";
import { setMessage } from "./services/setMessage";

let letterIndex = 0;
let letterRowIndex = 0;
let userAnswers: string[] = [];
let userAttempt: string[] = [];
let rightWord = getRandomWord();
const letterRows = document.getElementsByClassName("letter-row");
const restartButton = document.getElementById("restart-button");
const onKeyDown$: Observable<KeyboardEvent> = fromEvent<KeyboardEvent>(
  document,
  "keydown"
);
const onRowCompleted$: Subject<onCompleteData> = new Subject();

const insertLetter: Observer<KeyboardEvent> = {
  next: (event: KeyboardEvent) => {
    const pressedKey = event.key.toUpperCase();

    if (isLetter(pressedKey)) {
      let letterBox =
        Array.from(letterRows)[letterRowIndex].children[letterIndex];
      letterBox.textContent = pressedKey;
      letterBox.classList.add("filled-letter");
      userAttempt.push(pressedKey);
      if (letterIndex === 4) {
        const userAnswer = userAttempt.join("");
        userAnswers.push(userAnswer);
        onRowCompleted$.next({ userAnswer, letterRowIndex });
        userAttempt = [];
        letterIndex = 0;
        letterRowIndex++;
        return;
      }
      letterIndex++;
    }
  },
  error: (error: Error) => {
    console.error(error);
  },
  complete: () => {},
};
const deleteLetter: Observer<KeyboardEvent> = {
  next: (event: KeyboardEvent) => {
    const pressedKey = event.key.toUpperCase();
    if (pressedKey === "BACKSPACE") {
      letterIndex = letterIndex - 1 >= 0 ? letterIndex - 1 : 0;
      let letterBox =
        Array.from(letterRows)[letterRowIndex].children[letterIndex];
      letterBox.classList.remove("filled-letter");
      letterBox.textContent = "";
      userAttempt.pop();
    }
  },
  complete: () => {},
  error: (error: Error) => {
    console.error(error);
  },
};
onKeyDown$.subscribe(insertLetter);
onKeyDown$.subscribe(deleteLetter);
onRowCompleted$.subscribe((data: onCompleteData) => {
  const { userAnswer, letterRowIndex } = data;
  console.log(userAnswer, rightWord, letterIndex);
  const letters = [...Array.from(letterRows[letterRowIndex].children)];
  checkLetters(letters, rightWord);
  if (!isWordCorrect(userAnswer, rightWord) && letterRowIndex !== 5) return;
  if (isWordCorrect(userAnswer, rightWord)) {
    setMessage("success", "Correct!");
  } else if (letterRowIndex === 5) {
    setMessage("error", `Game over! The word was ${rightWord}`);
  }
  restartButton.removeAttribute("disabled");
});
