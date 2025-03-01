import {
  BasicTransformEvent,
  Canvas,
  FabricObject,
  TPointerEvent,
} from "fabric";
import { DefaultLine } from "../default_styles";

function ObjectMoving(
  e: BasicTransformEvent<TPointerEvent> & {
    target: FabricObject;
  },
  canvas: Canvas,
) {
  const canvasMidx = canvas.width / 2;
  const canvasMidy = canvas.height / 2;

  const lines: DefaultLine[] = [];

  // left edge
  if (Math.abs(e.target.left) <= 20) {
    e.target.set({
      left: 0,
    });
  }

  // right side
  if (Math.abs(e.target.left + e.target.width - canvas.width) <= 20) {
    e.target.set({
      left: canvas.width - e.target.width,
    });
  }

  // top
  if (Math.abs(e.target.top) <= 20) {
    e.target.set({
      top: 0,
    });
  }

  // bottom
  if (Math.abs(e.target.top + e.target.height - canvas.height) <= 20) {
    e.target.set({
      top: canvas.height - e.target.height,
    });
  }

  // midX
  if (Math.abs(e.target.left + e.target.width / 2 - canvasMidx) <= 20) {
    lines.push(
      new DefaultLine([canvasMidx, 0, canvasMidx, canvas.height], {
        selectable: false,
        strokeDashArray: [5, 5],
        stroke: "red",
        strokeWidth: 2,
      }),
    );
    e.target.set({
      left: canvasMidx - e.target.width * 0.5,
    });
  }

  // midY
  if (Math.abs(e.target.top + e.target.height / 2 - canvasMidy) <= 10) {
    lines.push(
      new DefaultLine([0, canvasMidy, canvas.width, canvasMidy], {
        selectable: false,
        strokeDashArray: [5, 5],
        stroke: "red",
        strokeWidth: 2,
      }),
    );
    e.target.set({
      top: canvasMidy - e.target.height * 0.5,
    });
  }

  return lines;
}

export { ObjectMoving };
