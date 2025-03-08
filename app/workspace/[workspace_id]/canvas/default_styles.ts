import * as fabric from "fabric";
import { canvasConfig } from "./constants";

class DefaultRect extends fabric.Rect {
  declare hoverShape: fabric.Rect | null;
  constructor(params: Partial<fabric.RectProps>) {
    super({
      rx: 10,
      ry: 10,
      stroke: "black",
      fill: "transparent",
      padding: 3,
      cornerSize: 8,
      strokeUniform: true,
      cornerStrokeColor: canvasConfig.selectionStroke,
      borderScaleFactor: 2,
      cornerStyle: "circle",

      centeredRotation: true,

      // transparentCorners: false,
      shadow: new fabric.Shadow({
        offsetX: 1,
        offsetY: 2,
        color: "black",
        blur: 5,
      }),
      // objectCaching: true,
      ...params,
    });
    this.set("id", `shape-${Date.now()}`);
  }
}

class DefaultTriangle extends fabric.Triangle {
  constructor(params: Partial<fabric.Triangle>) {
    super({
      fill: "transparent",
      stroke: "black",
      strokeWidth: 2,
      transparentCorners: false,

      padding: 3,
      cornerSize: 8,
      strokeUniform: true,
      cornerStrokeColor: canvasConfig.selectionStroke,
      borderScaleFactor: 2,
      cornerStyle: "circle",

      centeredRotation: true,

      // objectCaching: true,
      ...params,
    });
    this.set("id", `shape-${Date.now()}`);
  }
}

class DefaultEllipse extends fabric.Ellipse {
  constructor(params: Partial<fabric.EllipseProps>) {
    super({
      ...params,
      originX: "center",
      originY: "center",
      stroke: "white",
      strokeWidth: 4,
      cornerColor: "transparent",
      transparentCorners: false,
      centeredRotation: true,
      cornerStyle: "circle",
      // objectCaching: true,

      padding: 3,
      cornerSize: 8,
      strokeUniform: true,
      cornerStrokeColor: canvasConfig.selectionStroke,

      borderScaleFactor: 2,
      shadow: new fabric.Shadow({
        blur: 4,
        offsetX: 2,
        offsetY: 2,
        color: "black",
      }),
    });
    this.set("id", `shape-${Date.now()}`);
    this.width = params.width || 50;
    this.height = params.height || 50;
  }
}

class DefaultCircle extends fabric.Circle {
  constructor(params: Partial<fabric.CircleProps>) {
    super({
      radius: 10,
      originX: "center",
      originY: "center",
      stroke: "black",
      strokeWidth: 3,
      fill: "transparent",
      cornerColor: "transparent",
      transparentCorners: false,
      centeredRotation: true,

      padding: 3,
      cornerSize: 8,
      strokeUniform: true,
      cornerStrokeColor: canvasConfig.selectionStroke,
      borderScaleFactor: 2,
      cornerStyle: "circle",

      shadow: new fabric.Shadow({
        blur: 4,
        offsetX: 2,
        offsetY: 2,
        color: "black",
      }),
      ...params,
    });
    this.set("id", `shape-${Date.now()}`);
  }
}

class DefaultIText extends fabric.Textbox {
  constructor(text: string, params: Partial<fabric.ITextProps>) {
    super(text, {
      stroke: "black",
      fontFamily: "sans serif",
      // underline: true,
      cornerStyle: "circle",
      charSpacing: -1,
      fontStyle: "italic",
      transparentCorners: false,
      // objectCaching: true,

      centeredRotation: true,

      padding: 3,
      cornerSize: 8,
      strokeUniform: true,
      cornerStrokeColor: canvasConfig.selectionStroke,
      borderScaleFactor: 2,
      ...params,
    });
    this.set("id", `shape-${Date.now()}`);
  }
}

class DefaultPath extends fabric.Path {
  constructor() {
    super(
      "M 150 50 " + // Move to the starting point (top vertex of the hexagon)
        "C 180 20, 230 20, 250 50 " + // Top-right curve
        "L 250 150 " + // Right vertical line
        "C 230 180, 180 180, 150 150 " + // Bottom-right curve
        "L 50 150 " + // Bottom-left line
        "C 20 180, 20 130, 50 100 " + // Bottom-left curve
        "L 50 50 " + // Left vertical line
        "C 20 20, 70 20, 100 50 " + // Top-left curve
        "Z", // Close the path
      {
        fill: "transparent",
        stroke: "black",
        strokeWidth: 3,
        strokeUniform: true,
        cornerSize: 10,
        cornerStyle: "circle",
        padding: 1,
        cornerStrokeColor: "#4040ef",
        // objectCaching: true,
        centeredRotation: true,
      },
    );
    this.set("id", `shape-${Date.now()}`);
  }
}

class DefaultLine extends fabric.Line {
  constructor(
    points: [number, number, number, number],
    props: Partial<fabric.FabricObjectProps>,
  ) {
    super(points, { ...props });
    this.initilizeControls();
    this.set("id", `shape-${Date.now()}`);
  }

  initilizeControls() {
    this.controls.controlPointOne = new fabric.Control({
      x: -0.5,
      y: -0.5,
      render(ctx, left, top, styleOverride, fabricObject) {
        ctx.save();

        // Ensuring the circle's fill stays within bounds
        const radius = 5;

        ctx.fillStyle = fabricObject.stroke?.toString() || "black";
        ctx.beginPath();
        ctx.arc(left, top, radius, 0, Math.PI * 2);
        ctx.closePath(); // Close the path to avoid extra fill outside the circle
        ctx.fill();

        ctx.restore();
      },
      actionHandler(e, transform, x, y) {
        if (!transform.target) return false;
        transform.target.set("x1", x);
        transform.target.set("y1", y);

        // transform.target.set("y2", transform.target.get("y2"));
        // transform.target.set("x2", transform.target.get("x2"));
        return true;
      },
    });
    this.controls.controlPointTwo = new fabric.Control({
      x: 0.5,
      y: 0.5,
      render(ctx, left, top, styleOverride, fabricObject) {
        ctx.save();

        // Ensuring the circle's fill stays within bounds
        const radius = 5;

        ctx.fillStyle = fabricObject.stroke?.toString() || "black";
        ctx.beginPath();
        ctx.arc(left, top, radius, 0, Math.PI * 2);
        ctx.closePath(); // Close the path to avoid extra fill outside the circle
        ctx.fill();

        ctx.restore();
      },
      actionHandler(e, transform, x, y) {
        // console.log(transform.target);
        if (!transform.target) return false;
        transform.target.set("x1", x);
        transform.target.set("y2", y);
        return true;
      },
    });
  }
}

class DefaultCustomPath extends fabric.Path {
  constructor(path: string, props: Partial<fabric.PathProps>) {
    super(path, {
      ...props,
      fill: "transparent",
      stroke: "black",
      transparentCorners: false,

      padding: 3,
      cornerSize: 8,
      strokeUniform: true,
      cornerStrokeColor: canvasConfig.selectionStroke,
      borderScaleFactor: 2,
      cornerStyle: "circle",

      centeredRotation: true,
    });
    this.set("id", `shape-${Date.now()}`);
  }
}

class DefaultImage extends fabric.FabricImage {
  constructor({
    props,
    img,
  }: {
    img: string;
    props: Partial<fabric.FabricObjectProps>;
  }) {
    super(img, {
      cornerSize: 10,
      cornerStyle: "circle",
      padding: 1,
      cornerStrokeColor: "#2020ff",
      objectCaching: true,
      strokeUniform: true,
      transparentCorners: false,
      cornerColor: "#2090a0",

      centeredRotation: true,

      filters: [new fabric.filters.BlackWhite()],
      ...props,
    });
    this.applyFilters();
    this.set("id", `shape-${Date.now()}`);
  }
}

export {
  DefaultImage,
  DefaultCustomPath,
  DefaultPath,
  DefaultLine,
  DefaultRect,
  DefaultEllipse,
  DefaultIText,
  DefaultCircle,
  DefaultTriangle,
};

// var filters = ['grayscale', 'invert', 'remove-color', 'sepia', 'brownie',
//                       'brightness', 'contrast', 'saturation', 'vibrance', 'noise', 'vintage',
//                       'pixelate', 'blur', 'sharpen', 'emboss', 'technicolor',
//                       'polaroid', 'blend-color', 'gamma', 'kodachrome',
//                       'blackwhite', 'blend-image', 'hue', 'resize'];

//       for (var i = 0; i < filters.length; i++) {
//         $(filters[i]) && (
//         $(filters[i]).checked = !!canvas.getActiveObject().filters[i]);
