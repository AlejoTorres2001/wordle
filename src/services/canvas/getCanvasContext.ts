export const getCanvasContext = (canvasId: string) => {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  return canvas.getContext("2d");
};
