import {
  BasicTransformEvent,
  Canvas,
  FabricObject,
  FabricObjectProps,
  TPointerEvent,
} from "fabric";
import { DefaultLine } from "../default_styles";

const snapSize = 10;
const lineProp: Partial<FabricObjectProps> = {
  selectable: false,
  strokeDashArray: [3, 3],
  stroke: "red",
  strokeWidth: 1,
};

function ObjectMoving(
  e: BasicTransformEvent<TPointerEvent> & {
    target: FabricObject;
  },
  canvas: Canvas,
) {
  let ht = false;
  let hm = false;
  let hb = false;
  let vl = false;
  let vm = false;
  let vr = false;

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const left = e.target.left;
  const top = e.target.top;

  // Calculate the current width and height after scaling
  const width = e.target.width * e.target.scaleX;
  const height = e.target.height * e.target.scaleY;

  const right = left + width;
  const bottom = top + height;
  const centerX = left + width / 2;
  const centerY = top + height / 2;

  const canvasMidx = canvas.width / 2;
  const canvasMidy = canvas.height / 2;

  const lines: DefaultLine[] = [];

  // left edge
  if (Math.abs(left) <= snapSize) {
    e.target.set({
      left: 0,
    });
  }

  // right side
  if (Math.abs(right - canvasWidth) <= snapSize) {
    e.target.set({
      left: canvas.width - width,
    });
  }

  // top
  if (Math.abs(e.target.top) <= snapSize) {
    e.target.set({
      top: 0,
    });
  }

  // bottom
  if (Math.abs(bottom - canvasHeight) <= snapSize) {
    e.target.set({
      top: canvasHeight - height,
    });
  }

  // midX
  if (Math.abs(centerX - canvasMidx) <= snapSize) {
    lines.push(
      new DefaultLine([canvasMidx, 0, canvasMidx, canvas.height], lineProp),
    );
    e.target.set({
      left: canvasMidx - width * 0.5,
    });
  }

  // midY
  if (Math.abs(centerY - canvasMidy) <= 10) {
    lines.push(
      new DefaultLine([0, canvasMidy, canvas.width, canvasMidy], lineProp),
    );

    hm = true;

    e.target.set({
      top: canvasMidy - height * 0.5,
    });
  }

  // Object snapping to other objects
  canvas.getObjects().forEach((o) => {
    if (o.get("id") === e.target.get("id")) return;

    const t = o.top;
    const l = o.left;
    const oHeight = o.height * o.scaleY;
    const oWidth = o.width * o.scaleX;

    // top part other object
    if (Math.abs(t - top) <= snapSize) {
      if (!ht) {
        lines.push(new DefaultLine([0, t, canvas.width, t], lineProp));
        ht = true;
      }
      e.target.set({
        top: t,
      });
    }
    if (Math.abs(t - (top + height / 2)) <= snapSize) {
      if (!hm) {
        lines.push(new DefaultLine([0, t, canvas.width, t], lineProp));
        hm = true;
      }
      e.target.set({
        top: t - height / 2,
      });
    }
    if (Math.abs(t - (top + height)) <= snapSize) {
      if (!hb) {
        lines.push(new DefaultLine([0, t, canvas.width, t], lineProp));
        hb = true;
      }
      e.target.set({
        top: t - height,
      });
    }

    // mid of others
    if (Math.abs(t + oHeight * 0.5 - top) <= snapSize) {
      if (!ht) {
        lines.push(
          new DefaultLine(
            [0, t + oHeight * 0.5, canvasWidth, t + oHeight * 0.5],
            lineProp,
          ),
        );
        ht = true;
      }
      e.target.set({
        top: t + oHeight * 0.5,
      });
    }
    if (Math.abs(t + oHeight * 0.5 - (top + height * 0.5)) <= snapSize) {
      if (!hm) {
        lines.push(
          new DefaultLine(
            [0, t + oHeight * 0.5, canvasWidth, t + oHeight * 0.5],
            lineProp,
          ),
        );
        hm = true;
      }
      e.target.set({
        top: t + oHeight * 0.5 - height * 0.5,
      });
    }
    if (Math.abs(t + oHeight * 0.5 - (top + height)) <= snapSize) {
      if (!hb) {
        lines.push(
          new DefaultLine(
            [0, t + oHeight * 0.5, canvasWidth, t + oHeight * 0.5],
            lineProp,
          ),
        );
        hb = true;
      }
      e.target.set({
        top: t + oHeight * 0.5 - height,
      });
    }

    // bottom others
    if (Math.abs(t + oHeight - top) <= snapSize) {
      if (!ht) {
        lines.push(
          new DefaultLine([0, t + oHeight, canvasWidth, t + oHeight], lineProp),
        );
        ht = true;
      }
      e.target.set({
        top: t + oHeight,
      });
    }
    if (Math.abs(t + oHeight - (top + height * 0.5)) <= snapSize) {
      if (!hm) {
        lines.push(
          new DefaultLine([0, t + oHeight, canvasWidth, t + oHeight], lineProp),
        );
        hm = true;
      }
      e.target.set({
        top: t + oHeight - height * 0.5,
      });
    }
    if (Math.abs(t + oHeight - (top + height)) <= snapSize) {
      if (!hb) {
        lines.push(
          new DefaultLine([0, t + oHeight, canvasWidth, t + oHeight], lineProp),
        );
        hb = true;
      }
      e.target.set({
        top: t + oHeight - height,
      });
    }

    // vertical left other
    if (Math.abs(l - left) <= snapSize) {
      if (!vl) {
        lines.push(new DefaultLine([l, 0, l, canvasHeight], lineProp));
        vl = true;
      }
      e.target.set("left", l);
    }
    if (Math.abs(l - (left + width * 0.5)) <= snapSize) {
      if (!vm) {
        lines.push(new DefaultLine([l, 0, l, canvasHeight], lineProp));
        vm = true;
      }
      e.target.set("left", l - width * 0.5);
    }
    if (Math.abs(l - (left + width)) <= snapSize) {
      if (!vr) {
        lines.push(new DefaultLine([l, 0, l, canvasHeight], lineProp));
        vr = true;
      }
      e.target.set("left", l - width);
    }

    // vertical mid other
    if (Math.abs(l + oWidth * 0.5 - left) <= snapSize) {
      if (!vl) {
        lines.push(
          new DefaultLine(
            [l + oWidth * 0.5, 0, l + oWidth * 0.5, canvasHeight],
            lineProp,
          ),
        );
        vl = true;
      }
      e.target.set("left", l + oWidth * 0.5);
    }
    if (Math.abs(l + oWidth * 0.5 - (left + width * 0.5)) <= snapSize) {
      if (!vm) {
        lines.push(
          new DefaultLine(
            [l + oWidth * 0.5, 0, l + oWidth * 0.5, canvasHeight],
            lineProp,
          ),
        );
        vm = true;
      }
      e.target.set("left", l + oWidth * 0.5 - width * 0.5);
    }
    if (Math.abs(l + oWidth * 0.5 - (left + width)) <= snapSize) {
      if (!vr) {
        lines.push(
          new DefaultLine(
            [l + oWidth * 0.5, 0, l + oWidth * 0.5, canvasHeight],
            lineProp,
          ),
        );
        vr = true;
      }
      e.target.set("left", l + oWidth * 0.5 - width);
    }

    // vertical end other
    if (Math.abs(l + oWidth - left) <= snapSize) {
      if (!vl) {
        lines.push(
          new DefaultLine([l + oWidth, 0, l + oWidth, canvasHeight], lineProp),
        );
        vl = true;
      }
      e.target.set("left", l + oWidth);
    }
    if (Math.abs(l + oWidth - (left + width * 0.5)) <= snapSize) {
      if (!vm) {
        lines.push(
          new DefaultLine([l + oWidth, 0, l + oWidth, canvasHeight], lineProp),
        );
        vm = true;
      }
      e.target.set("left", l + oWidth - width * 0.5);
    }
    if (Math.abs(l + oWidth - (left + width)) <= snapSize) {
      if (!vr) {
        lines.push(
          new DefaultLine([l + oWidth, 0, l + oWidth, canvasHeight], lineProp),
        );
        vr = true;
      }
      e.target.set("left", l + oWidth - width);
    }
  });

  return lines;
}

export { ObjectMoving };
