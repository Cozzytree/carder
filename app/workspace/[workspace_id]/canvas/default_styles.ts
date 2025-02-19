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
         padding: 2,
         cornerStrokeColor: "#4040ef",
         strokeUniform: true,
         shadow: new fabric.Shadow({
            offsetX: 1,
            offsetY: 2,
            color: "black",
            blur: 5,
         }),
         // objectCaching: true,
         ...params,
      });
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
         padding: 2,
         cornerStrokeColor: "#4040ef",
         strokeUniform: true,
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
         fill: "transparent",
         cornerColor: "transparent",
         transparentCorners: false,
         centeredRotation: true,
         cornerSize: 10,
         cornerStyle: "circle",
         padding: 2,
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
         padding: 2,
         transparentCorners: false,
         strokeUniform: true,
         // objectCaching: true,
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

class DefaultIText extends fabric.IText {
   constructor(text: string, params: Partial<fabric.ITextProps>) {
      super(text, {
         stroke: "black",
         cornerSize: 10,
         fontFamily: "sans serif",
         // underline: true,
         cornerStyle: "circle",
         padding: 2,
         fontStyle: "italic",
         cornerStrokeColor: "#4040ef",
         strokeUniform: true,
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
            padding: 2,
            cornerStrokeColor: "#4040ef",
            // objectCaching: true,
         },
      );
   }
}

export {
   DefaultPath,
   DefaultRect,
   DefaultEllipse,
   DefaultIText,
   DefaultCircle,
   DefaultTriangle,
};
