export type onCompleteData = {
  userAnswer: string;
  letterRowIndex: number;
};
export type Position = {
  x: number;
  y: number;
}
export type ContextOptions = {
  lineWidth?: number;
  strokeStyle?: string;
  lineJoin?: CanvasLineJoin;
  lineCap?: CanvasLineCap;

}