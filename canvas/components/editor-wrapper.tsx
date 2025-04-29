"use client";

import * as fabric from "fabric";
import CanvasC from "../canvas";
import CanvasEditor from "./CanvasEditor";

import React, { createContext, useContext, useEffect, useRef } from "react";

import type { Shapes } from "@/api_/types";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MenuIcon } from "lucide-react";
import { canvasConfig, filtersOptions, saveOptions } from "../constants";
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
import { DefaultCircle, DefaultCustomPath, DefaultIText, DefaultRect } from "../default_styles";
import { initialize } from "next/dist/server/lib/router-server";

type props = {
   editable?: boolean;
   showUploads?: boolean;
   children?: React.ReactNode;
   initialData?: {
      shapes?: Shapes[];
      width: number;
      height: number;
      scale?: number;
   };
   onChange?: (params: fabric.FabricObject, action: action) => void;
};

type editorProps = {
   showUploads?: boolean;
   isEdit?: boolean;
};

const EditorContext = createContext<editorProps | undefined>(undefined);

export const useEditorContext = () => {
   const ctx = useContext(EditorContext);
   if (!ctx) throw new Error("useEditoContext must be used within a EditorWrapper");
   return ctx;
};

function EditorWrapper({
   initialData,
   onChange,
   children,
   showUploads = false,
   editable = true,
}: props) {
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
         // setWidth(initialData.width);
         // setHeight(initialData.height);
         setWidth(window.innerWidth);
         setHeight(window.innerHeight);
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
      f.set({
         scaleX: initialData?.scale ? initialData?.scale : 1,
         sacleY: initialData?.scale ? initialData?.scale : 1,
      });

      if (initialData?.shapes) {
         const asyncOperations: Promise<void>[] = [];

         initialData.shapes.forEach((shape) => {
            let newShape: fabric.FabricObject | null = null;
            const s = JSON.parse(shape.props) as fabric.FabricObject;

            if (s.type === "Path") {
               const fp = s as fabric.Path;
               let path = "";
               fp?.path.forEach((p) => {
                  path += p.join(" ") + " ";
               });
               newShape = new DefaultCustomPath(path.trim(), {}, shape.id);
            } else if (s.type === "Circle") {
               const cir = s as fabric.Circle;
               newShape = new DefaultCircle({ radius: cir.radius }, shape.id);
            } else if (s.type === "Rect") {
               newShape = new DefaultRect({}, shape.id);
            } else if (s.type === "Textbox") {
               const t = s as fabric.Text;
               newShape = new DefaultIText(
                  t?.text,
                  {
                     fontSize: t.fontSize,
                     fontFamily: t.fontFamily,
                     fontStyle: t.fontStyle,
                     fontWeight: t.fontWeight,
                     textAlign: t.textAlign,
                     underline: t.underline,
                  },
                  shape.id,
               );
            } else if (s.type === "Image") {
               // Wrap asynchronous image loading in a Promise
               const imagePromise = new Promise<void>((resolve) => {
                  const img = s as fabric.FabricImage;
                  const i = new Image();
                  i.crossOrigin = "Anonymous";
                  i.src = img?.src ?? "";
                  i.onload = () => {
                     // Use fabric.Image constructor (or fabric.FabricImage, depending on your version)
                     const fabricImg = new fabric.FabricImage(i);

                     // If using filters from the original image, assign and apply them
                     if (img.filters && img.filters.length > 0) {
                        fabricImg.filters = img.filters;
                        fabricImg.applyFilters();
                     }
                     newShape = fabricImg;
                     // Set general properties for the shape
                     newShape.set({
                        id: shape.id,
                        fill: s.fill,
                        top: s.top,
                        left: s.left,
                        width: s.width,
                        height: s.height,
                        scaleX: s.scaleX,
                        scaleY: s.scaleY,
                        stroke: s.stroke,
                        strokeWidth: s.strokeWidth,
                        lockScalingX: s.lockScalingX,
                        lockScalingY: s.lockScalingY,
                        shadow: s.shadow,
                        flipX: s.flipX,
                        flipY: s.flipY,
                        lockMovementX: s.lockMovementX,
                        lockMovementY: s.lockMovementY,
                        opacity: s.opacity,
                     });
                     f.add(newShape);
                     // Resolve the promise once the image shape is added
                     resolve();
                  };

                  // Optionally handle error if image fails to load
                  i.onerror = () => {
                     console.error("Error loading image:", i.src);
                     resolve(); // resolve to avoid hanging the promise chain
                  };
               });
               asyncOperations.push(imagePromise);
            }

            // For non-image shapes, set properties and add them immediately
            if (newShape && s.type !== "Image") {
               newShape.set({
                  id: shape.id,
                  fill: s.fill,
                  top: s.top,
                  left: s.left,
                  width: s.width,
                  height: s.height,
                  scaleX: s.scaleX,
                  scaleY: s.scaleY,
                  stroke: s.stroke,
                  strokeWidth: s.strokeWidth,
                  lockScalingX: s.lockScalingX,
                  lockScalingY: s.lockScalingY,
                  shadow: s.shadow,
                  flipX: s.flipX,
                  flipY: s.flipY,
                  lockMovementX: s.lockMovementX,
                  lockMovementY: s.lockMovementY,
                  opacity: s.opacity,
               });
               f.add(newShape);
            }
         });

         // Once all asynchronous operations complete, re-render the canvas.
         Promise.all(asyncOperations).then(() => {
            f.renderAll();
         });
      }

      canvasC_ref.current = new CanvasC({
         theme,
         snapping: snap,
         canvas: f,
         onCreation: (e) => {
            onChange?.(e, "create");
         },
         onUpdate: (e) => {
            onChange?.(e, "update");
         },
         onDelete: (e) => {
            onChange?.(e, "delete");
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
         canvasC_ref.current = null;
      };
   }, [theme]);

   useEffect(() => {
      if (!canvasC_ref.current) return;
      canvasC_ref.current.changeCanvasSize("width", width);
      canvasC_ref.current.changeCanvasSize("height", height);
   }, [width, height]);

   return (
      <EditorContext.Provider value={{ showUploads, isEdit: editable }}>
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
      </EditorContext.Provider>
   );
}

export default EditorWrapper;
