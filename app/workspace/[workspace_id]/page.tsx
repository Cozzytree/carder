"use client";
import * as fabric from "fabric";
import { useEffect, useRef, useState } from "react";
import CanvasC from "./canvas/canvas";
import {
   DefaultCircle,
   DefaultCustomPath,
   DefaultIText,
   DefaultLine,
   DefaultRect,
} from "./canvas/default_styles";
import { useCanvasStore } from "./canvas/store";
import CanvasOptions from "./canvas/options";

export default function Page() {
   const {
      setFabricObject,
      width,
      height,
      setDrawingMode,
      containerScale,
      setPointerEvents,
   } = useCanvasStore();
   const [containerZoom, setContainerZoom] = useState(1);
   const canvasRef = useRef<HTMLCanvasElement | null>(null);
   const canvasC_ref = useRef<CanvasC | null>(null);
   const containerRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      if (!canvasRef.current) return;
      const f = new fabric.Canvas(canvasRef.current, {
         width: width,
         height: height,
         preserveObjectStacking: true,
         uniScaleKey: "altKey",
         uniformScaling: true,
      });

      f.add(
         new DefaultCustomPath(
            `M 20 20
         A 10 10 0 0 1 40 20
         L 120 20
         A 10 10 0 0 1 120 40
         L 100 80
         A 10 10 0 0 1 80 80
         L 0 80
         A 10 10 0 0 1 0 60
         Z`,
            {},
         ),
         new DefaultLine([10, 20, 100, 100], {
            top: 100,
            left: 100,
            stroke: "black",
            strokeWidth: 3,
            strokeUniform: true,
            width: 10,
         }),
         new DefaultRect({
            top: 50,
            left: 50,
            stroke: "black",
            strokeWidth: 2,
            rx: 10,
            ry: 10,
            width: 100,
            height: 100,
            fill: "transparent",
         }),
         new DefaultIText("Hello Seattle", {
            fontFamily: "Balsamiq Sans",
            fontSize: 15,
            top: 20,
            left: 20,
            width: 50,
            stroke: "black",
         }),
         new DefaultCircle({
            top: 50,
            left: 50,
            radius: 20,
            stroke: "black",
         }),
      );
      f.renderAll();
      canvasC_ref.current = new CanvasC({
         canvas: f,
         callbackSeleted: (e) => {
            setFabricObject(e);
         },
         callbackDrawMode: (v) => {
            setDrawingMode(v);
         },
         canvasElement: canvasRef.current,
         changePointerEventsForCanvas: (v) => {
            setPointerEvents(v);
         },
      });

      return () => {
         canvasC_ref.current?.clear();
      };
   }, [width, height]);

   useEffect(() => {
      const handler = () => {
         if (!canvasRef.current) return;
         if (containerRef.current) {
            containerRef.current.scrollIntoView({
               behavior: "smooth",
               block: "center",
               inline: "center",
            });
         }

         if (window.innerWidth <= 480) {
            canvasRef.current.style.pointerEvents = "none";
         } else {
            canvasRef.current.style.pointerEvents = "auto";
         }
      };
      handler();
      window.addEventListener("resize", handler);
      return () => {
         window.removeEventListener("resize", handler);
      };
   }, []);

   // useEffect(() => {
   //    if (!canvasC_ref.current) return;
   //    canvasC_ref.current.canvas.set("width", width);
   //    canvasC_ref.current.canvas.set("height", height);
   // }, [width, height]);

   return (
      <div className="w-full overflow-hidden h-screen flex flex-col justify-center items-center">
         <div>Top bar</div>

         {/* {canvas container} */}
         <div className="w-full h-full flex justify-center overflow-auto">
            <div
               ref={containerRef}
               style={{
                  scale: containerScale,
               }}
               className="shrink-0 w-full h-full relative"
            >
               <div
                  className="w-full h-full absolute top-0 left-0 grid place-items-center"
                  style={{
                     translate: `${(containerZoom - 1) * 100}px ${(containerZoom - 1) * 100}px`,
                  }}
               >
                  <canvas
                     ref={canvasRef}
                     className={`shrink-0 border border-foreground/10 rounded-md shadow-lg`}
                  />
               </div>
            </div>
         </div>

         <CanvasOptions
            containerZoom={containerZoom}
            setContainerZoom={setContainerZoom}
            canvasC={canvasC_ref}
            containerRef={containerRef}
         />
      </div>
   );
}
