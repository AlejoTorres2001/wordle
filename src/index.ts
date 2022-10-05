import { Observable, Observer } from "rxjs";
const observableAlpha$ = new Observable<number|string>((subscriber) => {
  subscriber.next("Alpha");
  subscriber.next("Beta");
  subscriber.next(1);
  subscriber.next("Gamma");
  subscriber.complete();
});

const observer:Observer<number | string>  = {
  next: (value:number | string) => value,
  error: (error:any) => console.log(error),
  complete: () => console.log("Completed")
}

observableAlpha$.subscribe(observer);

