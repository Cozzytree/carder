"use client";
import * as fabric from "fabric";
import { useEffect, useRef } from "react";
import CanvasC from "./canvas/canvas";
import {
   DefaultCircle,
   DefaultIText,
   DefaultRect,
} from "./canvas/default_styles";
import { useCanvasStore, useOtherStore } from "./canvas/store";
import CanvasOptions from "./canvas/options";
import { Slider } from "@/components/ui/slider";

export default function Page() {
   const { setFabricObject } = useCanvasStore();
   const { containerScale, setContainerScale } = useOtherStore();
   const canvasRef = useRef<HTMLCanvasElement | null>(null);
   const canvasC_ref = useRef<CanvasC | null>(null);
   const containerRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      if (!canvasRef.current) return;
      const f = new fabric.Canvas(canvasRef.current, {
         width: 500,
         height: 800,
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
      });

      return () => {
         canvasC_ref.current?.clear();
      };
   }, []);

   useEffect(() => {
      if (!canvasC_ref.current) return;
   }, []);

   return (
      <div className="w-full overflow-hidden h-screen flex flex-col justify-center items-center">
         <div>Top bar</div>

         {/* {canvas container} */}
         <div className="w-full h-full flex justify-center overflow-auto">
            <div
               ref={containerRef}
               style={{
                  scale: containerScale,
                  translate: `${(containerScale - 1) * 200}px ${(containerScale - 1) * 500}px`,
               }}
               className="w-full h-full flex justify-center items-center"
            >
               <canvas
                  ref={canvasRef}
                  className="border border-foreground/10 rounded-md shadow-lg"
               />
            </div>
         </div>

         <CanvasOptions canvasC={canvasC_ref} />
         <div className="w-full flex justify-center items-center h-14 bg-foreground/10">
            <div className="w-48 flex items-center gap-1">
               <span>{(containerScale * 100).toFixed(0)}</span>
               <Slider
                  defaultValue={[containerScale]}
                  onValueChange={(e) => {
                     const v = Number(e[0]);
                     if (containerRef.current) {
                        setContainerScale(v / 100);
                        containerRef.current.style.scale = `${v / 100}`;
                     }
                  }}
                  min={20}
                  // step={25}
                  max={500}
               />
            </div>
         </div>
      </div>
   );
}
