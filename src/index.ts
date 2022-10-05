import { fromEvent, Observable, Observer, Subject } from "rxjs";

const numbers$: Observable<number> = new Observable(
  (subscriber: Observer<number>) => {
    subscriber.next(Math.random());
  }
);
const randomNumbersSubject$ = new Subject<number>();


const ob1: Observer<number> = {
  next: (value) => console.log(value),

  error: (error) => console.log(error),
  complete: () => console.log("complete"),
};

const ob2: Observer<number> = {
  next: (value) => console.log(value),
  error: (error) => console.log(error),
  complete: () => console.log("complete"),
};
randomNumbersSubject$.subscribe(ob1);
randomNumbersSubject$.subscribe(ob2);

numbers$.subscribe(randomNumbersSubject$)
