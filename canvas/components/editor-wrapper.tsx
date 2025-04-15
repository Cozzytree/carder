"use client";

import * as fabric from "fabric";
import CanvasC from "../canvas";
import CanvasEditor from "./CanvasEditor";

import type { DBshape } from "@/lib/types";
import React, { useEffect, useRef } from "react";

import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { MenuIcon } from "lucide-react";
import { canvasConfig, saveOptions } from "../constants";
import { useCanvasStore } from "../store";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { action } from "@/lib/queueShapes";

type props = {
   children?: React.ReactNode;
   initialData?: { shapes: DBshape[]; width: number; height: number };
   onChange: (
      params:
         | fabric.FabricObject
         | { width: number; height: number; background: string },
      action: action,
   ) => void;
};

function EditorWrapper({ initialData, onChange, children }: props) {
   const { theme } = useTheme();
   const width = useCanvasStore((state) => state.width);
   const setWidth = useCanvasStore((state) => state.setWidth);
   const setHeight = useCanvasStore((state) => state.setHeight);
   const snap = useCanvasStore((state) => state.snapping);
   const height = useCanvasStore((state) => state.height);
   const setFabricObject = useCanvasStore((state) => state.setFabricObject);
   const setDrawingMode = useCanvasStore((state) => state.setDrawingMode);
   const setPointerEvents = useCanvasStore((state) => state.setPointerEvents);

   const canvasC_ref = useRef<CanvasC | null>(null);
   const canvasRef = useRef<HTMLCanvasElement | null>(null);

   useEffect(() => {
      if (!canvasRef.current) return;

      if (initialData) {
         setWidth(initialData.width);
         setHeight(initialData.height);
      }

      try {
         fabric.setFilterBackend(new fabric.WebGLFilterBackend());
      } catch (err) {
         console.error(err);
         fabric.setFilterBackend(new fabric.Canvas2dFilterBackend());
      }

      fabric.initFilterBackend();

      const f = new fabric.Canvas(canvasRef.current, {
         width: width,
         height: height,
         preserveObjectStacking: true,
         uniScaleKey: "altKey",
         uniformScaling: true,
         selectionColor: "#20201810",
         selectionDashArray: [4, 4],
         selectionLineWidth: canvasConfig.selectionWidth,
         allowTouchScrolling: true,
      });

      if (initialData?.shapes) {
      }

      f.renderAll();
      canvasC_ref.current = new CanvasC({
         theme,
         snapping: snap,
         canvas: f,
         onCreation: (e) => {
            onChange?.(e, "create");
         },
         onUpdate: (e) => {
            onChange(e, "update");
         },
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
   }, [theme]);

   useEffect(() => {
      if (!canvasC_ref.current) return;
      canvasC_ref.current.changeCanvasSize("width", width);
      canvasC_ref.current.changeCanvasSize("height", height);
      onChange(
         {
            width: width,
            height: height,
            background: canvasC_ref.current.canvas.backgroundColor.toString(),
         },
         "resize",
      );
   }, [width, height]);

   return (
      <div className="h-screen w-full flex flex-1">
         <div className="w-full h-full">
            {/* <div>
               <Popover>
                  <PopoverTrigger>
                     <MenuIcon />
                  </PopoverTrigger>
                  <PopoverContent
                     side="left"
                     align="start"
                     className="w-fit flex flex-col p-0"
                  >
                     {saveOptions.map((o, i) => (
                        <Button
                           variant={"outline"}
                           size={"xs"}
                           className="p-2 rounded-none"
                           onClick={() => {
                              if (!canvasC_ref.current) return;
                              canvasC_ref.current.saveCanvasAs(o.t);
                           }}
                           key={i}
                        >
                           {o.label}
                        </Button>
                     ))}
                     <Button
                        variant={"outline"}
                        size={"xs"}
                        className="p-2 rounded-none"
                     >
                        <label htmlFor="loadfromfile">Load from File</label>
                        <input
                           className="hidden"
                           onChange={async (e) => {
                              if (e.target.files) {
                                 if (!canvasC_ref.current) return;
                                 e.target.files[0].text().then(async (d) => {
                                    await canvasC_ref.current?.loadFromFile(d);
                                 });
                              }
                           }}
                           type="file"
                           id="loadfromfile"
                           accept=".json"
                        />
                     </Button>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button
                              variant={"outline"}
                              size={"xs"}
                              className="p-2 rounded-none"
                           >
                              <span>Theme</span>
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                           <ModeToggle />
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </PopoverContent>
               </Popover>
            </div> */}
            <CanvasEditor canvasC_ref={canvasC_ref} canvasRef={canvasRef} />
         </div>
      </div>
   );
}
export default EditorWrapper;
