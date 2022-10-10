import {
  fromEvent,
  merge,
  Observable,
  Observer,
  Subject,
  takeUntil,
} from "rxjs";
import { onCompleteData } from "./@types";
import {
  checkLetters,
  getRandomWord,
  isLetter,
  isWordCorrect,
  setMessage,
  cleanGrid,
} from "./services/wordle";

let letterIndex = 0;
let letterRowIndex = 0;
let userAnswers: string[] = [];
let userAttempt: string[] = [];
let rightWord = getRandomWord();

const letterRows = document.getElementsByClassName("letter-row");
const restartButton = document.getElementById("restart-button");
const whiteBoardButton = document.getElementsByClassName(
  "go-to-white-board-button"
);
const howToPlayButton = document.getElementsByClassName("how-to-play-button");
const howToPlayDialog = document.getElementById("how-to-play-dialog-container");
const pageMask = document.getElementById("page-mask");
const onPageMaskClick$ = fromEvent(pageMask, "click");
const onWhiterBoardClick$ = fromEvent<MouseEvent>(whiteBoardButton, "click");
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
const onHowToPlayClick$: Observable<MouseEvent> = fromEvent<MouseEvent>(
  howToPlayButton,
  "click"
);
const onLoadWindow$ = fromEvent(window, "load");

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
  const letters = Array.from(letterRows[letterRowIndex].children);
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
};
const restartWordle$ = merge(onRestart$, onLoadWindow$).subscribe(() => {
  onRowCompletedSubscription.unsubscribe();
  onKeyDownInsertSubscription.unsubscribe();
  onKeyDownDeleteSubscription.unsubscribe();
  onWhiterBoardClickSubscription.unsubscribe();
  onRowCompletedSubscription = onRowCompleted$.subscribe(checkRows);
  onKeyDownInsertSubscription = onKeyDown$
    .pipe(takeUntil(onWinOrLoose$))
    .subscribe(insertLetter);
  onKeyDownDeleteSubscription = onKeyDown$
    .pipe(takeUntil(onWinOrLoose$))
    .subscribe(deleteLetter);
  onWhiterBoardClickSubscription = onWhiterBoardClick$.subscribe(() => {
    window.location.href = "board.html";
  });
  letterIndex = 0;
  letterRowIndex = 0;
  userAnswers = [];
  userAttempt = [];
  rightWord = getRandomWord();
  cleanGrid(letterRows);
  setMessage("reset", "");
});
let onRowCompletedSubscription = onRowCompleted$.subscribe(checkRows);
let onKeyDownInsertSubscription = onKeyDown$
  .pipe(takeUntil(onWinOrLoose$))
  .subscribe(insertLetter);
let onKeyDownDeleteSubscription = onKeyDown$
  .pipe(takeUntil(onWinOrLoose$))
  .subscribe(deleteLetter);

let onWhiterBoardClickSubscription = onWhiterBoardClick$.subscribe(() => {
  window.location.href = "board.html";
});
let onPageMaskClickSubscription = onPageMaskClick$.subscribe(() => {
  pageMask.classList.remove("page-mask");
  howToPlayDialog.style.display = "none";
})
let onHowToPlayClickSubscription = onHowToPlayClick$.subscribe(() => {
  pageMask.classList.add("page-mask");
  howToPlayDialog.style.display = "flex";
})