import CanvasC from "./canvas";
import BtnWithColor from "./components/btn-with-color";
import InputWithValue from "./components/input-with-value";
import ColorOptions from "./components/which_option_items/color_options";
import CanvasBackgroundChange from "./components/canvas_background_change_modal";

import { brushes } from "./constants";
import { Gradient } from "fabric";
import { debouncer } from "@/lib/utils";
import { useIsMobile } from "./hooks/isMobile";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Dispatch, RefObject, SetStateAction } from "react";
import { useCanvasStore, useWhichOptionsOpen } from "./store";
import { handleColorfill, handleGradient } from "./utilsfunc";
import { BrushIcon, FilterIcon, MousePointer2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type props = {
   containerRef?: RefObject<HTMLDivElement | null>;
   canvasC: RefObject<CanvasC | null>;

   setContainerZoom?: Dispatch<SetStateAction<number>>;
   containerZoom?: number;
};

function CanvasOptions({ canvasC }: props) {
   const { isMobile } = useIsMobile();

   return <>{!isMobile && <Options canvasC={canvasC} />}</>;
}

function Options({ canvasC }: { canvasC: RefObject<CanvasC | null> }) {
   const { width, setWidth, height, setHeight } = useCanvasStore();
   const setFabricObject = useCanvasStore((state) => state.setFabricObject);
   const activeObject = useCanvasStore((state) => state.activeObject);
   const { setWhichOption } = useWhichOptionsOpen();

   return (
      <TooltipProvider>
         <div className="w-full relative px-2 min-h-16 gap-2 flex items-center">
            <div className="flex items-center gap-2 text-sm">
               <Tooltip>
                  <TooltipTrigger asChild>
                     <Popover>
                        <PopoverTrigger>
                           <BtnWithColor
                              w={25}
                              h={25}
                              onClick={() => {
                                 // setWhichOption("color");
                              }}
                              color={
                                 canvasC.current?.canvas.backgroundColor as
                                    | string
                                    | Gradient<"linear" | "radical">
                              }
                           />
                        </PopoverTrigger>
                        <PopoverContent>
                           <ColorOptions
                              forCanvas={true}
                              canvasC={canvasC}
                              showGradient={true}
                              showGradientOptions={true}
                              width={canvasC?.current?.canvas.width ?? 0}
                              height={canvasC?.current?.canvas.height ?? 0}
                              color={
                                 (canvasC?.current?.canvas.backgroundColor as
                                    | string
                                    | Gradient<"linear" | "radial">) || "#ffffff"
                              }
                              handleGradient={(g, t) => {
                                 handleGradient({
                                    type: t ? t : "linear",
                                    activeObject: null,
                                    canvasC: canvasC,
                                    color: g,
                                    fn: () => {
                                       setFabricObject(activeObject);
                                    },
                                 });
                              }}
                              handleColor={(v) => {
                                 handleColorfill({
                                    activeObject: null,
                                    canvasC: canvasC,
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

               <Tooltip>
                  <TooltipTrigger asChild>
                     <CanvasBackgroundChange
                        handleChange={(e) => {
                           canvasC.current?.changeCanvasBackground(e);
                           setFabricObject(undefined);
                        }}
                     />
                  </TooltipTrigger>
                  <TooltipContent>canvas background image</TooltipContent>
               </Tooltip>

               {canvasC.current && canvasC.current.canvas.backgroundImage && (
                  <Button
                     onClick={() => {
                        canvasC.current?.removeCanvasBackground();
                        setFabricObject(undefined);
                     }}
                     size={"xs"}
                     variant={"outline"}
                  >
                     Remove Background
                  </Button>
               )}
            </div>

            {canvasC.current?.canvas.isDrawingMode && (
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
                           className="w-6 h-6 rounded-full border border-foreground/50"
                           style={{
                              background: canvasC.current.brush_props.stroke_color,
                           }}
                        />
                     </PopoverTrigger>
                     <PopoverContent className="w-fit flex flex-col gap-2">
                        <ColorOptions
                           canvasC={canvasC}
                           width={canvasC.current.canvas.width || 0}
                           height={canvasC.current.canvas.height || 0}
                           color={
                              canvasC.current.canvas.backgroundColor as
                                 | string
                                 | Gradient<"linear" | "radial">
                           }
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
      </TooltipProvider>
   );
}

export default CanvasOptions;
