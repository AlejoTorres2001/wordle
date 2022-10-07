import { ContextOptions } from "../../@types";

export const configureContext = (canvas:HTMLCanvasElement,options:ContextOptions) => {
 const ctx = canvas.getContext("2d");
  ctx.lineWidth = options.lineWidth ? options.lineWidth : 5;
  ctx.strokeStyle = options.strokeStyle ? options.strokeStyle : "white";
  ctx.lineJoin = options.lineJoin ? options.lineJoin : "round";
  ctx.lineCap = options.lineCap ? options.lineCap : "round";
  return  ctx
}