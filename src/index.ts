import { fromEvent, Observable, Observer } from "rxjs";
const letterRows = document.getElementsByClassName("letter-row");
const onKeyDown$: Observable<KeyboardEvent> = fromEvent<KeyboardEvent>(
  document,
  "keydown"
);
let letterIndex = 0;
let letterRowIndex = 0;
const insertLetter: Observer<KeyboardEvent> = {
  next: (event: KeyboardEvent) => {
    const pressedKey = event.key.toUpperCase();
   
    if (pressedKey.length === 1 && pressedKey.match(/[a-z]/i)) {
      let letterBox =
      Array.from(letterRows)[letterRowIndex].children[letterIndex];
      letterBox.textContent = pressedKey;
      letterBox.classList.add("filled-letter");
      if (letterIndex === 4) {
        letterIndex = 0;
        letterRowIndex++;
      } else {
        letterIndex++;
      }
    }
    else if (pressedKey === 'BACKSPACE'){
      letterIndex= letterIndex - 1 >= 0 ? letterIndex-1 : 0;
      let letterBox =
      Array.from(letterRows)[letterRowIndex].children[letterIndex];
      letterBox.classList.remove("filled-letter");
      letterBox.textContent = '';
    }
  },
  error: (error: Error) => {
    console.error(error);
  },
  complete: () => {},
};

onKeyDown$.subscribe(insertLetter);
