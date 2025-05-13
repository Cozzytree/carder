import { v4 as uuid } from "uuid";
import { Canvas, ColorStop, FabricImage, FabricObject, Gradient, ImageProps } from "fabric";
import { RefObject } from "react";
import CanvasC from "./canvas";
import { filtersOptions } from "./constants";

function changeWidth({
   obj,
   canvas,
   props,
   fn,
}: {
   obj: FabricObject | null;
   canvas?: Canvas;
   props: Record<string, any>;
   fn?: () => void;
}) {
   if (canvas || FabricObject) return;
}

const handleColorfill = ({
   fn,
   color,
   canvasC,
   activeObject,
}: {
   color: string;
   activeObject?: FabricObject | null;
   canvasC: RefObject<CanvasC | null>;
   fn: () => void;
}) => {
   if (!canvasC.current) return;
   if (activeObject) {
      canvasC.current.changeCanvasProperties(activeObject, { fill: color });
   } else {
      canvasC.current.changeCanvasColor(color);
   }
   fn();
};

const handleGradient = ({
   fn,
   color,
   type,
   canvasC,
   activeObject,
   gradientT,
   params,
}: {
   params?: string;
   gradientT?: Gradient<"linear" | "radial">;
   type?: "radial" | "linear";
   color: string[];
   activeObject: FabricObject | null;
   canvasC: RefObject<CanvasC | null>;
   fn: () => void;
}) => {
   if (!canvasC.current) return;
   const divide = 1 / (color.length - 1);

   const stops: ColorStop[] = color.map((c, i) => ({
      color: c,
      offset: divide * i,
   }));

   if (activeObject && params) {
      const coords =
         type === "linear"
            ? {
                 x1: activeObject.height / 2,
                 y1: activeObject.width / 2,
                 x2: activeObject.width,
                 y2: activeObject.height,
              }
            : {
                 x1: activeObject.width / 2,
                 y1: activeObject.height / 2,
                 x2: activeObject.width / 2,
                 y2: activeObject.height / 2,
                 r1: activeObject.width / 6, // inner circle radius
                 r2: activeObject.width / 1.2, // outer circle radius
              };
      const gradient = new Gradient({
         type: type,
         coords,
         colorStops: stops,
      });

      canvasC.current.changeCanvasProperties(activeObject, {
         [params]: gradientT ? gradientT : gradient,
      });
   } else {
      const coords =
         type == "radial"
            ? {
                 x1: canvasC.current.canvas.width / 2,
                 y1: canvasC.current.canvas.height / 2,
                 x2: canvasC.current.canvas.width / 2,
                 y2: canvasC.current.canvas.height / 2,
                 r1: canvasC.current.canvas.width / 6, // inner circle radius
                 r2: canvasC.current.canvas.width / 2, // outer circle radius
              }
            : {
                 x1: 0,
                 y1: 0,
                 x2: 0,
                 y2: canvasC.current.canvas.height,
              };
      const gradient = new Gradient({
         coords,
         type: type,
         colorStops: stops,
      });
      canvasC.current.changeCanvasColor(gradient);
   }
   fn();
};

const changeGradientProperties = ({}: { canvasC: RefObject<CanvasC | null> }) => {};

async function createNewImage({
   img,
   props,
   height,
   width,
}: {
   img: string | HTMLImageElement;
   props?: Partial<ImageProps>;
   width: number;
   height: number;
}) {
   let image: FabricImage | null = null;
   if (img instanceof HTMLImageElement) {
      img.crossOrigin = "Anonymous";
      image = new FabricImage(img);
   } else {
      const newImg = new Image();
      newImg.crossOrigin = "Anonymous";
      newImg.src = img;

      await new Promise<void>((resolve, reject) => {
         newImg.onload = async () => {
            image = new FabricImage(newImg);
            resolve();
         };
         newImg.onerror = (err) => {
            console.error("Error loading image from URL:", err);
            reject(err);
         };
      });
   }

   if (image instanceof FabricImage && props?.filters && !props.filters?.length) {
      image.filters = Array.from({ length: filtersOptions.length });
   }

   if (image) {
      // Calculate scale to fit image within canvas (with padding)
      const padding = 20;
      const maxWidth = width - padding * 2;
      const maxHeight = height - padding * 2;

      const scaleX = maxWidth / image.width;
      const scaleY = maxHeight / image.height;
      const scale = Math.min(scaleX, scaleY, 1); // Don’t upscale small images

      image.scale(scale); // Uniform scale — keeps aspect ratio

      image.set({
         id: uuid(),
         left: (width - image.getScaledWidth()) / 2,
         top: (height - image.getScaledHeight()) / 2,
         cornerSize: 10,
         padding: 1,
         strokeUniform: true,
         objectCaching: true,
         selectable: true,
         hasControls: true,
         hasBorders: true,
         lockScalingFlip: true,
         ...props,
      });
   } else {
      return null;
   }
   return image;
}

export { changeWidth, handleGradient, handleColorfill, createNewImage };
