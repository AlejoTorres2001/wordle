import { fromEvent, map, merge, mergeAll, takeUntil } from "rxjs";
import { Position } from "./@types";
import {
  configureContext,
  getCanvasContext,
  updateCursorPosition,
} from "./services/canvas";

const canvas = document.getElementById(
  "id-reactive-canvas"
) as HTMLCanvasElement;
const restartButton = document.getElementById("restart-button");
const cursorPosition: Position = { x: 0, y: 0 };
const offSet = {
  offsetLeft: canvas.offsetLeft,
  offsetTop: canvas.offsetTop,
};
const paintStroke = (event: MouseEvent) => {
  const ctx = configureContext(canvas, {});
  ctx.beginPath();
  ctx.moveTo(cursorPosition.x, cursorPosition.y);
  updateCursorPosition(cursorPosition, offSet, event);
  ctx.lineTo(cursorPosition.x, cursorPosition.y);
  ctx.stroke();
  ctx.closePath();
};
const onMouseUp$ = fromEvent<MouseEvent>(canvas, "mouseup");
const onMouseOver$ = fromEvent<MouseEvent>(canvas, "mousemove").pipe(
  takeUntil(onMouseUp$)
);
const onMouseDown$ = fromEvent<MouseEvent>(canvas, "mousedown");

const startPaint$ = onMouseDown$.pipe(
  map(() => onMouseOver$),
  mergeAll()
);
let onMouseDownSubscription = onMouseDown$.subscribe((event: MouseEvent) =>
  updateCursorPosition(cursorPosition, offSet, event)
);
let startPaintSubscription = startPaint$.subscribe(paintStroke);

const onLoadWindows$ = fromEvent(window, "load");
const onRestart$ = fromEvent(restartButton, "click");
let onWordleClick = fromEvent(
  document.getElementsByClassName("back-to-wordle-button"),
  "click"
).subscribe(() => {
  window.location.href = "index.html";
});
const restartWhiteBoard$ = merge(onRestart$, onLoadWindows$).subscribe(() => {
  startPaintSubscription.unsubscribe();
  onMouseDownSubscription.unsubscribe();
  onWordleClick.unsubscribe();
  const ctx = getCanvasContext("id-reactive-canvas");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  startPaintSubscription = startPaint$.subscribe(paintStroke);
  onMouseDownSubscription = onMouseDown$.subscribe((event: MouseEvent) =>
    updateCursorPosition(cursorPosition, offSet, event)
  );
  onWordleClick = fromEvent(
    document.getElementsByClassName("back-to-wordle-button"),
    "click"
  ).subscribe(() => {
    window.location.href = "index.html";
  });
});
