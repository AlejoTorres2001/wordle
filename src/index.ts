import { fromEvent, Observable, Observer, Subject, takeUntil } from "rxjs";
import { onCompleteData } from "./@types";
import {
  checkLetters,
  isLetter,
  isWordCorrect,
  setMessage,
} from "./services/wordle";
import { initGame } from "./services/wordle/InitGame";

let { letterIndex, letterRowIndex, userAnswers, userAttempt, rightWord } =
  initGame();
const letterRows = document.getElementsByClassName("letter-row");
const restartButton = document.getElementById("restart-button");
const onKeyDown$: Observable<KeyboardEvent> = fromEvent<KeyboardEvent>(
  document,
  "keydown"
);
const onRowCompleted$: Subject<onCompleteData> = new Subject();
const onWinOrLoose$: Subject<string> = new Subject();

const onRestart$: Observable<MouseEvent> = fromEvent<MouseEvent>(
  restartButton,
  "click"
);
const restartGame: Observer<MouseEvent> = {
  next: (event: MouseEvent) => {
    event.preventDefault();
    location.reload();
  },
  complete: () => console.log("restart completed"),
  error: (error: Error) => console.log(error),
};
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
const checkRows = (data: onCompleteData) => {
  const { userAnswer, letterRowIndex } = data;
  const letters = Array.from(letterRows[letterRowIndex].children)
  checkLetters(letters, rightWord);
  if (!isWordCorrect(userAnswer, rightWord) && letterRowIndex !== 5) return;
  if (isWordCorrect(userAnswer, rightWord)) {
    setMessage("success", "Correct!");
    onWinOrLoose$.next("success");
  } else if (letterRowIndex === 5) {
    setMessage("error", `Game over! The word was ${rightWord}`);
    onWinOrLoose$.next("error");
  }
  restartButton.removeAttribute("disabled");
}
onRowCompleted$.subscribe(checkRows);
onRestart$.subscribe(restartGame);
onKeyDown$.pipe(takeUntil(onWinOrLoose$)).subscribe(insertLetter);
onKeyDown$.pipe(takeUntil(onWinOrLoose$)).subscribe(deleteLetter);