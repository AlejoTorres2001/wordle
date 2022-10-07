import { Position } from "../../@types";

export const updateCursorPosition = (cursorPosition:Position,offSet:{offsetLeft:number,offsetTop:number},event: MouseEvent) => {
  cursorPosition.x = event.x - offSet.offsetLeft;
  cursorPosition.y = event.y - offSet.offsetTop;
  console.log(cursorPosition);
};