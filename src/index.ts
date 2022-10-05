import { fromEvent, Observable, Observer } from "rxjs";

const onMouseMove$ = fromEvent<MouseEvent>(document, "mousemove");

const observer: Observer<MouseEvent> = {
  next: (event:MouseEvent) => console.log({x:event.x,y:event.y}),
  error: (error) => console.log(error),
  complete: () => console.log("complete"),
}
onMouseMove$.subscribe(observer);
