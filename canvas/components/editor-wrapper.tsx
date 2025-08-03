"use client";

import * as fabric from "fabric";
import CanvasC from "../canvas";
import CanvasEditor from "./CanvasEditor";

import React, { createContext, RefObject, useContext, useEffect, useRef, useState } from "react";
import type { Shapes } from "@/api_/types";
import { action } from "@/lib/queueShapes";
import { useTheme } from "next-themes";
import { canvasConfig } from "../constants";
import { DefaultCircle, DefaultCustomPath, DefaultIText, DefaultRect } from "../default_styles";
import { useCanvasStore } from "../store";
import { createNewImage } from "../utilsfunc";
import { TransformWrapper } from "react-zoom-pan-pinch";

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
   onChange?: ({
      action,
      params,
      props,
   }: {
      action: action;
      params?: fabric.FabricObject;
      props?: { width: number; height: number; background: string };
   }) => void;
};

type editorProps = {
   sideWidth: number;
   setSideWidth: (v: number) => void;
   showUploads?: boolean;
   isEdit?: boolean;
   sidesOpen: boolean;
   handleSideToggle: (v?: boolean) => void;
   canvas: RefObject<CanvasC | null>;
};

const EditorContext = createContext<editorProps | undefined>(undefined);

export const useEditorContext = () => {
   const ctx = useContext(EditorContext);
   if (!ctx) throw new Error("useEditoContext must be used within a EditorWrapper");
   return ctx;
};

function EditorWrapper({ initialData, onChange, showUploads = false, editable = true }: props) {
   const [sideWidth, setSideWidth] = useState(300);
   const [isSideOpen, setSideOpen] = useState(true);

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
      let isInitialized = false;

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

      const asyncOperations: Promise<void>[] = [];
      (async function () {
         if (initialData?.shapes) {
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
                  const imgPromise = new Promise<void>((resolve) => {
                     (async function () {
                        const img = await createNewImage({
                           height: f.width,
                           width: f.height,
                           img: JSON.parse(shape.props)?.src || "",
                           props: {
                              left: s.left,
                              top: s.top,
                              lockRotation: s.lockRotation,
                              lockMovementX: s.lockScalingX,
                              lockMovementY: s.lockScalingY,
                              width: s.width,
                              height: s.height,
                              scaleX: s.scaleX,
                              scaleY: s.scaleY,
                           },
                        });
                        if (img) {
                           f.add(img);
                           f.set("id", shape.id);
                           resolve();
                        }
                     })();
                  });
                  asyncOperations.push(imgPromise);
               }

               // For non-image shapes, set properties and add them immediately
               if (newShape && s.type !== "Image") {
                  newShape.set({
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

            // f.renderAll();
            // Once all asynchronous operations complete, re-render the canvas.
            await Promise.all(asyncOperations).then(() => {
               isInitialized = true;
            });
            // f.renderAll();
         }
      })();

      canvasC_ref.current = new CanvasC({
         theme,
         snapping: snap,
         canvas: f,
         onCreation: (e) => {
            if (!isInitialized) return;
            onChange?.({ params: e, action: "create" });
         },
         onUpdate: (e) => {
            if (!isInitialized) return;
            onChange?.({ params: e, action: "update" });
         },
         onDelete: (e) => {
            if (!isInitialized) return;
            onChange?.({ params: e, action: "delete" });
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
      onChange?.({
         action: "canvas-props",
         props: {
            background: String(canvasC_ref?.current?.canvas?.backgroundColor) || "",
            width,
            height,
         },
      });
   }, [width, height]);

   return (
      <TransformWrapper
         alignmentAnimation={{ disabled: true }}
         panning={{
            disabled: true,
         }}
         zoomAnimation={{ animationType: "easeInQuad" }}
         minScale={0.5}
         maxScale={3.0}
         centerZoomedOut={true}
         smooth={false}
         centerOnInit={true}
      >
         <EditorContext.Provider
            value={{
               setSideWidth: (v) => {
                  setSideWidth(v);
               },
               sideWidth,
               canvas: canvasC_ref,
               showUploads,
               isEdit: editable,
               sidesOpen: isSideOpen,
               handleSideToggle: (v) => {
                  if (v !== undefined) {
                     setSideOpen(v);
                  } else {
                     setSideOpen((e) => !e);
                  }
               },
            }}
         >
            <div className="h-screen w-full flex flex-1">
               <div className="w-full h-full">
                  <CanvasEditor canvasC_ref={canvasC_ref} canvasRef={canvasRef} />
               </div>
            </div>
         </EditorContext.Provider>
      </TransformWrapper>
   );
}

export default EditorWrapper;
