import { fromEvent, map } from "rxjs";

const canvas = document.getElementById(
  "id-reactive-canvas"
) as HTMLCanvasElement;
const onMouseOver$ = fromEvent<MouseEvent>(canvas, "mousemove").pipe(
  map((event: MouseEvent) => {
    return {
      x: event.x,
      y: event.y,
    };
  }),
  map((position) => {
    return {
      x: position.x - canvas.offsetLeft,
      y: position.y - canvas.offsetTop,
    };
  })
);
const onMouseDown$ = fromEvent<MouseEvent>(canvas, "mousedown");
const onMouseUp$ = fromEvent<MouseEvent>(canvas, "mouseup");

onMouseOver$.subscribe(console.log);
