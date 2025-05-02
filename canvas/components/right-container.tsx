import CollapceWithBtn from "@/components/collapseWithBtn";
import CanvasOptions from "../canvas_options";
import BtnWithColor from "./btn-with-color";
import ShapeActions from "./canvas_options/shape_actions";
import ExportShape from "./exportShape";
import FontOptions from "./font_options";
import ImageFiltersOption from "./image_filter_options";
import InputWithValue from "./input-with-value";
import ColorOptions from "./which_option_items/color_options";
import OutlineAndShadow from "./which_option_items/outlineandShaodow";
import ZoomContainer from "./zoom_container";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ActiveSelection, Gradient, Group } from "fabric";
import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { useCanvasStore } from "../store";
import { canvasShapeTypes } from "../types";
import { handleColorfill, handleGradient } from "../utilsfunc";
import { useEditorContext } from "./editor-wrapper";

type props = {
   containerRef: RefObject<HTMLDivElement | null>;
   setContainerZoom: Dispatch<SetStateAction<number>>;
   containerZoom: number;
};

function RightContainer({ containerZoom, containerRef, setContainerZoom }: props) {
   const { sidesOpen, canvas } = useEditorContext();

   const { activeObject, setFabricObject } = useCanvasStore();

   const [sideWidth] = useState(350);

   const isActiveSelection =
      activeObject && (activeObject instanceof ActiveSelection || activeObject instanceof Group);

   const activeObjectFill = isActiveSelection
      ? (activeObject.getObjects().length && activeObject?.getObjects()[0].get("fill")) || null
      : activeObject?.get("fill") || null;
   const activeObjectWidth = activeObject ? activeObject?.get("width") : 0;
   const activeObjectHeight = activeObject ? activeObject.get("height") : 0;

   const spanStyle = "text-xs select-none px-3 text-nowrap";

   const Sept = () => <Separator className="border-[1px] mt-1 mb-2 border-foreground/20" />;

   const height = sidesOpen ? "100%" : activeObject ? "96%" : "fit-content";

   return (
      <div
         style={{
            width: sideWidth + "px",
            left: sidesOpen ? `0px` : `calc(100% - ${sideWidth + 30}px)`,
            top: sidesOpen ? `0px` : `${2}%`,
            position: sidesOpen ? "relative" : "fixed",
            height: height,
         }}
         className={cn(
            sidesOpen ? "border-l-2" : "border-2 rounded-2xl",
            `overflow-y-auto pb-10 border-muted-foreground/20 py-2 bg-muted shadow-md`,
         )}
      >
         {/* <div className="border-l border-l-foreground/50 h-full absolute left-0 top-0" /> */}
         {activeObject ? (
            <div aria-disabled={activeObject == null} className="flex flex-col gap-1">
               <CollapceWithBtn classname={spanStyle} label="Position">
                  <div className="flex items-center justify-evenly gap-1 px-1">
                     <InputWithValue
                        val={activeObject ? activeObject?.get("left") : 0}
                        change={(e) => {
                           if (!canvas.current || !activeObject) return;
                           canvas.current.changeCanvasProperties(activeObject, {
                              left: e,
                           });
                           activeObject?.setCoords();
                           setFabricObject(activeObject);
                        }}
                     >
                        <span className="text-xs">X</span>
                     </InputWithValue>
                     <InputWithValue
                        val={activeObject?.get("top") || 0}
                        change={(e) => {
                           if (!canvas.current || !activeObject) return;

                           canvas.current.changeCanvasProperties(activeObject, {
                              top: e,
                           });
                           activeObject.setCoords();
                           setFabricObject(activeObject);
                        }}
                     >
                        <span>Y</span>
                     </InputWithValue>
                  </div>
               </CollapceWithBtn>

               {/* {scale} */}
               <CollapceWithBtn label="Scale" classname={spanStyle}>
                  <div className="flex items-center justify-evenly gap-2 px-1">
                     <InputWithValue
                        change={(e) => {
                           if (!canvas.current || !activeObject) return;
                           canvas.current.changeCanvasProperties(activeObject, { scaleX: e });
                           activeObject.setCoords();
                           setFabricObject(activeObject);
                        }}
                        val={
                           activeObject instanceof ActiveSelection
                              ? activeObject.getObjects().length
                                 ? activeObject.getObjects()[0].get("scaleX")
                                 : 0
                              : activeObject?.get("scaleX") || 0
                        }
                     >
                        <span className="text-xs">X</span>
                     </InputWithValue>
                     <InputWithValue
                        change={(e) => {
                           if (!canvas.current || !activeObject) return;
                           canvas.current.changeCanvasProperties(activeObject, { scaleY: e });
                           activeObject.setCoords();
                           setFabricObject(activeObject);
                        }}
                        val={
                           activeObject instanceof ActiveSelection
                              ? activeObject.getObjects().length
                                 ? activeObject.getObjects()[0].get("scaleY")
                                 : 0
                              : activeObject?.get("scaleY") || 0
                        }
                     >
                        <span className="text-xs">Y</span>
                     </InputWithValue>
                  </div>
               </CollapceWithBtn>

               <InputWithValue
                  val={
                     isActiveSelection
                        ? (activeObject.getObjects().length &&
                             activeObject.getObjects()[0].get("angle")) ||
                          activeObject?.get("angle") ||
                          0
                        : activeObject?.get("angle") || 0
                  }
                  change={(e) => {
                     if (!canvas.current || !activeObject) return;
                     canvas.current.changeCanvasProperties(activeObject, {
                        angle: e,
                     });
                     activeObject.setCoords();
                     setFabricObject(activeObject);
                  }}
               >
                  <span className="text-xs select-none">Rotation</span>
               </InputWithValue>

               <div className="space-y-2">
                  <span className={spanStyle}>Layout</span>
                  <Sept />
                  <div className="grid grid-cols-2 gap-2">
                     <InputWithValue
                        val={
                           activeObject instanceof ActiveSelection
                              ? activeObject.getObjects().length
                                 ? activeObject.getObjects()[0].get("width")
                                 : 0
                              : activeObject?.get("width") || 0
                        }
                        change={(e) => {
                           if (!canvas.current || !activeObject) return;

                           canvas.current.changeCanvasProperties(activeObject, {
                              width: e,
                           });
                           activeObject.setCoords();
                           setFabricObject(activeObject);
                        }}
                     >
                        <span className="text-xs">W</span>
                     </InputWithValue>
                     <InputWithValue
                        val={
                           activeObject instanceof ActiveSelection
                              ? activeObject.getObjects().length
                                 ? activeObject.getObjects()[0].get("height")
                                 : 0
                              : activeObject?.get("height") || 0
                        }
                        change={(e) => {
                           if (!canvas.current || !activeObject) return;
                           canvas.current.changeCanvasProperties(activeObject, {
                              height: e,
                           });
                           activeObject.setCoords();
                           setFabricObject(activeObject);
                        }}
                     >
                        <span className="text-xs">H</span>
                     </InputWithValue>

                     {activeObject?.type === canvasShapeTypes.circle && (
                        <InputWithValue
                           val={activeObject?.get("radius") ?? 0}
                           change={(e) => {
                              if (!canvas.current || !activeObject) return;
                              canvas.current.changeCanvasProperties(activeObject, {
                                 radius: e,
                              });
                              activeObject.setCoords();
                           }}
                        >
                           <span>R</span>
                        </InputWithValue>
                     )}

                     {/* {/rect radius } */}
                     {activeObject?.type === canvasShapeTypes.rect && (
                        <>
                           <InputWithValue
                              val={activeObject?.get("radius") ?? 0}
                              change={(e) => {
                                 if (!canvas.current || !activeObject || e > 60) return;
                                 canvas.current.changeCanvasProperties(activeObject, {
                                    rx: e,
                                 });
                                 activeObject.setCoords();
                              }}
                           >
                              <span className={spanStyle}>R-X</span>
                           </InputWithValue>
                           <InputWithValue
                              val={activeObject?.get("radius") ?? 0}
                              change={(e) => {
                                 if (!canvas.current || !activeObject || e > 60) return;
                                 canvas.current.changeCanvasProperties(activeObject, {
                                    ry: e,
                                 });
                                 activeObject.setCoords();
                              }}
                           >
                              <span className={spanStyle}>R-Y</span>
                           </InputWithValue>
                        </>
                     )}
                  </div>
               </div>

               <Sept />

               <div className="flex items-center gap-2 px-3">
                  <span className={spanStyle}>Fill</span>
                  <Popover>
                     <PopoverTrigger
                        disabled={activeObject == null}
                        className="flex items-center gap-1"
                     >
                        <BtnWithColor w={20} h={20} color={activeObjectFill} />
                     </PopoverTrigger>
                     <PopoverContent
                        side="left"
                        align="center"
                        className="w-fit border-foreground/20"
                     >
                        <ColorOptions
                           showGradient
                           showGradientOptions
                           forCanvas={false}
                           canvasC={canvas}
                           height={activeObjectWidth || 0}
                           width={activeObjectHeight || 0}
                           color={activeObjectFill as string | Gradient<"linear" | "gradient">}
                           handleColor={(v) => {
                              handleColorfill({
                                 activeObject: activeObject,
                                 canvasC: canvas,
                                 color: v,
                                 fn: () => {
                                    setFabricObject(activeObject);
                                 },
                              });
                           }}
                           handleGradient={(c, t) => {
                              if (!activeObject) return;
                              handleGradient({
                                 params: "fill",
                                 type: t ? t : "linear",
                                 activeObject: activeObject,
                                 canvasC: canvas,
                                 color: c,
                                 fn: () => {
                                    setFabricObject(activeObject);
                                 },
                              });
                           }}
                        />
                     </PopoverContent>
                  </Popover>
                  {(activeObject?.type == "textbox" || activeObject?.type == "i-text") && (
                     <FontOptions canvasC={canvas} />
                  )}
               </div>

               {activeObject.type === "image" && (
                  <CollapceWithBtn label="Filters" classname="px-3">
                     <div className="max-h-[200px] overflow-y-auto">
                        <ImageFiltersOption canvasC={canvas} />
                     </div>
                  </CollapceWithBtn>
               )}

               <OutlineAndShadow canvasC={canvas} />

               <CollapceWithBtn label="Actions" classname={spanStyle}>
                  <ShapeActions canvasC={canvas} />
               </CollapceWithBtn>

               <CollapceWithBtn label="Export" classname={spanStyle}>
                  <ExportShape canvasC={canvas} />
               </CollapceWithBtn>
            </div>
         ) : (
            <div className={"flex flex-col"}>
               <CanvasOptions canvasC={canvas} />

               <Sept />

               <ZoomContainer
                  containerRef={containerRef}
                  handleZoom={(v) => {
                     setContainerZoom(v);
                  }}
                  zoomLevel={containerZoom}
               />
            </div>
         )}
      </div>
   );
}

export default RightContainer;
