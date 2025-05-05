import CollapceWithBtn from "@/components/collapseWithBtn";
import CanvasC from "./canvas";
import CanvasOptions from "./canvas_options";
import BtnWithColor from "./components/btn-with-color";
import ShapeActions from "./components/canvas_options/shape_actions";
import ExportShape from "./components/exportShape";
import FontOptionUpdated from "./components/font_option(updated)";
import ImageFiltersOption from "./components/image_filter_options";
import ImageOption from "./components/image_option";
import InputWithValue from "./components/input-with-value";
import OpacityOption from "./components/opacity_option";
import ColorOptions from "./components/which_option_items/color_options";
import FontOptions from "./components/which_option_items/fonts_option(big)";
import OutlineAndShadow from "./components/which_option_items/outlineandShaodow";
import Shapes from "./components/which_option_items/shapes";
import TextOptions from "./components/which_option_items/texts_o";

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { debouncer } from "@/lib/utils";
import { ActiveSelection, Gradient, Group } from "fabric";
import {
   BoxIcon,
   BrushIcon,
   FilterIcon,
   ImagesIcon,
   MousePointer2,
   PencilIcon,
   PencilLine,
   RedoIcon,
   SettingsIcon,
   TypeIcon,
   TypeOutline,
   UndoIcon,
} from "lucide-react";
import { RefObject } from "react";
import { useEditorContext } from "./components/editor-wrapper";
import { brushes } from "./constants";
import { useIsMobile } from "./hooks/isMobile";
import { useCanvasStore } from "./store";
import { handleColorfill, handleGradient } from "./utilsfunc";

function OptionsMobile({ canvasC }: { canvasC: RefObject<CanvasC | null> }) {
   const { canvas } = useEditorContext();
   const { activeObject, setFabricObject } = useCanvasStore();

   const isActiveSelection =
      activeObject && (activeObject instanceof ActiveSelection || activeObject instanceof Group);
   const activeObjectFill = isActiveSelection
      ? (activeObject.getObjects().length && activeObject?.getObjects()[0].get("fill")) || null
      : activeObject?.get("fill") || null;
   const activeObjectWidth = activeObject ? activeObject?.get("width") : 0;
   const activeObjectHeight = activeObject ? activeObject.get("height") : 0;
   const { isMobile } = useIsMobile();

   if (canvasC.current?.canvas.isDrawingMode) {
      return (
         <div className="w-full px-2 flex items-center gap-3">
            <Popover>
               <PopoverTrigger>
                  <BrushIcon className="2-5 h-5" />
               </PopoverTrigger>
               <PopoverContent className="w-fit">
                  {brushes.map((b, i) => (
                     <div key={i} className="py-2">
                        <button
                           className="hover:scale-[1.2] transition-all duration-150 cursor-pointer"
                           onClick={() => {
                              if (!canvasC.current) return;
                              canvasC.current.setBrushType(b.btype);
                           }}
                        >
                           <b.I className="w-5 h-5" />
                        </button>
                     </div>
                  ))}
               </PopoverContent>
            </Popover>
            <Popover>
               <PopoverTrigger asChild>
                  <button
                     className="w-5 h-5 rounded-full border border-foreground/50"
                     style={{ background: canvasC.current.brush_props.stroke_color }}
                  />
               </PopoverTrigger>
               <PopoverContent className="w-fit flex flex-col gap-2">
                  <ColorOptions
                     handleGradient={(e) => {}}
                     handleColor={(c) => {
                        if (!canvasC.current) return;
                        canvasC.current?.setBrushColor(c);
                     }}
                  />
                  <div>
                     <h4>Stroke</h4>
                     <Slider
                        min={1}
                        max={100}
                        step={1}
                        defaultValue={[canvasC.current.brush_props.stroke]}
                        onValueChange={debouncer((e: number[]) => {
                           if (!canvasC.current) return;
                           const n = e[0];
                           if (n < 0) return;
                           canvasC.current?.setBrushWidth(n);
                        })}
                     />
                  </div>
               </PopoverContent>
            </Popover>
            <button
               onClick={() => {
                  if (!canvasC.current) return;
                  canvasC.current.canvasToggleDrawMode(false);
               }}
            >
               <MousePointer2 cursor={"pointer"} className="w-5 h-5" />
            </button>
         </div>
      );
   }

   return (
      <div className="w-full px-2 flex items-center gap-3">
         {isMobile && (
            <Popover>
               <PopoverTrigger>S</PopoverTrigger>
               <PopoverContent>
                  <CanvasOptions canvasC={canvas} />
               </PopoverContent>
            </Popover>
         )}
         {activeObject ? (
            <>
               {(activeObject.type === "text" ||
                  activeObject.type === "textbox" ||
                  activeObject.type === "i-text") && (
                  <Popover>
                     <PopoverTrigger>
                        <TypeOutline className="w-4 h-4" />
                     </PopoverTrigger>
                     <PopoverContent className="space-y-2">
                        <FontOptionUpdated canvasC={canvasC} />
                        <DropdownMenu>
                           <DropdownMenuTrigger className="text-sm">Fonts</DropdownMenuTrigger>
                           <DropdownMenuContent align="end" side="right">
                              <FontOptions canvasC={canvasC} />
                           </DropdownMenuContent>
                        </DropdownMenu>
                     </PopoverContent>
                  </Popover>
               )}

               {/* {stroke} */}
               {isMobile && (
                  <Popover>
                     <PopoverTrigger>
                        <PencilLine className="w-4 h-4" />
                     </PopoverTrigger>
                     <PopoverContent>
                        <OutlineAndShadow canvasC={canvasC} />
                     </PopoverContent>
                  </Popover>
               )}

               {activeObject.type === "image" && isMobile && (
                  <Popover>
                     <PopoverTrigger>
                        <FilterIcon className="w-4 h-4" />
                     </PopoverTrigger>
                     <PopoverContent
                        sideOffset={10}
                        className="p-4 w-[200px] max-h-[400px] overflow-y-auto"
                     >
                        <ImageFiltersOption canvasC={canvasC} />
                     </PopoverContent>
                  </Popover>
               )}

               {/* {activeObject.type == "rect" && (
                  <RadiusOption
                     radiuses={activeObject instanceof Rect ? activeObject?.rx : 0}
                     fn={(v) => {
                        if (!canvasC.current) return;
                        canvasC.current.changeCanvasProperties(activeObject, {
                           rx: v,
                        });
                        canvasC.current.changeCanvasProperties(activeObject, {
                           ry: v,
                        });
                     }}
                  />
               )} */}
            </>
         ) : (
            <>
               {/* {images} */}
               <Popover>
                  <PopoverTrigger>
                     <ImagesIcon className="w-4 h-4" />
                  </PopoverTrigger>
                  <PopoverContent className="px-5 pb-10 h-[80vh]">
                     <ImageOption canvasC={canvasC} />
                  </PopoverContent>
               </Popover>

               {/* {draw} */}
               <button
                  onClick={() => {
                     if (!canvasC.current) return;
                     canvasC.current.canvasToggleDrawMode(true);
                  }}
               >
                  <PencilIcon className="w-4 h-4" />
               </button>
            </>
         )}

         {/* {text} */}
         <Popover>
            <PopoverTrigger>
               <TypeIcon className="w-4 h-4" />
            </PopoverTrigger>
            <PopoverContent className="px-5 pb-10">
               <TextOptions
                  handleNewText={(v) => {
                     if (!canvasC.current) return;
                     canvasC.current.createText(v);
                  }}
               />
            </PopoverContent>
         </Popover>

         <Popover>
            <PopoverTrigger>
               <BoxIcon />
            </PopoverTrigger>
            <PopoverContent>
               <Shapes
                  handleShape={({ type, path, points, scale }) => {
                     if (!canvasC.current) return;
                     canvasC.current.createNewShape({
                        shapetype: type,
                        path,
                        points,
                        scale,
                     });
                  }}
               />
            </PopoverContent>
         </Popover>

         {activeObject && isMobile && (
            <>
               <Popover>
                  <PopoverTrigger className="pl-2 text-sm border-l-2 border-foreground/30">
                     <SettingsIcon className="w-6 h-6" />
                  </PopoverTrigger>
                  <PopoverContent sideOffset={20} className="flex gap-2 flex-col bg-background/80">
                     <CollapceWithBtn classname={"px-3 text-sm"} label="Position">
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

                     <CollapceWithBtn label="Actions" classname={"text-sm px-3"}>
                        <ShapeActions canvasC={canvas} />
                     </CollapceWithBtn>

                     <CollapceWithBtn label="Export" classname={"text-sm px-3"}>
                        <ExportShape canvasC={canvas} />
                     </CollapceWithBtn>

                     <OpacityOption
                        fn={(v) => {
                           if (!canvasC.current || !activeObject) return;
                           canvasC.current.changeCanvasProperties(activeObject, {
                              opacity: v,
                           });
                        }}
                        opacity={activeObject?.get("opacity")}
                     />
                  </PopoverContent>

                  {/* <ShapeActions canvasC={canvasC} /> */}
               </Popover>

               <div className="flex items-center gap-2">
                  <Popover>
                     <PopoverTrigger
                        disabled={activeObject == null}
                        className="flex items-center gap-1"
                     >
                        <BtnWithColor w={20} h={20} color={activeObjectFill} />
                     </PopoverTrigger>
                     <PopoverContent
                        side="top"
                        align="center"
                        className="w-fit bg-muted/40 border-foreground/20"
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
            </>
         )}

         <button
            onClick={() => {
               if (!canvasC.current) return;
               canvasC.current.undo();
            }}
         >
            <UndoIcon />
         </button>
         <button
            onClick={() => {
               if (!canvasC.current) return;
               canvasC.current.redo();
            }}
         >
            <RedoIcon />
         </button>
      </div>
   );
}

export default OptionsMobile;
