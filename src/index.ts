import { fromEvent, Observable, Observer } from "rxjs";
const letterRows = document.getElementsByClassName("letter-row");
const onKeyDown$: Observable<KeyboardEvent> = fromEvent<KeyboardEvent>(
  document,
  "keydown"
);
let letterIndex = 0;
let letterRowIndex = 0;
let userAnswers: string[] = [];
let userAttempt: string[] = [];
const insertLetter: Observer<KeyboardEvent> = {
  next: (event: KeyboardEvent) => {
    const pressedKey = event.key.toUpperCase();

    if (pressedKey.length === 1 && pressedKey.match(/[a-z]/i)) {
      let letterBox =
        Array.from(letterRows)[letterRowIndex].children[letterIndex];
      letterBox.textContent = pressedKey;
      letterBox.classList.add("filled-letter");
      userAttempt.push(pressedKey);
      if (letterIndex === 4) {
        letterIndex = 0;
        letterRowIndex++;
        userAnswers.push(userAttempt.join(""));
        userAttempt = [];
      } else {
        letterIndex++;
      }
    } else if (pressedKey === "BACKSPACE") {
      letterIndex = letterIndex - 1 >= 0 ? letterIndex - 1 : 0;
      let letterBox =
        Array.from(letterRows)[letterRowIndex].children[letterIndex];
      letterBox.classList.remove("filled-letter");
      letterBox.textContent = "";
      userAttempt.pop();
    }
  },
  error: (error: Error) => {
    console.error(error);
  },
  complete: () => {},
};
onKeyDown$.subscribe(insertLetter);
