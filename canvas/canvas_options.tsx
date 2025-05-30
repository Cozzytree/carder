import CanvasC from "./canvas";
import BtnWithColor from "./components/btn-with-color";
import InputWithValue from "./components/input-with-value";
import ColorOptions from "./components/which_option_items/color_options";
import CanvasBackgroundChange from "./components/canvas_background_change_modal";

import { brushes } from "./constants";
import { Gradient } from "fabric";
import { debouncer } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Dispatch, RefObject, SetStateAction } from "react";
import { useCanvasStore, useWhichOptionsOpen } from "./store";
import { handleColorfill, handleGradient } from "./utilsfunc";
import { BrushIcon, FilterIcon, MousePointer2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEditorContext } from "./components/editor-wrapper";

type props = {
   containerRef?: RefObject<HTMLDivElement | null>;
   canvasC: RefObject<CanvasC | null>;

   setContainerZoom?: Dispatch<SetStateAction<number>>;
   containerZoom?: number;
};

function CanvasOptions({}: props) {
   const { canvas } = useEditorContext();
   const { width, setWidth, height, setHeight } = useCanvasStore();
   const setFabricObject = useCanvasStore((state) => state.setFabricObject);
   const activeObject = useCanvasStore((state) => state.activeObject);
   const { setWhichOption } = useWhichOptionsOpen();

   return (
      <TooltipProvider>
         <div className="w-full relative px-2 min-h-16 gap-2 flex items-center">
            <div className="flex flex-col items-center gap-2 text-sm">
               <div className="space-y-2">
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <Popover>
                           <PopoverTrigger className="flex gap-1 items-center px-2">
                              <span className="font-semibold">Fill</span>
                              <BtnWithColor
                                 w={25}
                                 h={25}
                                 onClick={() => {
                                    // setWhichOption("color");
                                 }}
                                 color={
                                    canvas.current?.canvas.backgroundColor as
                                       | string
                                       | Gradient<"linear" | "radical">
                                 }
                              />
                           </PopoverTrigger>
                           <PopoverContent className="w-fit">
                              <ColorOptions
                                 forCanvas={true}
                                 canvasC={canvas}
                                 showGradient={true}
                                 showGradientOptions={true}
                                 width={canvas?.current?.canvas.width ?? 0}
                                 height={canvas?.current?.canvas.height ?? 0}
                                 color={
                                    (canvas?.current?.canvas.backgroundColor as
                                       | string
                                       | Gradient<"linear" | "radial">) || "#ffffff"
                                 }
                                 handleGradient={(g, t) => {
                                    handleGradient({
                                       type: t ? t : "linear",
                                       activeObject: null,
                                       canvasC: canvas,
                                       color: g,
                                       fn: () => {
                                          setFabricObject(activeObject);
                                       },
                                    });
                                 }}
                                 handleColor={(v) => {
                                    handleColorfill({
                                       activeObject: null,
                                       canvasC: canvas,
                                       color: v,
                                       fn: () => {
                                          setFabricObject(activeObject);
                                       },
                                    });
                                 }}
                              />
                           </PopoverContent>
                        </Popover>
                     </TooltipTrigger>
                     <TooltipContent>canvas background color</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                     <TooltipTrigger asChild>
                        <div className="flex flex-col items-center">
                           <InputWithValue
                              change={(e) => {
                                 setWidth(e);
                              }}
                              val={width}
                           >
                              w
                           </InputWithValue>
                           <InputWithValue
                              change={(e) => {
                                 setHeight(e);
                              }}
                              val={height}
                           >
                              h
                           </InputWithValue>
                        </div>
                     </TooltipTrigger>
                     <TooltipContent>canvas parameters</TooltipContent>
                  </Tooltip>
               </div>

               <div>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <CanvasBackgroundChange
                           handleChange={(e) => {
                              canvas.current?.changeCanvasBackground(e);
                              setFabricObject(undefined);
                           }}
                        />
                     </TooltipTrigger>
                     <TooltipContent>canvas background image</TooltipContent>
                  </Tooltip>
               </div>

               {canvas.current && canvas.current.canvas.backgroundImage && (
                  <Button
                     onClick={() => {
                        canvas.current?.removeCanvasBackground();
                        setFabricObject(undefined);
                     }}
                     size={"xs"}
                     variant={"outline"}
                  >
                     Remove Background
                  </Button>
               )}
            </div>

            {canvas.current?.canvas.isDrawingMode && (
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
                                    if (!canvas.current) return;
                                    canvas.current.setBrushType(b.btype);
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
                           className="w-6 h-6 rounded-full border border-foreground/50"
                           style={{
                              background: canvas.current.brush_props.stroke_color,
                           }}
                        />
                     </PopoverTrigger>
                     <PopoverContent className="w-fit flex flex-col gap-2">
                        <ColorOptions
                           canvasC={canvas}
                           width={canvas.current.canvas.width || 0}
                           height={canvas.current.canvas.height || 0}
                           color={
                              canvas.current.canvas.backgroundColor as
                                 | string
                                 | Gradient<"linear" | "radial">
                           }
                           handleColor={(c) => {
                              if (!canvas.current) return;
                              canvas.current?.setBrushColor(c);
                           }}
                        />
                        <div>
                           <h4>Stroke</h4>
                           <Slider
                              min={1}
                              max={100}
                              step={1}
                              defaultValue={[canvas.current.brush_props.stroke]}
                              onValueChange={debouncer((e: number[]) => {
                                 if (!canvas.current) return;
                                 const n = e[0];
                                 if (n < 0) return;
                                 canvas.current?.setBrushWidth(n);
                              })}
                           />
                        </div>
                     </PopoverContent>
                  </Popover>

                  <button
                     onClick={() => {
                        if (!canvas.current) return;
                        canvas.current.canvasToggleDrawMode(false);
                        setWhichOption(null);
                     }}
                  >
                     <MousePointer2 cursor={"pointer"} className="w-5 h-5" />
                  </button>
               </div>
            )}

            {activeObject && activeObject.type === "image" && (
               <Tooltip>
                  <TooltipTrigger asChild>
                     <Button
                        size={"xs"}
                        variant={"simple"}
                        onClick={() => {
                           setWhichOption("image-filters");
                        }}
                     >
                        <FilterIcon />
                     </Button>
                  </TooltipTrigger>
                  <TooltipContent>image filters</TooltipContent>
               </Tooltip>
            )}
         </div>
         <Button
            variant={"simple"}
            size={"sm"}
            className="font-semibold w-full"
            onClick={() => {
               canvas?.current?.canvas.discardActiveObject();
               canvas?.current?.canvas?.requestRenderAll();
               setFabricObject(undefined);
            }}
         >
            Clear Selection
         </Button>
      </TooltipProvider>
   );
}

export default CanvasOptions;
