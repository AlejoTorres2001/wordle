import { fromEvent, Observable, Observer } from "rxjs";

const onKeyDown$ = fromEvent<KeyboardEvent>(document, "keydown");

const observer: Observer<KeyboardEvent> = {
  next: (event:KeyboardEvent) => console.log(event.key),
  error: (error) => console.log(error),
  complete: () => console.log("complete"),
}
onKeyDown$.subscribe(observer);
