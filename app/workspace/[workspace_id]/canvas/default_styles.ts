import * as fabric from "fabric";

class DefaultRect extends fabric.Rect {
  declare hoverShape: fabric.Rect | null;
  constructor(params: Partial<fabric.RectProps>) {
    super({
      fill: "transparent",
      stroke: "black",
      rx: 10,
      ry: 10,
      cornerSize: 10,
      cornerStyle: "circle",
      padding: 1,
      cornerStrokeColor: "#2020ff",
      strokeUniform: true,
      transparentCorners: false,
      cornerColor: "#2090a0",
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
      cornerSize: 10,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 2,
      cornerStyle: "circle",
      padding: 1,
      cornerStrokeColor: "#4040ef",
      strokeUniform: true,
      transparentCorners: false,
      // objectCaching: true,
      ...params,
    });
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
      cornerSize: 10,
      cornerStyle: "circle",
      padding: 1,
      cornerStrokeColor: "#4040ef",
      strokeUniform: true,
      // objectCaching: true,
      shadow: new fabric.Shadow({
        blur: 4,
        offsetX: 2,
        offsetY: 2,
        color: "black",
      }),
    });
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
      cornerStrokeColor: "#5090ff",
      cornerStyle: "circle",
      cornerSize: 10,
      padding: 1,
      transparentCorners: false,
      strokeUniform: true,
      centeredRotation: true,
      shadow: new fabric.Shadow({
        blur: 4,
        offsetX: 2,
        offsetY: 2,
        color: "black",
      }),
      ...params,
    });
  }
}

class DefaultIText extends fabric.Textbox {
  constructor(text: string, params: Partial<fabric.ITextProps>) {
    super(text, {
      stroke: "black",
      cornerSize: 10,
      fontFamily: "sans serif",
      // underline: true,
      cornerStyle: "circle",
      charSpacing: -1,
      padding: 1,
      fontStyle: "italic",
      cornerStrokeColor: "#4040ef",
      strokeUniform: true,
      transparentCorners: false,
      // objectCaching: true,
      ...params,
    });
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
      },
    );
  }
}

class DefaultLine extends fabric.Line {
  constructor(
    points: [number, number, number, number],
    props: Partial<fabric.FabricObjectProps>,
  ) {
    super(points, { ...props });
    this.initilizeControls();
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
      cornerSize: 10,
      cornerStyle: "circle",
      padding: 1,
      cornerStrokeColor: "#0000ff",
      strokeUniform: true,
      transparentCorners: false,
    });
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
      filters: [new fabric.filters.BlackWhite()],
      ...props,
    });
    this.applyFilters();
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
