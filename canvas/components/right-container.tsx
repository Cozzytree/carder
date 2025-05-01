import CanvasC from "../canvas";
import FontOptions from "./font_options";
import BtnWithColor from "./btn-with-color";
import InputWithValue from "./input-with-value";
import ShapeActions from "./canvas_options/shape_actions";
import ColorOptions from "./which_option_items/color_options";
import OutlineAndShadow from "./which_option_items/outlineandShaodow";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { ActiveSelection, Gradient, Group } from "fabric";
import { useCanvasStore } from "../store";
import { handleColorfill, handleGradient } from "../utilsfunc";
import { Separator } from "@/components/ui/separator";
import CanvasOptions from "../options";
import ZoomContainer from "./zoom_container";
import { canvasShapeTypes } from "../types";
import ImageFiltersOption from "./image_filter_options";

type props = {
   containerRef: RefObject<HTMLDivElement | null>;
   canvasC: RefObject<CanvasC | null>;
   setContainerZoom: Dispatch<SetStateAction<number>>;
   containerZoom: number;
};

function RightContainer({ canvasC, containerZoom, containerRef, setContainerZoom }: props) {
   const setFabricObject = useCanvasStore((state) => state.setFabricObject);
   const activeObject = useCanvasStore((state) => state.activeObject);

   const [sideWidth, setSideWidth] = useState(350);

   const isActiveSelection =
      activeObject && (activeObject instanceof ActiveSelection || activeObject instanceof Group);

   const activeObjectFill = isActiveSelection
      ? (activeObject.getObjects().length && activeObject?.getObjects()[0].get("fill")) || null
      : activeObject?.get("fill") || null;
   const activeObjectWidth = activeObject ? activeObject?.get("width") : 0;
   const activeObjectHeight = activeObject ? activeObject.get("height") : 0;

   const spanStyle = "text-xs select-none px-3 text-nowrap";

   const Sept = () => <Separator className="border-[1px] mt-1 mb-2 border-foreground/20" />;

   return (
      <div
         style={{
            width: sideWidth + "px",
         }}
         className={`overflow-y-auto pb-10 py-2 border-l border-l-foreground/50`}
      >
         {activeObject ? (
            <div aria-disabled={activeObject == null} className="flex flex-col gap-1">
               <div className="space-y-2">
                  <span className={spanStyle}>Position</span>
                  <Sept />
                  <div className="flex items-center justify-evenly gap-1 px-1">
                     <InputWithValue
                        val={activeObject ? activeObject?.get("left") : 0}
                        change={(e) => {
                           if (!canvasC.current || !activeObject) return;
                           canvasC.current.changeCanvasProperties(activeObject, {
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
                           if (!canvasC.current || !activeObject) return;

                           canvasC.current.changeCanvasProperties(activeObject, {
                              top: e,
                           });
                           activeObject.setCoords();
                           setFabricObject(activeObject);
                        }}
                     >
                        <span>Y</span>
                     </InputWithValue>
                  </div>
               </div>

               {/* {scale} */}
               <div className="space-y-2">
                  <span className={spanStyle}>Scale</span>
                  <Sept />
                  <div className="flex items-center justify-evenly gap-2 px-1">
                     <InputWithValue
                        change={(e) => {
                           if (!canvasC.current || !activeObject) return;
                           canvasC.current.changeCanvasProperties(activeObject, { scaleX: e });
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
                           if (!canvasC.current || !activeObject) return;
                           canvasC.current.changeCanvasProperties(activeObject, { scaleY: e });
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
               </div>

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
                     if (!canvasC.current || !activeObject) return;
                     canvasC.current.changeCanvasProperties(activeObject, {
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
                           if (!canvasC.current || !activeObject) return;

                           canvasC.current.changeCanvasProperties(activeObject, {
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
                           if (!canvasC.current || !activeObject) return;
                           canvasC.current.changeCanvasProperties(activeObject, {
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
                              if (!canvasC.current || !activeObject) return;
                              canvasC.current.changeCanvasProperties(activeObject, {
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
                                 if (!canvasC.current || !activeObject || e > 60) return;
                                 canvasC.current.changeCanvasProperties(activeObject, {
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
                                 if (!canvasC.current || !activeObject || e > 60) return;
                                 canvasC.current.changeCanvasProperties(activeObject, {
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
                           canvasC={canvasC}
                           height={activeObjectWidth || 0}
                           width={activeObjectHeight || 0}
                           color={activeObjectFill as string | Gradient<"linear" | "gradient">}
                           handleColor={(v) => {
                              handleColorfill({
                                 activeObject: activeObject,
                                 canvasC: canvasC,
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
                                 canvasC: canvasC,
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
                     <FontOptions canvasC={canvasC} />
                  )}
               </div>

               {activeObject.type === "image" && (
                  <>
                     <Sept />
                     <div className="flex flex-col gap-2">
                        <span className={spanStyle}>Filters</span>
                        <div className="max-h-[200px] overflow-y-auto">
                           <ImageFiltersOption canvasC={canvasC} />
                        </div>
                     </div>
                  </>
               )}

               <Sept />

               <OutlineAndShadow canvasC={canvasC} />

               <div className="w-full border border-foreground/30" />

               <div className="px-2 text-md">
                  <h4 className="font-semibold">Actions</h4>
                  <ShapeActions canvasC={canvasC} />
               </div>
            </div>
         ) : (
            <div className="flex flex-col">
               <CanvasOptions canvasC={canvasC} />

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
