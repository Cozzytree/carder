"use client";
import * as fabric from "fabric";
import { useEffect, useRef } from "react";
import CanvasC from "./canvas/canvas";
import {
   DefaultCircle,
   DefaultIText,
   DefaultRect,
} from "./canvas/default_styles";
import { useCanvasStore } from "./canvas/store";
import CanvasOptions from "./canvas/options";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Page() {
   const {
      setFabricObject,
      width,
      height,
      setDrawingMode,
      containerScale,
      setContainerScale,
      activeObject,
   } = useCanvasStore();
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
      });

      return () => {
         canvasC_ref.current?.clear();
      };
   }, []);

   useEffect(() => {
      if (!canvasC_ref.current) return;
      canvasC_ref.current.canvas.set("width", width);
      canvasC_ref.current.canvas.set("height", height);
   }, [width, height]);

   return (
      <div className="w-full overflow-hidden h-screen flex flex-col justify-center items-center">
         <div>Top bar</div>

         {/* {canvas container} */}
         <div className="w-full h-full flex justify-center overflow-auto">
            <div
               ref={containerRef}
               style={{
                  scale: containerScale,
                  // translate: `${(containerScale - 1) * 200}px ${(containerScale - 1) * 400}px`,
               }}
               className="shrink-0 mx-16 my-16 w-full h-full flex justify-center items-center"
            >
               <ScrollArea>
                  <canvas
                     ref={canvasRef}
                     className={`shrink-0 border border-foreground/10 rounded-md shadow-lg`}
                  />
               </ScrollArea>
            </div>
         </div>

         <CanvasOptions canvasC={canvasC_ref} containerRef={containerRef} />
      </div>
   );
}
