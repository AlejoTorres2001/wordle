import { fromEvent, map, mergeAll, takeUntil } from "rxjs";
import { Position } from "./@types";
import { configureContext, updateCursorPosition } from "./services/canvas";

const canvas = document.getElementById(
  "id-reactive-canvas"
) as HTMLCanvasElement;

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
onMouseDown$.subscribe((event: MouseEvent) =>
  updateCursorPosition(cursorPosition, offSet, event)
);
startPaint$.subscribe(paintStroke);
